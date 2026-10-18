#!/usr/bin/env bash
# park-admin 前端自动部署（部署在京东云服务器上，由 cron 每 2 分钟调用）
#
# 链路：GitHub Actions 构建 → 推送镜像到阿里云 ACR → 本脚本在服务器上检测到
# latest 镜像更新后重建容器。之所以不用 Actions 直接 SSH 部署：GitHub 海外
# 节点到国内服务器的 22 端口链路经常被阻断（详见 2026-10 的部署故障排查）。
#
# ACR 凭证放在仓库外：/data/park/.acr-env（root:600，格式如下）
#   export ACR_USERNAME='xxx'
#   export ACR_PASSWORD='xxx'
set -euo pipefail

# 防止 cron 重叠执行
exec 9>/tmp/park-admin-deploy.lock
flock -n 9 || exit 0

ENV_FILE="${ACR_ENV_FILE:-/data/park/.acr-env}"
[ -f "$ENV_FILE" ] && . "$ENV_FILE"
: "${ACR_USERNAME:?ACR_USERNAME 未设置}"
: "${ACR_PASSWORD:?ACR_PASSWORD 未设置}"

REG=crpi-66pjm0oi7g763epj.cn-hangzhou.personal.cr.aliyuncs.com
IMAGE=$REG/park_java/park-admin-web
CONTAINER=park-nextjs

echo "$ACR_PASSWORD" | docker login "$REG" -u "$ACR_USERNAME" --password-stdin >/dev/null
docker pull -q "$IMAGE:latest" >/dev/null

NEW_ID=$(docker inspect --format '{{.Id}}' "$IMAGE:latest")
OLD_ID=$(docker inspect --format '{{.Image}}' "$CONTAINER" 2>/dev/null || echo none)
if [ "$NEW_ID" = "$OLD_ID" ]; then
  exit 0
fi

echo "$(date '+%F %T') 检测到新镜像 $NEW_ID，重建容器..."
# 先拉取成功才动旧容器；nginx 代理的是宿主机 3000 端口
docker rm -f "$CONTAINER" 2>/dev/null || true
# API 地址是 Next 服务运行时 rewrites 读取的，必须在 docker run 时以环境变量注入
docker run -d \
  --name "$CONTAINER" \
  --restart unless-stopped \
  -p 3000:3000 \
  -v /data/park/logs/nextjs:/app/logs \
  -e NEXT_PUBLIC_API_URL=http://36.151.148.156:3429 \
  "$IMAGE:latest"

docker image prune -f >/dev/null 2>&1 || true
echo "$(date '+%F %T') 部署完成"

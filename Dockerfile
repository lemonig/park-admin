# syntax=docker/dockerfile:1

# ==================== Stage 1: Base & Deps ====================
FROM node:22-alpine AS base
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

# ==================== Stage 2: Dependencies ====================
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --frozen-lockfile --ignore-scripts

# ==================== Stage 3: Builder ====================
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 启用 standalone 输出（Next.js 官方推荐生产方式，镜像更小）
RUN npm run build

# ==================== Stage 4: Production Runner ====================
FROM base AS runner
WORKDIR /app

ENV PORT=3000 \
    HOSTNAME="0.0.0.0"

# 只复制必要的文件（standalone 模式下非常精简）
COPY --from=builder /app/next.config.* ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 非 root 用户运行（安全最佳实践）
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs
USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
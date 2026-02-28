# 00-project-purpose.md
## 项目根本目的（最重要，AI 必须始终记住）

这是一个 **地下车位租售信息平台** 的后台管理系统（Web 端）。

核心价值：  
- 让小区居民/业主在平台上发布、浏览、联系车位租售信息  
- 平台仅做信息中介，不参与交易、不托管资金、不提供担保  
- 管理员通过后台审核内容、维护用户、管理分类字典

一句话总结：  
“小区车位信息真实可信的中介平台后台”

## 技术约束（AI 生成代码必须严格遵守）

后端
- JDK 21
- Spring Boot 3.2.3
- Maven 3.9.7
- 数据库：MySQL 8.x
- ORM：纯 MyBatis（mybatis-spring-boot-starter 3.0.3），**禁止使用 MyBatis-Plus**
- 分页：PageHelper-spring-boot-starter
- 文件存储：腾讯云 COS
- 统一响应：ApiResponse<T>（code=0成功，message，data，timestamp）
- 接口风格：RESTful，查询用 GET，新增 POST，更新 PUT，删除 DELETE
- 认证：JWT（jjwt 0.12.6）

前端
- Next.js 16.0.10（App Router）
- Ant Design 6.0.1
- @ant-design/pro-components 2.8.10（必须大量使用 ProTable、ModalForm、ProForm 等）
- 路由保护：protected 目录下所有页面需登录，未登录跳转 /login
- 请求库：axios（统一封装在 services/request.ts，带 token 拦截）

## 项目原则（AI 生成代码必须遵循）

1. 代码风格统一
   - 后端：Lombok + 驼峰命名，Service 层事务 @Transactional，Controller 层简单（校验 + 调用 service）
   - 前端：函数组件 + hooks，ProTable 是列表首选，ModalForm 是弹窗表单首选

2. 优先级顺序（AI 补全时要考虑先后）
   - 先保证登录 + 权限（token 校验）
   - 车位管理（列表、分页、增删改查、图片上传）必须完整稳定
   - 用户管理次之
   - 字典管理再次之

3. 安全与合规
   - 手机号、密码等敏感字段脱敏或不返回前端
   - 所有增删改操作加事务
   - 图片上传使用腾讯云 COS 临时凭证（STS）

4. 命名规范
   - 实体：Market（车位市场）、User（用户）
   - 表名：market、users、market_images、files、dict_type、dict_item
   - 接口路径：/market/list、/market/add、pi/market/update、/market/delete/{id}

5. 当前已完成（AI 不要重复造轮子）
   - 登录页 + token 存储
   - 车位管理基本 CRUD（列表、新增、编辑、删除）
   - 用户管理基本列表

6. 当前最急需补全（AI 优先考虑这些方向）
   - 车位审核功能（批量/单个通过/拒绝）
   - 字典管理模块（type + item 的 CRUD + 排序）
   - 全局异常处理 + loading 效果优化

最后一条铁律：
所有代码生成必须严格遵守以上技术栈、命名规范、RESTful 原则，不得引入 MyBatis-Plus、MyBatis Generator 插件、Joda-Time 等已废弃/冲突的技术。
必须遵循 Next.js App Router 最新最佳实践（2025-2026）：

- 页面/布局默认 server component
- 数据获取统一用 async/await + axios 或 server actions
- 优先 React Server Components，client 组件最小化
- loading.tsx / error.tsx / not-found.tsx 必须有
- 路由组 (/) 用来组织 layout，不产生 URL
<!-- - metadata / generateMetadata 写在 page/layout 里，做 SEO -->
- 图片用 next/image，自动优化
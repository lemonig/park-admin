/*
 * @Author: Jonny
 * @Date: 2025-12-18 09:45:56
 * @LastEditors: Jonny
 * @LastEditTime: 2025-12-29 19:29:18
 * @FilePath: \park-web\next.config.ts
 */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*', // 前端所有 /api/* 请求
        destination: 'http://localhost:3429/api/:path*', // 代理到您的 Spring Boot 后端（改成您的端口/IP）
      },
    ];
  },
};

export default nextConfig;
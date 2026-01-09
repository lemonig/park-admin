/*
 * @Author: Jonny
 * @Date: 2025-12-18 09:45:56
 * @LastEditors: Jonny
 * @LastEditTime: 2026-01-07 19:35:44
 * @FilePath: \park-web\next.config.ts
 */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:3429/api/:path*',
      },
    ];
  },
};

export default nextConfig;
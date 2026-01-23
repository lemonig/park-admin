/*
 * @Author: Jonny
 * @Date: 2025-12-18 09:45:56
 * @LastEditors: Jonny
 * @LastEditTime: 2026-01-22 18:53:13
 * @FilePath: \park-admin\next.config.ts
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // 静态导出必须开启
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3429/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;

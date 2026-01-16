/*
 * @Author: Jonny
 * @Date: 2025-12-18 09:45:56
 * @LastEditors: Jonny
 * @LastEditTime: 2026-01-14 19:20:36
 * @FilePath: \park-web\next.config.ts
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
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

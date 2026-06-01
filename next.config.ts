/*
 * @Author: Jonny
 * @Date: 2025-12-18 09:45:56
 * @LastEditors: Jonny
 * @LastEditTime: 2026-01-22 18:53:13
 * @FilePath: \park-admin\next.config.ts
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true, // 静态导出必须开启
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // destination: 'http://localhost:3429/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL 
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/:path*` 
          : 'http://localhost:3429/api/:path*',   // 本地默认后端地址
        
        
      },
    ];
  },
};

module.exports = nextConfig;

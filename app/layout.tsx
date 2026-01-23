/*
 * @Author: Jonny
 * @Date: 2025-12-18 09:45:56
 * @LastEditors: Jonny
 * @LastEditTime: 2026-01-22 19:07:01
 * @FilePath: \park-admin\app\layout.tsx
 */
import type { Metadata } from "next";

// 全局样式（只放“绝对全局”的）
import "@/styles/globals.css";
import "antd/dist/reset.css";

// UI / 基础设施级 Provider
import { AntdRegistry } from "@ant-design/nextjs-registry";
import Providers from './providers'

export const metadata: Metadata = {
  title: {
    default: "Admin System",
    template: "%s | Admin System",
  },
  description: "Enterprise Admin System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        {/* 
          AntdRegistry 只做样式收集
          不涉及用户态 / 业务态
        */}
        <AntdRegistry>
          <Providers>
            {children}
          </Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}

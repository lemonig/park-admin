/*
 * @Author: Jonny
 * @Date: 2025-12-18 09:45:56
 * @LastEditors: Jonny
 * @LastEditTime: 2025-12-18 15:43:08
 * @FilePath: \park-web\app\page.tsx
 */
import 'antd/dist/reset.css';
import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: '车位管理系统',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="zh">
      <body>
        {children}
      </body>
    </html>
  );
}

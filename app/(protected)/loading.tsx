/*
 * @Author: Jonny
 * @Date: 2025-12-18 16:26:11
 * @LastEditors: Jonny
 * @LastEditTime: 2025-12-25 19:46:51
 * @FilePath: \park-web\app\(protected)\loading.tsx
 */
// app/protected/loading.tsx
// （假设您的受保护路由文件夹是 app/protected，或 app/admin/protected 等，根据实际路径放置）

"use client";

import React from "react";
import { Spin } from "antd";
import Image from "next/image";

export default function Loading() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#fff",
      }}
    >
      {/* 您的系统 logo，可替换为自己的图片 */}
      <Image src="/logo.png" alt="Logo" width={120} height={120} priority />
      <Spin size="large" tip="加载中，请稍候..." style={{ marginTop: 32 }} />
    </div>
  );
}

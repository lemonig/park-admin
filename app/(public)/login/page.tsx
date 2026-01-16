/*
 * @Author: Jonny
 * @Date: 2025-12-18 15:02:25
 * @LastEditors: Jonny
 * @LastEditTime: 2026-01-15 19:37:40
 * @FilePath: \park-web\app\(public)\login\page.tsx
 */
"use client";

import { Button, Form, Input, Card, Typography, message } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "@/services/user";

const { Title } = Typography;

interface LoginResponse {
  code: number;
  message?: string;
  data?: {
    token: string;
    userInfo: {
      id: number;
      username: string;
      name?: string;
      roles?: string[];
      // 根据实际后端返回字段补充
    };
  };
}

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const result: any = await login(values);

      if (result.code === 0 && result.data) {
        // 登录成功
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("userInfo", JSON.stringify(result.data.userInfo));

        messageApi.success("登录成功");

        // 跳转到首页（根据你的路由结构修改路径）
        router.push("/market");
      } else {
        // 后端返回业务错误
        messageApi.error(result.message || "登录失败，请检查用户名或密码");
      }
    } catch (error) {
      // 网络错误或其他异常
      messageApi.error("网络异常，请稍后重试");
      console.error("登录请求异常:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div style={styles.container}>
        <Card style={styles.card}>
          <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
            后台管理系统
          </Title>

          <Form
            name="login"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="用户名"
              name="username"
              rules={[{ required: true, message: "请输入用户名" }]}
            >
              <Input placeholder="请输入用户名" />
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              rules={[{ required: true, message: "请输入密码" }]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                登录
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f0f2f5",
  },
  card: {
    width: 360,
  },
};

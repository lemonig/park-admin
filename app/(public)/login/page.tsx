/*
 * @Author: Jonny
 * @Date: 2025-12-18 15:02:25
 * @LastEditors: Jonny
 * @LastEditTime: 2026-01-22 19:28:05
 * @FilePath: \park-admin\app\(public)\login\page.tsx
 */
'use client';



import { Button, Form, Input, Card, message } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "@/services/user";

interface LoginResult {
  id: number;
  nickname?: string;
  mobile?: string;
  token: string;
}

// services/request.ts 的响应拦截器返回的是响应体（ApiResponse），不是 AxiosResponse
interface LoginResponse {
  code: number;
  success?: boolean;
  message?: string;
  data?: LoginResult;
}

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: { account: string; password: string }) => {
    setLoading(true);
    try {
      const res = (await login(values)) as unknown as LoginResponse;
      const result = res?.data;

      // 拦截器保证只有业务成功才走到这里，这里兜底 data 里没有 token 的异常结构
      if (!result?.token) {
        messageApi.error(res?.message || "登录失败，请稍后重试");
        return;
      }

      // 登录成功
      localStorage.setItem("token", result.token);

      messageApi.success("登录成功");

      router.push("/market");
      // 跳转到首页（根据你的路由结构修改路径）

    } catch (error) {
      // 业务错误提示由 services/request.ts 响应拦截器统一弹出，这里只记录
      console.error("登录请求异常:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div style={styles.container}>
        <div style={styles.overlay}></div>
          <Card style={styles.card} styles={{ body: { padding: 0 } }}>
          <div style={{ padding: "40px 32px" }}>
            <div style={styles.title}>
              废液管理系统
            </div>

            <Form
              name="login"
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
              style={styles.form}
              initialValues={{ account: "admin", password: "park123" }}
            >
              <Form.Item
                label={<span style={{ fontSize: "16px", fontWeight: 500, color: "#374151" }}>用户名</span>}
                name="account"
                rules={[{ required: true, message: "请输入用户名" }]}
                style={styles.formItem}
              >
                <Input
                  placeholder="请输入用户名"
                  style={styles.input}
                  prefix={<span style={{ color: "#9ca3af", marginRight: 8 }}>👤</span>}
                />
              </Form.Item>

              <Form.Item
                label={<span style={{ fontSize: "16px", fontWeight: 500, color: "#374151" }}>密码</span>}
                name="password"
                rules={[{ required: true, message: "请输入密码" }]}
                style={styles.formItem}
              >
                <Input.Password
                  placeholder="请输入密码"
                  style={styles.input}
                  prefix={<span style={{ color: "#9ca3af", marginRight: 8 }}>🔒</span>}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  style={styles.button}
                >
                  {loading ? "登录中..." : "登录"}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Card>
      </div>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // backgroundImage: "url('/images/bg.jpg')",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    position: "relative",
    padding: "20px",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    backdropFilter: "blur(2px)",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 16,
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    background: "rgba(255, 255, 255, 0.95)",
    position: "relative",
    zIndex: 1,
    padding: "8px",
  },
  title: {
    textAlign: "center",
    marginBottom: 32,
    fontSize: "28px",
    fontWeight: 600,
    color: "#1f2937",
    textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
  },
  form: {
    padding: "0 8px",
  },
  formItem: {
    marginBottom: 24,
  },
  input: {
    height: 48,
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    fontSize: 16,
    transition: "all 0.3s ease",
  },
  button: {
    height: 48,
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 500,
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    border: "none",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
    transition: "all 0.3s ease",
    marginTop: 8,
  },
};

/*
 * @Author: Jonny
 * @Date: 2025-12-18 16:21:34
 * @LastEditors: Jonny
 * @LastEditTime: 2026-02-12 09:40:52
 * @FilePath: \park-admin\app\(protected)\layout.tsx
 */
"use client";

import { Layout, Menu, Avatar, Dropdown, Typography, Space } from "antd";
import { CarOutlined, UserOutlined, LogoutOutlined, SettingOutlined, BellOutlined } from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import type { MenuProps } from "antd";

const { Sider, Content, Header } = Layout;
const { Title } = Typography;

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <SettingOutlined />,
      label: '个人设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
      {/* 左侧菜单 */}
      <Sider
        width={260}
        style={{
          background: "linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%)",
          boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
          borderRadius: "0 12px 12px 0",
          overflow: "hidden",
        }}
        className="custom-sider"
      >
        {/* Logo区域 */}
        <div
          style={{
            height: 80,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -20,
              right: -20,
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -30,
              left: -30,
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
            }}
          />
          <div style={{ textAlign: "center", zIndex: 1 }}>
            <CarOutlined style={{ fontSize: 28, color: "#fff", marginBottom: 4 }} />
            <div style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>
              车位管理系统
            </div>
          </div>
        </div>

        {/* 菜单 */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          onClick={({ key }) => router.push(key)}
          style={{
            background: "transparent",
            border: "none",
            marginTop: 16,
          }}
          items={[
            {
              key: "/market",
              icon: <CarOutlined style={{ fontSize: 16 }} />,
              label: "车位管理",
              style: {
                margin: "4px 12px",
                borderRadius: 8,
                transition: "all 0.3s ease",
              },
            },
            {
              key: "/users",
              icon: <UserOutlined style={{ fontSize: 16 }} />,
              label: "用户管理",
              style: {
                margin: "4px 12px",
                borderRadius: 8,
                transition: "all 0.3s ease",
              },
            },
          ]}
        />
      </Sider>

      {/* 内容区 */}
      <Layout style={{ background: "#f5f7fa" }}>
        {/* 头部 */}
        <Header
          style={{
            background: "linear-gradient(90deg, #fff 0%, #f8f9ff 100%)",
            padding: "0 24px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            borderBottom: "1px solid #e8e8e8",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Title level={4} style={{ margin: 0, color: "#1a1a1a" }}>
            <Space>
              <div
                style={{
                  width: 6,
                  height: 24,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: 3,
                }}
              />
              后台管理
            </Space>
          </Title>

          <Space size="large">
            <BellOutlined
              style={{
                fontSize: 18,
                color: "#666",
                cursor: "pointer",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#667eea"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#666"}
            />

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: "pointer" }}>
                <Avatar
                  style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    boxShadow: "0 2px 8px rgba(102,126,234,0.3)",
                  }}
                >
                  管
                </Avatar>
                <span style={{ color: "#666", fontSize: 14 }}>管理员</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        {/* 主要内容 */}
        <Content
          style={{
            margin: 24,
            background: "#f5f7fa",
            minHeight: "calc(100vh - 112px)",
          }}
        >
          <div
            style={{
              padding: 32,
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "1px solid #f0f0f0",
              minHeight: "calc(100vh - 176px)",
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>

      <style jsx global>{`
        .custom-sider .ant-menu-item {
          border-radius: 8px !important;
          margin: 4px 12px !important;
          transition: all 0.3s ease !important;
        }

        .custom-sider .ant-menu-item:hover {
          background: rgba(255,255,255,0.1) !important;
          transform: translateX(4px) !important;
        }

        .custom-sider .ant-menu-item-selected {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          box-shadow: 0 2px 8px rgba(102,126,234,0.3) !important;
        }

        .custom-sider .ant-menu-item-selected:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          transform: translateX(4px) !important;
        }
      `}</style>
    </Layout>
  );
}

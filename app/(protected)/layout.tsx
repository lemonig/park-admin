/*
 * @Author: Jonny
 * @Date: 2025-12-18 16:21:34
 * @LastEditors: Jonny
 * @LastEditTime: 2025-12-18 17:17:09
 * @FilePath: \park-web\app\(protected)\layout.tsx
 */
'use client';

import { Layout, Menu } from 'antd';
import {
  CarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { usePathname, useRouter } from 'next/navigation';

const { Sider, Content, Header } = Layout;

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 左侧菜单 */}
      <Sider width={200}>
        <div
          style={{
            height: 64,
            color: '#fff',
            textAlign: 'center',
            lineHeight: '64px',
            fontSize: 16,
          }}
        >
          车位管理系统
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          onClick={({ key }) => router.push(key)}
          items={[
            {
              key: '/carport',
              icon: <CarOutlined />,
              label: '车位管理',
            },
            {
              key: '/users',
              icon: <UserOutlined />,
              label: '用户管理',
            },
          ]}
        />
      </Sider>

      {/* 内容区 */}
      <Layout>
        <Header style={{ background: '#fff', paddingLeft: 16 }}>
          后台管理
        </Header>

        <Content style={{ margin: 16 }}>
          <div style={{ padding: 24, background: '#fff' }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

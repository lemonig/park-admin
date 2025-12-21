'use client';

import { Table, Button, Space, Tag, Popconfirm, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface User {
  id: number;
  username: string;
  role: string;
  status: 'active' | 'disabled';
  createdAt: string;
}

const dataSource: User[] = [
  {
    id: 1,
    username: 'admin',
    role: '管理员',
    status: 'active',
    createdAt: '2024-12-01',
  },
  {
    id: 2,
    username: 'test_user',
    role: '普通用户',
    status: 'disabled',
    createdAt: '2024-12-05',
  },
];

export default function UserPage() {
  const columns: ColumnsType<User> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '角色',
      dataIndex: 'role',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status) =>
        status === 'active' ? (
          <Tag color="green">启用</Tag>
        ) : (
          <Tag color="red">禁用</Tag>
        ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => message.info(`编辑 ${record.username}`)}>
            编辑
          </Button>
          <Popconfirm
            title="确认删除该用户？"
            onConfirm={() => message.success(`已删除 ${record.username}`)}
          >
            <Button danger type="link">
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>用户管理</h2>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}

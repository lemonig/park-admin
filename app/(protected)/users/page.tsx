'use client';

import { useEffect, useState } from 'react';
import { ArrowLeftOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Descriptions, Form, Input, message, Modal, Popconfirm, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { userAdd, userDelete, userDetail, userList, userResetPassword, userUpdate } from '@/services/user';

interface User {
  id?: number;
  name?: string;
  doorplate?: string;
  account?: string;
  password?: string;
  mobile?: string;
  avatar?: string;
  description?: string;
  gmtCreate?: string | Date;
  gmtModify?: string | Date;
  gmtActive?: string | Date;
}

export default function UserPage() {
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [dataSource, setDataSource] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailRecord, setDetailRecord] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm<User>();

  const formatDate = (date?: string | Date) => date ? new Date(date).toLocaleString() : '-';

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userList();
      const data = res?.data?.data ?? res?.data ?? [];
      setDataSource(Array.isArray(data) ? data : []);
    } catch {
      message.error('加载用户失败');
      setDataSource([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = async (record: User) => {
    if (!record.id) return;
    setEditingId(record.id);
    try {
      const res = await userDetail({ id: record.id });
      const detail = res?.data?.data ?? res?.data ?? record;
      form.setFieldsValue(detail);
      setModalOpen(true);
    } catch {
      message.error('获取用户详情失败');
    }
  };

  const openDetail = async (record: User) => {
    if (!record.id) return;
    try {
      const res = await userDetail({ id: record.id });
      setDetailRecord(res?.data?.data ?? res?.data ?? record);
      setView('detail');
    } catch {
      message.error('获取用户详情失败');
      setDetailRecord(record);
      setView('detail');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingId != null) {
        const updateValues = { ...values };
        delete updateValues.password;
        await userUpdate({ ...updateValues, id: editingId });
        message.success('编辑成功');
      } else {
        await userAdd(values);
        message.success('新增成功');
      }
      setModalOpen(false);
      fetchUsers();
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'errorFields' in error) return;
      message.error(editingId != null ? '编辑失败' : '新增失败');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await userDelete({ id });
      message.success('删除成功');
      fetchUsers();
    } catch {
      message.error('删除失败');
    }
  };

  const handleResetPassword = (record: User) => {
    if (!record.id) return;
    Modal.confirm({
      title: '确认重置密码？',
      content: `用户 ${record.account || record.name || record.id} 的密码将重置为 123456`,
      okText: '确认重置',
      cancelText: '取消',
      okButtonProps: { danger: true },
      async onOk() {
        try {
          await userResetPassword({ id: record.id! });
          message.success('密码已重置为 123456');
        } catch {
          message.error('重置密码失败');
        }
      },
    });
  };

  const columns: ColumnsType<User> = [
    {
      title: '序号',
      width: 80,
      render: (_, __, index) => index + 1,
    },
    {
      title: '账号',
      dataIndex: 'account',
      render: (account: string, record) => (
        <Button type="link" size="small" onClick={() => openDetail(record)}>
          {account || '-'}
        </Button>
      ),
    },
    { title: '姓名', dataIndex: 'name' },
    { title: '门牌号', dataIndex: 'doorplate' },
    { title: '手机号', dataIndex: 'mobile' },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      render: formatDate,
    },
    {
      title: '操作',
      key: 'action',
      width: 260,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => openEdit(record)}>
            编辑
          </Button>
          <Button type="link" size="small" danger onClick={() => handleResetPassword(record)}>
            重置密码
          </Button>
          <Popconfirm
            title="确认删除该用户？"
            onConfirm={() => record.id != null && handleDelete(record.id)}
          >
            <Button danger type="link" size="small">
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (view === 'detail') {
    return (
      <div style={{ padding: 24 }}>
        <Space style={{ marginBottom: 16 }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => setView('list')}>
            返回用户列表
          </Button>
          {detailRecord?.id && (
            <Button type="primary" onClick={() => openEdit(detailRecord)}>
              编辑
            </Button>
          )}
        </Space>
        <h2>用户详情</h2>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="账号">{detailRecord?.account || '-'}</Descriptions.Item>
          <Descriptions.Item label="姓名">{detailRecord?.name || '-'}</Descriptions.Item>
          <Descriptions.Item label="门牌号">{detailRecord?.doorplate || '-'}</Descriptions.Item>
          <Descriptions.Item label="手机号">{detailRecord?.mobile || '-'}</Descriptions.Item>
          <Descriptions.Item label="头像">{detailRecord?.avatar || '-'}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{formatDate(detailRecord?.gmtCreate)}</Descriptions.Item>
          <Descriptions.Item label="更新时间">{formatDate(detailRecord?.gmtModify)}</Descriptions.Item>
          <Descriptions.Item label="活跃时间">{formatDate(detailRecord?.gmtActive)}</Descriptions.Item>
          <Descriptions.Item label="描述" span={2}>{detailRecord?.description || '-'}</Descriptions.Item>
        </Descriptions>
        <UserModal
          open={modalOpen}
          editingId={editingId}
          form={form}
          onOk={handleSubmit}
          onCancel={() => setModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>用户管理</h2>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
          新增用户
        </Button>
        <Button icon={<ReloadOutlined />} onClick={fetchUsers}>
          刷新
        </Button>
      </Space>
      <Table<User>
        rowKey="id"
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
      <UserModal
        open={modalOpen}
        editingId={editingId}
        form={form}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
}

function UserModal({
  open,
  editingId,
  form,
  onOk,
  onCancel,
}: {
  open: boolean;
  editingId: number | null;
  form: ReturnType<typeof Form.useForm<User>>[0];
  onOk: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal
      title={editingId != null ? '编辑用户' : '新增用户'}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      destroyOnHidden
      width={560}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item name="account" label="账号" rules={[{ required: true, message: '请输入账号' }]}>
          <Input placeholder="请输入账号" disabled={editingId != null} />
        </Form.Item>
        {editingId == null && (
          <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
        )}
        <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
          <Input placeholder="请输入姓名" />
        </Form.Item>
        <Form.Item name="doorplate" label="门牌号" rules={[{ required: true, message: '请输入门牌号' }]}>
          <Input placeholder="请输入门牌号" />
        </Form.Item>
        <Form.Item name="mobile" label="手机号">
          <Input placeholder="请输入手机号" />
        </Form.Item>
        <Form.Item name="avatar" label="头像">
          <Input placeholder="请输入头像地址" />
        </Form.Item>
        <Form.Item name="description" label="描述">
          <Input.TextArea rows={3} placeholder="请输入描述" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

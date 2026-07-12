'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  Popconfirm,
  message,
  Pagination,
} from 'antd';
import { ArrowLeftOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { DictType, DictItem, PageVO } from '@/types/dict';
import {
  getTypeList,
  getTypeDetail,
  createType,
  updateType,
  deleteType,
  getItemList,
  getItemDetail,
  createItem,
  updateItem,
  deleteItem,
} from '@/services/dect';

const STATUS_OPTIONS = [
  { label: '启用', value: 1 },
  { label: '禁用', value: 0 },
];

export default function DictPage() {
  const [view, setView] = useState<'type' | 'item'>('type');

  // 字典类型
  const [typeList, setTypeList] = useState<DictType[]>([]);
  const [typeLoading, setTypeLoading] = useState(false);
  const [typePage, setTypePage] = useState({ current: 1, pageSize: 10 });
  const [typeTotal, setTypeTotal] = useState(0);
  const [typeModalOpen, setTypeModalOpen] = useState(false);
  const [typeEditingId, setTypeEditingId] = useState<number | null>(null);
  const [typeForm] = Form.useForm();

  // 字典项
  const [itemList, setItemList] = useState<DictItem[]>([]);
  const [itemLoading, setItemLoading] = useState(false);
  const [itemPage, setItemPage] = useState({ current: 1, pageSize: 10 });
  const [itemTotal, setItemTotal] = useState(0);
  const [selectedType, setSelectedType] = useState<DictType | null>(null);
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [itemEditingId, setItemEditingId] = useState<number | null>(null);
  const [itemForm] = Form.useForm();

  const fetchTypeList = useCallback(async () => {
    setTypeLoading(true);
    try {
      const res = await getTypeList({
        pageNum: typePage.current,
        pageSize: typePage.pageSize,
      });
      const data = (res as any)?.data ?? [];
      const page = (res as any)?.page as PageVO | undefined;
      setTypeList(Array.isArray(data) ? data : []);
      setTypeTotal(page?.total ?? 0);
    } catch {
      setTypeList([]);
      setTypeTotal(0);
    } finally {
      setTypeLoading(false);
    }
  }, [typePage.current, typePage.pageSize]);

  const fetchItemList = useCallback(async () => {
    if (!selectedType?.code) {
      setItemList([]);
      setItemTotal(0);
      return;
    }
    setItemLoading(true);
    try {
      const res = await getItemList({
        typeCode: selectedType.code,
        pageNum: itemPage.current,
        pageSize: itemPage.pageSize,
      });
      const data = (res as any)?.data ?? [];
      const page = (res as any)?.page as PageVO | undefined;
      setItemList(Array.isArray(data) ? data : []);
      setItemTotal(page?.total ?? data.length ?? 0);
    } catch {
      setItemList([]);
      setItemTotal(0);
    } finally {
      setItemLoading(false);
    }
  }, [selectedType?.code, itemPage.current, itemPage.pageSize]);

  useEffect(() => {
    if (view === 'type') fetchTypeList();
  }, [view, fetchTypeList]);

  useEffect(() => {
    if (view === 'item') fetchItemList();
  }, [view, fetchItemList]);

  const openTypeAdd = () => {
    setTypeEditingId(null);
    typeForm.resetFields();
    setTypeModalOpen(true);
  };

  const openTypeEdit = async (record: DictType) => {
    const id = record.id;
    if (id == null) return;
    setTypeEditingId(id);
    try {
      const res = await getTypeDetail({ id });
      const detail = (res as any)?.data ?? record;
      typeForm.setFieldsValue({
        name: detail.name ?? record.name,
        code: detail.code ?? record.code,
        description: detail.description ?? record.description,
        status: detail.status ?? record.status ?? 1,
      });
      setTypeModalOpen(true);
    } catch {
      message.error('获取详情失败');
    }
  };

  const handleTypeSubmit = async () => {
    try {
      const values = await typeForm.validateFields();
      if (typeEditingId != null) {
        await updateType({ ...values, id: typeEditingId });
        message.success('更新成功');
      } else {
        await createType(values);
        message.success('新增成功');
      }
      setTypeModalOpen(false);
      fetchTypeList();
    } catch (e: any) {
      if (e?.errorFields) return;
      message.error(typeEditingId != null ? '更新失败' : '新增失败');
    }
  };

  const handleTypeDelete = async (id: number) => {
    try {
      await deleteType({ id });
      message.success('删除成功');
      fetchTypeList();
    } catch {
      message.error('删除失败');
    }
  };

  const openItems = (record: DictType) => {
    setSelectedType(record);
    setItemPage((page) => ({ ...page, current: 1 }));
    setView('item');
  };

  const backToTypes = () => {
    setView('type');
    setSelectedType(null);
    setItemList([]);
    fetchTypeList();
  };

  const openItemAdd = () => {
    if (!selectedType?.code) {
      message.warning('请先选择字典类型');
      return;
    }
    setItemEditingId(null);
    itemForm.resetFields();
    itemForm.setFieldsValue({
      typeCode: selectedType.code,
      status: 1,
      sort: 0,
    });
    setItemModalOpen(true);
  };

  const openItemEdit = async (record: DictItem) => {
    const id = record.id;
    if (id == null) return;
    setItemEditingId(id);
    try {
      const res = await getItemDetail({ id });
      const detail = (res as any)?.data ?? record;
      itemForm.setFieldsValue({
        typeCode: detail.typeCode ?? record.typeCode ?? selectedType?.code,
        label: detail.label ?? record.label,
        value: detail.value ?? record.value,
        sort: detail.sort ?? record.sort ?? 0,
        status: detail.status ?? record.status ?? 1,
      });
      setItemModalOpen(true);
    } catch {
      message.error('获取详情失败');
    }
  };

  const handleItemSubmit = async () => {
    try {
      const values = await itemForm.validateFields();
      if (itemEditingId != null) {
        await updateItem({ ...values, id: itemEditingId });
        message.success('更新成功');
      } else {
        await createItem(values);
        message.success('新增成功');
      }
      setItemModalOpen(false);
      fetchItemList();
    } catch (e: any) {
      if (e?.errorFields) return;
      message.error(itemEditingId != null ? '更新失败' : '新增失败');
    }
  };

  const handleItemDelete = async (id: number) => {
    try {
      await deleteItem({ id });
      message.success('删除成功');
      fetchItemList();
    } catch {
      message.error('删除失败');
    }
  };

  const typeColumns: ColumnsType<DictType> = [
    {
      title: '序号',
      width: 80,
      render: (_, __, index) => (typePage.current - 1) * typePage.pageSize + index + 1,
    },
    { title: '编码', dataIndex: 'code', width: 120 },
    { title: '名称', dataIndex: 'name', width: 140 },
    { title: '描述', dataIndex: 'description', ellipsis: true },
    {
      title: '子项',
      dataIndex: 'itemCount',
      width: 100,
      render: (count: number | undefined, record) => (
        <Button type="link" size="small" onClick={() => openItems(record)}>
          {count ?? 0}
        </Button>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (status: number) => (
        <Tag color={status === 1 ? 'green' : 'default'}>
          {status === 1 ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 180,
      render: (t: any) => (t ? new Date(t).toLocaleString() : '-'),
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => openTypeEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除该字典类型？"
            onConfirm={() => record.id != null && handleTypeDelete(record.id)}
          >
            <Button type="link" danger size="small">
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const itemColumns: ColumnsType<DictItem> = [
    {
      title: '序号',
      width: 80,
      render: (_, __, index) => (itemPage.current - 1) * itemPage.pageSize + index + 1,
    },
    { title: '标签', dataIndex: 'label', width: 140 },
    { title: '值', dataIndex: 'value', width: 120 },
    { title: '排序', dataIndex: 'sort', width: 80 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (status: number) => (
        <Tag color={status === 1 ? 'green' : 'default'}>
          {status === 1 ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 180,
      render: (t: any) => (t ? new Date(t).toLocaleString() : '-'),
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => openItemEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除该字典项？"
            onConfirm={() => record.id != null && handleItemDelete(record.id)}
          >
            <Button type="link" danger size="small">
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>
        {view === 'type' ? '字典管理' : `字典项：${selectedType?.name ?? selectedType?.code ?? ''}`}
      </h2>

      {view === 'type' ? (
        <>
          <Space style={{ marginBottom: 16 }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={openTypeAdd}>
              新增类型
            </Button>
            <Button icon={<ReloadOutlined />} onClick={fetchTypeList}>
              刷新
            </Button>
          </Space>
          <Table<DictType>
            rowKey="id"
            columns={typeColumns}
            dataSource={typeList}
            loading={typeLoading}
            pagination={false}
            scroll={{ x: 1000 }}
          />
          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <Pagination
              current={typePage.current}
              pageSize={typePage.pageSize}
              total={typeTotal}
              showSizeChanger
              showQuickJumper
              showTotal={(t) => `共 ${t} 条`}
              onChange={(page, pageSize) =>
                setTypePage({ current: page, pageSize: pageSize || 10 })
              }
            />
          </div>
        </>
      ) : (
        <>
          <Space style={{ marginBottom: 16 }} wrap>
            <Button icon={<ArrowLeftOutlined />} onClick={backToTypes}>
              返回字典类型
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={openItemAdd}>
              新增项
            </Button>
            <Button icon={<ReloadOutlined />} onClick={fetchItemList}>
              刷新
            </Button>
          </Space>
          <Table<DictItem>
            rowKey="id"
            columns={itemColumns}
            dataSource={itemList}
            loading={itemLoading}
            pagination={false}
            scroll={{ x: 800 }}
          />
          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <Pagination
              current={itemPage.current}
              pageSize={itemPage.pageSize}
              total={itemTotal}
              showSizeChanger
              showQuickJumper
              showTotal={(t) => `共 ${t} 条`}
              onChange={(page, pageSize) =>
                setItemPage({ current: page, pageSize: pageSize || 10 })
              }
            />
          </div>
        </>
      )}

      {/* 字典类型 新增/编辑 弹窗 */}
      <Modal
        title={typeEditingId != null ? '编辑字典类型' : '新增字典类型'}
        open={typeModalOpen}
        onOk={handleTypeSubmit}
        onCancel={() => setTypeModalOpen(false)}
        destroyOnClose
        width={520}
      >
        <Form form={typeForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input placeholder="字典类型名称" />
          </Form.Item>
          <Form.Item
            name="code"
            label="编码"
            rules={[{ required: true, message: '请输入编码' }]}
          >
            <Input placeholder="如 sys_status" disabled={typeEditingId != null} />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} placeholder="可选" />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true }]}
            initialValue={1}
          >
            <Select options={STATUS_OPTIONS} placeholder="请选择" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 字典项 新增/编辑 弹窗 */}
      <Modal
        title={itemEditingId != null ? '编辑字典项' : '新增字典项'}
        open={itemModalOpen}
        onOk={handleItemSubmit}
        onCancel={() => setItemModalOpen(false)}
        destroyOnClose
        width={520}
      >
        <Form form={itemForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="typeCode" label="字典类型编码" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name="label"
            label="标签"
            rules={[{ required: true, message: '请输入标签' }]}
          >
            <Input placeholder="显示文本" />
          </Form.Item>
          <Form.Item
            name="value"
            label="值"
            rules={[{ required: true, message: '请输入值' }]}
          >
            <Input placeholder="实际值/编码" />
          </Form.Item>
          <Form.Item name="sort" label="排序" initialValue={0}>
            <Input type="number" placeholder="数字越小越靠前" />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true }]}
            initialValue={1}
          >
            <Select options={STATUS_OPTIONS} placeholder="请选择" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

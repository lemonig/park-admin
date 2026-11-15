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
  List,
} from 'antd';
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Community } from '@/types/community';
import {
  getCommunityList,
  getCommunityDetail,
  createCommunity,
  updateCommunity,
  deleteCommunity,
  searchCommunityPoi,
} from '@/services/community';

const STATUS_OPTIONS = [
  { label: '启用', value: 1 },
  { label: '停用', value: 0 },
];

export default function CommunityPage() {
  const [list, setList] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState({ current: 1, pageSize: 10 });
  const [total, setTotal] = useState(0);

  // 筛选条件
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');
  const [status, setStatus] = useState<number | undefined>(undefined);

  // 新增/编辑弹窗
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  // POI 搜索辅助（建库时取规范名称与坐标）
  const [poiKeyword, setPoiKeyword] = useState('');
  const [poiCity, setPoiCity] = useState('');
  const [poiSearching, setPoiSearching] = useState(false);
  const [poiList, setPoiList] = useState<Community[]>([]);
  const [poiSelectedTitle, setPoiSelectedTitle] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCommunityList({
        keyword: keyword || undefined,
        city: city || undefined,
        status,
        pageNum: page.current,
        pageSize: page.pageSize,
      });
      setList(Array.isArray(res?.data) ? res.data : []);
      setTotal(res?.page?.total ?? 0);
    } catch {
      setList([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [keyword, city, status, page.current, page.pageSize]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const handleSearch = () => {
    setPage((p) => ({ ...p, current: 1 }));
  };

  const handleReset = () => {
    setKeyword('');
    setCity('');
    setStatus(undefined);
    setPage((p) => ({ ...p, current: 1 }));
  };

  const openAdd = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({ status: 1 });
    setPoiList([]);
    setPoiSelectedTitle(null);
    setPoiKeyword('');
    setPoiCity('');
    setModalOpen(true);
  };

  const openEdit = async (record: Community) => {
    const id = record.id;
    if (id == null) return;
    setEditingId(id);
    setPoiList([]);
    setPoiSelectedTitle(null);
    try {
      const res = await getCommunityDetail({ id });
      const detail = res?.data ?? record;
      form.setFieldsValue({
        name: detail.name ?? record.name,
        province: detail.province ?? record.province,
        city: detail.city ?? record.city,
        area: detail.area ?? record.area,
        address: detail.address ?? record.address,
        lat: detail.lat ?? record.lat,
        lng: detail.lng ?? record.lng,
        status: detail.status ?? record.status ?? 1,
      });
      setPoiCity(detail.city ?? record.city ?? '');
      setModalOpen(true);
    } catch {
      message.error('获取详情失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingId != null) {
        await updateCommunity({ ...values, id: editingId });
        message.success('更新成功');
      } else {
        await createCommunity(values);
        message.success('新增成功');
      }
      setModalOpen(false);
      fetchList();
    } catch (e) {
      // antd 校验失败（带 errorFields）不弹错误提示
      if (e && typeof e === 'object' && 'errorFields' in e) return;
      message.error(editingId != null ? '更新失败' : '新增失败');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCommunity({ id });
      message.success('删除成功');
      fetchList();
    } catch {
      message.error('删除失败');
    }
  };

  const handlePoiSearch = async () => {
    if (!poiKeyword.trim() || !poiCity.trim()) {
      message.warning('请输入 POI 关键词和城市');
      return;
    }
    setPoiSearching(true);
    try {
      const res = await searchCommunityPoi({ keyword: poiKeyword.trim(), city: poiCity.trim() });
      setPoiList(Array.isArray(res?.data) ? res.data : []);
      setPoiSelectedTitle(null);
    } catch {
      setPoiList([]);
      message.error('POI 搜索失败');
    } finally {
      setPoiSearching(false);
    }
  };

  const handlePoiSelect = (poi: Community) => {
    form.setFieldsValue({
      name: poi.name,
      province: poi.province,
      city: poi.city,
      area: poi.area,
      address: poi.address,
      lat: poi.lat,
      lng: poi.lng,
    });
    setPoiSelectedTitle(poi.name ?? null);
    message.success('已填入该 POI 信息，请确认后保存');
  };

  const columns: ColumnsType<Community> = [
    {
      title: '序号',
      width: 80,
      render: (_, __, index) => (page.current - 1) * page.pageSize + index + 1,
    },
    { title: '小区名称', dataIndex: 'name', width: 180 },
    {
      title: '省/市/区',
      key: 'region',
      width: 220,
      render: (_, record) =>
        [record.province, record.city, record.area].filter(Boolean).join(' / ') || '-',
    },
    { title: '地址', dataIndex: 'address', ellipsis: true },
    {
      title: '坐标',
      key: 'location',
      width: 160,
      render: (_, record) =>
        record.lat != null && record.lng != null
          ? `${Number(record.lat).toFixed(4)}, ${Number(record.lng).toFixed(4)}`
          : '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (s: number) => <Tag color={s === 1 ? 'green' : 'default'}>{s === 1 ? '启用' : '停用'}</Tag>,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 180,
      render: (t?: string) => (t ? new Date(t).toLocaleString() : '-'),
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => openEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除该小区？被车位引用时无法删除"
            onConfirm={() => record.id != null && handleDelete(record.id)}
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
      <h2 style={{ marginBottom: 16 }}>小区管理</h2>

      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          allowClear
          style={{ width: 200 }}
          placeholder="小区名关键词"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onPressEnter={handleSearch}
        />
        <Input
          allowClear
          style={{ width: 140 }}
          placeholder="城市（精确）"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onPressEnter={handleSearch}
        />
        <Select
          allowClear
          style={{ width: 120 }}
          placeholder="状态"
          options={STATUS_OPTIONS}
          value={status}
          onChange={(v) => setStatus(v)}
        />
        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
          查询
        </Button>
        <Button onClick={handleReset}>重置</Button>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
          新增小区
        </Button>
        <Button icon={<ReloadOutlined />} onClick={fetchList}>
          刷新
        </Button>
      </Space>

      <Table<Community>
        rowKey="id"
        columns={columns}
        dataSource={list}
        loading={loading}
        pagination={false}
        scroll={{ x: 1100 }}
      />
      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <Pagination
          current={page.current}
          pageSize={page.pageSize}
          total={total}
          showSizeChanger
          showQuickJumper
          showTotal={(t) => `共 ${t} 条`}
          onChange={(current, pageSize) => setPage({ current, pageSize: pageSize || 10 })}
        />
      </div>

      <Modal
        title={editingId != null ? '编辑小区' : '新增小区'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        destroyOnClose
        width={640}
      >
        {/* POI 搜索辅助：搜腾讯地图真实 POI，一键填入规范名称/省市区/坐标 */}
        <div style={{ marginBottom: 16, padding: 12, border: '1px solid #f0f0f0', borderRadius: 8, background: '#fafafa' }}>
          <div style={{ marginBottom: 8, fontWeight: 500 }}>地图 POI 搜索（推荐：自动填入规范名称与坐标）</div>
          <Space style={{ marginBottom: poiList.length ? 8 : 0 }} wrap>
            <Input
              style={{ width: 180 }}
              placeholder="POI 关键词，如 万科城"
              value={poiKeyword}
              onChange={(e) => setPoiKeyword(e.target.value)}
              onPressEnter={handlePoiSearch}
            />
            <Input
              style={{ width: 140 }}
              placeholder="城市，如 广州"
              value={poiCity}
              onChange={(e) => setPoiCity(e.target.value)}
              onPressEnter={handlePoiSearch}
            />
            <Button loading={poiSearching} onClick={handlePoiSearch}>
              搜索
            </Button>
          </Space>
          {poiList.length > 0 && (
            <List
              size="small"
              dataSource={poiList}
              renderItem={(item) => (
                <List.Item
                  style={{ cursor: 'pointer', padding: '6px 4px' }}
                  onClick={() => handlePoiSelect(item)}
                >
                  <div>
                    <div>{item.name}</div>
                    <div style={{ fontSize: 12, color: '#999' }}>
                      {[item.province, item.city, item.area].filter(Boolean).join(' ')} · {item.address}
                    </div>
                  </div>
                </List.Item>
              )}
            />
          )}
          {poiSelectedTitle && (
            <div style={{ marginTop: 8, color: '#52c41a', fontSize: 12 }}>
              已选择：{poiSelectedTitle}
            </div>
          )}
        </div>

        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="小区名称"
            rules={[{ required: true, message: '请输入小区名称' }]}
          >
            <Input placeholder="规范小区名" maxLength={100} />
          </Form.Item>
          <Space size="middle">
            <Form.Item name="province" label="省" style={{ width: 180 }}>
              <Input placeholder="如 广东省" maxLength={50} />
            </Form.Item>
            <Form.Item
              name="city"
              label="市"
              rules={[{ required: true, message: '请输入城市' }]}
              style={{ width: 180 }}
            >
              <Input placeholder="如 广州" maxLength={50} />
            </Form.Item>
            <Form.Item name="area" label="区/县" style={{ width: 180 }}>
              <Input placeholder="如 天河区" maxLength={50} />
            </Form.Item>
          </Space>
          <Form.Item name="address" label="详细地址">
            <Input placeholder="可选" maxLength={255} />
          </Form.Item>
          <Space size="middle">
            <Form.Item name="lat" label="纬度" style={{ width: 180 }}>
              <Input type="number" placeholder="gcj02，POI 搜索自动填入" step="0.000001" />
            </Form.Item>
            <Form.Item name="lng" label="经度" style={{ width: 180 }}>
              <Input type="number" placeholder="gcj02，POI 搜索自动填入" step="0.000001" />
            </Form.Item>
            <Form.Item name="status" label="状态" rules={[{ required: true }]} initialValue={1}>
              <Select options={STATUS_OPTIONS} style={{ width: 120 }} />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </div>
  );
}

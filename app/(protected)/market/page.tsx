// app/protected/market/page.tsx
// （完全匹配您的文件结构：app/protected/market/page.tsx，作为 /protected/market 路由）

"use client";

import React from "react";
import { ProTable, ProColumns, ActionType } from "@ant-design/pro-components";
import { Button, message, Popconfirm, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { MarketItem } from "@/types/market";
import MarketForm from "./components/MarketForm"; // 假设组件在根目录 components/ 下，根据实际调整
import {
  getMarketList,
  addMarket,
  updateMarket,
  deleteMarket,
} from "@/services/market";

const columns: ProColumns<MarketItem>[] = [
  {
    title: "序号",
    dataIndex: "index",
    valueType: "indexBorder",
    width: 60,
    fixed: "left",
  },
  {
    title: "业务编码",
    dataIndex: "code",
    key: "code",
    width: 160,
    copyable: true,
    ellipsis: true,
    hideInSearch: true,
  },
  {
    title: "车位编号",
    dataIndex: "parking_no",
    key: "parking_no",
    width: 120,
  },
  {
    title: "租售类型",
    dataIndex: "type",
    key: "type",
    width: 100,
    valueEnum: {
      1: { text: "出售", status: "Success" },
      2: { text: "租赁", status: "Processing" },
    },
    render: (_, record) => (
      <Tag color={record.type === 1 ? "green" : "blue"}>
        {record.type === 1 ? "出售" : "租赁"}
      </Tag>
    ),
  },
  {
    title: "价格（元）",
    dataIndex: "price",
    key: "price",
    width: 140,
    sorter: true,
    hideInSearch: true,
    render: (text) => `¥${Number(text).toFixed(2)}`,
  },
  {
    title: "联系电话",
    dataIndex: "phone",
    key: "phone",
    width: 130,
    hideInSearch: true,
  },
  {
    title: "位置描述",
    dataIndex: "position_desc",
    key: "position_desc",
    width: 200,
    ellipsis: true,
  },
  {
    title: "规格描述",
    dataIndex: "specs",
    key: "specs",
    width: 200,
    ellipsis: true,
  },
  {
    title: "审核状态",
    dataIndex: "status",
    key: "status",
    width: 120,
    filters: true,
    valueEnum: {
      0: { text: "待审核", status: "Warning" },
      1: { text: "已通过", status: "Success" },
      2: { text: "已拒绝", status: "Error" },
    },
    render: (_, record) => (
      <Tag
        color={
          record.status === 1 ? "green" : record.status === 2 ? "red" : "orange"
        }
      >
        {record.status === 0
          ? "待审核"
          : record.status === 1
          ? "已通过"
          : "已拒绝"}
      </Tag>
    ),
  },
  {
    title: "创建时间",
    dataIndex: "created_at",
    key: "created_at",
    width: 180,
    sorter: true,
    valueType: "dateTime",
    hideInSearch: true,
  },
  {
    title: "审核时间",
    dataIndex: "audit_time",
    key: "audit_time",
    width: 180,
    sorter: true,
    valueType: "dateTime",
    hideInSearch: true,
  },
  {
    title: "操作",
    key: "action",
    width: 200,
    fixed: "right",
    hideInSearch: true,
    render: (_, record, __, action) => (
      <>
        <Button
          type="link"
          size="small"
          onClick={() => action?.startEditable?.(record.id)}
        >
          编辑
        </Button>
        <Popconfirm
          title="确定删除该车位信息吗？"
          onConfirm={async () => {
            try {
              await deleteMarket(record.id);
              message.success("删除成功");
              action?.reload();
            } catch {
              message.error("删除失败");
            }
          }}
        >
          <Button type="link" danger size="small">
            删除
          </Button>
        </Popconfirm>
      </>
    ),
  },
];

const MarketPage: React.FC = () => {
  const actionRef = React.useRef<ActionType>();

  return (
    <ProTable<MarketItem>
      headerTitle="车位租售管理"
      actionRef={actionRef}
      rowKey="id"
      scroll={{ x: 1600 }}
      columns={columns}
      request={async (params, sorter, filter) => {
        try {
          const res = await getMarketList({
            pageNum: params.current,
            pageSize: params.pageSize,
            ...params,
            ...filter,
            sorter,
          });

          return {
            data: res.list || res.data || [],
            total: res.total || 0,
            success: true,
          };
        } catch (error) {
          message.error("加载数据失败");
          return {
            data: [],
            total: 0,
            success: false,
          };
        }
      }}
      editable={{
        type: "multiple",
        onSave: async (key, row) => {
          try {
            await updateMarket(row.id, row);
            message.success("更新成功");
          } catch {
            message.error("更新失败");
          }
        },
        onDelete: async (key, row) => {
          try {
            await deleteMarket(row.id);
            message.success("删除成功");
          } catch {
            message.error("删除失败");
          }
        },
      }}
      toolBarRender={() => [
        <MarketForm
          key="add"
          title="新增车位信息"
          trigger={
            <Button type="primary" icon={<PlusOutlined />}>
              新增
            </Button>
          }
          onFinish={async (values) => {
            try {
              await addMarket(values);
              message.success("新增成功");
              actionRef.current?.reload();
              return true;
            } catch {
              message.error("新增失败");
              return false;
            }
          }}
        />,
      ]}
      search={{
        labelWidth: "auto",
        span: 6,
      }}
      options={{
        reload: true,
        density: true,
        setting: true,
        fullScreen: true,
      }}
    />
  );
};

export default MarketPage;

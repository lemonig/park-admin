"use client";

import React from "react";
import { ProTable, ProColumns, ActionType } from "@ant-design/pro-components";
import { Button, message, Popconfirm, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { MarketItem } from "@/types/market"; // 假设您有类型定义，后续我会帮您补
import ModalForm from "./components/MarketForm"; // 我们会单独抽一个表单组件，便于复用

// 假设后端 API 路径（根据您的 Spring Boot 配置调整）
const API_PREFIX = "/api/market";

// Market 表格列定义
const columns: ProColumns<MarketItem>[] = [
  {
    title: "业务编码",
    dataIndex: "code",
    key: "code",
    width: 160,
    fixed: "left",
    copyable: true,
    ellipsis: true,
  },
  {
    title: "车位编号",
    dataIndex: "parking_no",
    key: "parking_no",
    width: 120,
  },
  {
    title: "类型",
    dataIndex: "type",
    key: "type",
    width: 100,
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
    width: 120,
    sorter: true,
    render: (_) => `¥${_}`,
  },
  {
    title: "联系电话",
    dataIndex: "phone",
    key: "phone",
    width: 130,
    hideInSearch: true, // 电话敏感，不参与搜索
  },
  {
    title: "位置描述",
    dataIndex: "position_desc",
    key: "position_desc",
    width: 180,
    ellipsis: true,
  },
  {
    title: "规格描述",
    dataIndex: "specs",
    key: "specs",
    width: 180,
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
    title: "审核时间",
    dataIndex: "audit_time",
    key: "audit_time",
    width: 180,
    sorter: true,
    valueType: "dateTime",
  },
  {
    title: "创建时间",
    dataIndex: "created_at",
    key: "created_at",
    width: 180,
    sorter: true,
    valueType: "dateTime",
  },
  {
    title: "操作",
    key: "action",
    width: 180,
    fixed: "right",
    render: (_, record, __, action) => (
      <>
        <Button
          type="link"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </Button>
        <Popconfirm
          title="确定删除该车位信息吗？"
          onConfirm={async () => {
            const res = await fetch(`${API_PREFIX}/${record.id}`, {
              method: "DELETE",
            });
            if (res.ok) {
              message.success("删除成功");
              action?.reload();
            } else {
              message.error("删除失败");
            }
          }}
        >
          <Button type="link" danger>
            删除
          </Button>
        </Popconfirm>
      </>
    ),
  },
];

export default function MarketPage() {
  const actionRef = React.useRef<ActionType>();

  return (
    <ProTable<MarketItem>
      headerTitle="车位租售管理"
      actionRef={actionRef}
      rowKey="id"
      scroll={{ x: 1600 }}
      columns={columns}
      request={async (params, sorter, filter) => {
        // 调用后端分页列表接口（假设后端已实现分页、排序、过滤）
        const res = await fetch(
          `${API_PREFIX}?page=${params.current}&size=${params.pageSize}`
        );
        const data = await res.json();
        return {
          data: data.list || [],
          success: true,
          total: data.total,
        };
      }}
      editable={{
        type: "multiple",
        onSave: async (key, row) => {
          // 可编辑行保存（直接调用更新接口）
          const res = await fetch(`${API_PREFIX}/${row.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(row),
          });
          if (res.ok) {
            message.success("更新成功");
          } else {
            message.error("更新失败");
          }
        },
        onDelete: async (key, row) => {
          const res = await fetch(`${API_PREFIX}/${row.id}`, {
            method: "DELETE",
          });
          if (res.ok) {
            message.success("删除成功");
          }
        },
      }}
      toolBarRender={() => [
        <ModalForm
          key="add"
          title="新增车位信息"
          trigger={
            <Button type="primary" icon={<PlusOutlined />}>
              新增
            </Button>
          }
          onFinish={async (values) => {
            const res = await fetch(API_PREFIX, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(values),
            });
            if (res.ok) {
              message.success("新增成功");
              actionRef.current?.reload();
              return true;
            }
            message.error("新增失败");
            return false;
          }}
        />,
      ]}
    />
  );
}

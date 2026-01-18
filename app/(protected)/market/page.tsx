/*
 * @Author: Jonny
 * @Date: 2025-12-18 19:41:34
 * @LastEditors: Jonny
 * @LastEditTime: 2025-12-30 16:04:34
 * @FilePath: \park-web\app\(protected)\market\page.tsx
 */
// app/protected/market/page.tsx
// （完全匹配您的文件结构：app/protected/market/page.tsx，作为 /protected/market 路由）
"use client";

import React, { useState, useEffect } from "react";
import { Table, Button, message, Popconfirm, Tag, Pagination } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { MarketItem } from "@/types/market";
import MarketForm from "./components/MarketForm";
import {
  getMarketList,
  addMarket,
  updateMarket,
  deleteMarket,
} from "@/services/market";

// 注意：这里假设你的后端接口参数是 pageNum / pageSize（常见写法）
// 如果是 current / pageSize，记得对应调整

const MarketPage: React.FC = () => {
  const [dataSource, setDataSource] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  // 分页 & 排序参数
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10, // 你可以改成 15/20 都行
  });

  const [sorter, setSorter] = useState<any>(null); // 用于记录当前排序字段

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        // 如果有搜索条件，以后可以在这里加 ...searchParams
        // 排序（只支持单字段排序，antd 默认行为）
        ...(sorter?.field && sorter.order
          ? { sortField: sorter.field, sortOrder: sorter.order === "ascend" ? "asc" : "desc" }
          : {}),
      };

      const res:any = await getMarketList(params);

      // 假设接口返回格式是 { list: [], total: number }
      // 如果是 { data: { list, pagination: { total } } } 记得调整
      setDataSource(res.list || res.data?.list || []);
      setTotal(res.total || res.data?.total || 0);
    } catch (error) {
      message.error("加载数据失败");
      setDataSource([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载 + 分页/排序变化时触发
  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize, sorter]);

  // 表格列定义
  const columns: ColumnsType<MarketItem> = [
    {
      title: "序号",
      key: "index",
      width: 60,
      fixed: "left",
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "业务编码",
      dataIndex: "code",
      key: "code",
      width: 160,
      // copyable: true, // antd 原生 Table 不支持 copyable，需要自己实现或用插件
      ellipsis: true,
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
      sorter: true,          // 开启前端排序标记，但实际走服务端
      render: (text) => `¥${Number(text).toFixed(2)}`,
    },
    {
      title: "联系电话",
      dataIndex: "phone",
      key: "phone",
      width: 130,
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
    },
    {
      title: "审核时间",
      dataIndex: "audit_time",
      key: "audit_time",
      width: 180,
      sorter: true,
    },
    {
      title: "操作",
      key: "action",
      width: 200,
      fixed: "right",
      render: (_, record) => (
        <>
          <Button
            type="link"
            size="small"
            onClick={() => {
              // 这里原来是 action.startEditable
              // 现在如果你想保留行内编辑，可以自己做 Modal 编辑，或者跳页面
              message.info(`准备编辑车位：${record.parking_no} (id: ${record.id})`);
              // 推荐做法：打开同一个 MarketForm 的编辑模式
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除该车位信息吗？"
            onConfirm={async () => {
              try {
                await deleteMarket(record.id);
                message.success("删除成功");
                fetchData(); // 刷新当前页
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

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <MarketForm
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
              fetchData(); // 刷新列表（一般回到第一页比较好）
              return true;
            } catch {
              message.error("新增失败");
              return false;
            }
          }}
        />
      </div>

      <Table<MarketItem>
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        loading={loading}
        scroll={{ x: 1600 }}
        pagination={false} // 关掉内置分页，自己用下面 Pagination 组件
        onChange={(pag, filters, sort) => {
          // 注意：sort 可能是单个对象，也可能是数组（多列排序），这里只处理单列
          const currentSorter = Array.isArray(sort) ? sort[0] : sort;
          setSorter(currentSorter);
          setPagination({
            current: pag.current ?? 1,
            pageSize: pag.pageSize ?? 10,
          });
        }}
      />

      <div style={{ marginTop: 16, textAlign: "right" }}>
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={total}
          showSizeChanger
          showQuickJumper
          showTotal={(total) => `共 ${total} 条`}
          onChange={(page, pageSize) => {
            setPagination({ current: page, pageSize });
          }}
          onShowSizeChange={(current, size) => {
            setPagination({ current: 1, pageSize: size }); // 改 pageSize 时回到第一页
          }}
        />
      </div>
    </div>
  );
};

export default MarketPage;
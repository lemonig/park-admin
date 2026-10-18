/*
 * @Author: Jonny
 * @Date: 2025-12-18 19:41:34
 * @LastEditors: Jonny
 * @LastEditTime: 2026-01-23 16:47:45
 * @FilePath: \park-admin\app\(protected)\market\page.tsx
 */
"use client";

import React, { useState, useEffect } from "react";
import { Button, Descriptions, Form, Image, Input, message, Modal, Pagination, Popconfirm, Select, Space, Table, Tag } from "antd";
import { ArrowLeftOutlined, PlusOutlined, SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { Market, Request } from "@/types/market";
import type { ApiResponse } from "@/types/public";
import MarketForm from "./components/MarketForm";
import {
  getMarketList,
  addMarket,
  updateMarket,
  deleteMarket,
  getMarketDetail,
  auditMarket,
} from "@/services/market";

const { Option } = Select;

const MarketPage: React.FC = () => {
  const [dataSource, setDataSource] = useState<Market[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [view, setView] = useState<"list" | "detail">("list");
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailRecord, setDetailRecord] = useState<Market | null>(null);

  // 分页参数
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  // 排序参数
  const [sorter, setSorter] = useState<any>(null);

  // 搜索表单
  const [searchForm] = Form.useForm();

  // 编辑相关状态
  const [editingRecord, setEditingRecord] = useState<Market | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editInitialValues, setEditInitialValues] = useState<any>(null);

  const fetchData = async (searchParams?: Partial<Request>) => {
    setLoading(true);
    try {
      const params: Request = {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        ...searchParams,
      };

      // 添加排序参数（如果有的话）
      if (sorter?.field && sorter?.order) {
        // 这里假设后端接受 sortField 和 sortOrder 参数
        // 你可以根据实际后端API调整
        Object.assign(params, {
          sortField: sorter.field,
          sortOrder: sorter.order === "ascend" ? "asc" : "desc",
        });
      }

      const response: ApiResponse<Market[]> = await getMarketList(params);

      if (response.code === 200) {
        setDataSource(response.data || []);
        setTotal(response.page?.total || 0);
      } else {
        message.error(response.message || "加载数据失败");
        setDataSource([]);
        setTotal(0);
      }
    } catch (error) {
      message.error("加载数据失败");
      setDataSource([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleDetailClick = async (record: Market) => {
    if (!record.id) return;
    setDetailLoading(true);
    setView("detail");
    try {
      const res: any = await getMarketDetail(record.id);
      setDetailRecord(res?.data || res || record);
    } catch {
      message.error("获取车位详情失败");
      setDetailRecord(record);
    } finally {
      setDetailLoading(false);
    }
  };

  const backToList = () => {
    setView("list");
    setDetailRecord(null);
  };

  const handleEditClick = async (record: Market) => {
    if (!record.id) return;
    try {
      const res: any = await getMarketDetail(record.id);
      const detail = res?.data || res;

      if (!detail) {
        message.error("获取车位详情失败");
        return;
      }

      const formValues = {
        ...detail,
        parking_no: detail.parkingNo ?? detail.parking_no,
        position_desc: detail.positionDesc ?? detail.position_desc,
      };

      setEditingRecord(record);
      setEditInitialValues(formValues);
      setEditModalVisible(true);
    } catch {
      message.error("获取车位详情失败");
    }
  };

  // 搜索函数
  const handleSearch = async (values: any) => {
    setPagination(prev => ({ ...prev, current: 1 })); // 重置到第一页
    await fetchData(values);
  };

  // 重置搜索
  const handleReset = async () => {
    searchForm.resetFields();
    setPagination(prev => ({ ...prev, current: 1 }));
    await fetchData();
  };

  // 审核通过
  const handleAuditApprove = async (record: Market) => {
    if (!record.id) return;
    Modal.confirm({
      title: "确认审核通过？",
      content: `车位 ${record.parkingNo || "-"} 审核通过后将公开展示`,
      okText: "通过",
      cancelText: "取消",
      async onOk() {
        try {
          await auditMarket(record.id!, { status: 1 });
          message.success("已通过");
          fetchData();
        } catch {
          message.error("操作失败");
        }
      },
    });
  };

  // 审核驳回（需填写原因）
  const handleAuditReject = (record: Market) => {
    if (!record.id) return;
    let remark = "";
    Modal.confirm({
      title: "驳回车位",
      content: (
        <Input.TextArea
          rows={3}
          placeholder="请填写驳回原因（必填）"
          maxLength={255}
          onChange={(e) => { remark = e.target.value; }}
        />
      ),
      okText: "驳回",
      cancelText: "取消",
      okButtonProps: { danger: true },
      onOk() {
        if (!remark.trim()) {
          message.warning("请填写驳回原因");
          return Promise.reject();
        }
        return auditMarket(record.id!, { status: 2, remark: remark.trim() }).then(() => {
          message.success("已驳回");
          fetchData();
        });
      },
    });
  };

  // 处理表格变化（分页、排序）
  const handleTableChange = (pag: any, filters: any, sort: any) => {
    const currentSorter = Array.isArray(sort) ? sort[0] : sort;
    setSorter(currentSorter);
    setPagination({
      current: pag.current ?? 1,
      pageSize: pag.pageSize ?? 10,
    });
  };

  // 初始加载
  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize, sorter]);

  // 表格列定义
  const columns: ColumnsType<Market> = [
    {
      title: "序号",
      key: "index",
      width: 60,
      fixed: "left",
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
    },

    {
      title: "车位号",
      dataIndex: "parkingNo",
      key: "parkingNo",
      width: 120,
      render: (parkingNo: string, record) => (
        <Button type="link" size="small" onClick={() => handleDetailClick(record)}>
          {parkingNo || "-"}
        </Button>
      ),
    },
    {
      title: "租售类型",
      dataIndex: "type",
      key: "type",
      width: 100,
      render: (type: number) => (
        <Tag color={type === 1 ? "green" : "blue"}>
          {type === 1 ? "出售" : "租赁"}
        </Tag>
      ),
    },
    {
      title: "价格（元）",
      dataIndex: "price",
      key: "price",
      width: 140,
      render: (price: number) => `¥${Number(price || 0).toFixed(2)}`,
    },
    {
      title: "联系电话",
      dataIndex: "phone",
      key: "phone",
      width: 130,
    },
    // {
    //   title: "位置描述",
    //   dataIndex: "positionDesc",
    //   key: "positionDesc",
    //   width: 200,
    //   ellipsis: true,
    // },
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
      render: (status: number) => (
        <Tag
          color={
            status === 1 ? "green" : status === 2 ? "red" : "orange"
          }
        >
          {status === 0 ? "待审核" : status === 1 ? "已通过" : "已拒绝"}
        </Tag>
      ),
    },
    {
      title: "创建时间",
      dataIndex: "gmtCreate",
      key: "gmtCreate",
      width: 180,
      render: (date: Date) => date ? new Date(date).toLocaleString() : "-",
    },
    {
      title: "审核时间",
      dataIndex: "auditTime",
      key: "auditTime",
      width: 180,
      render: (date: Date) => date ? new Date(date).toLocaleString() : "-",
    },
    {
      title: "驳回原因",
      dataIndex: "auditRemark",
      key: "auditRemark",
      width: 180,
      ellipsis: true,
      render: (remark?: string) => remark || "-",
    },
    {
      title: "操作",
      key: "action",
      width: 200,
      fixed: "right",
      render: (_, record) => (
        <Space>
          {record.status === 0 && (
            <>
              <Button
                type="link"
                size="small"
                style={{ color: "#52c41a" }}
                onClick={() => handleAuditApprove(record)}
              >
                通过
              </Button>
              <Button
                type="link"
                size="small"
                danger
                onClick={() => handleAuditReject(record)}
              >
                驳回
              </Button>
            </>
          )}
          <Button
            type="link"
            size="small"
            onClick={() => {
              handleEditClick(record);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除该车位信息吗？"
            onConfirm={async () => {
              if (!record.id) return;
              try {
                await deleteMarket(record.id);
                message.success("删除成功");
                fetchData();
              } catch {
                message.error("删除失败");
              }
            }}
          >
            <Button type="link" danger size="small">
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const renderStatus = (status?: number) => {
    if (status === 0) return "待审核";
    if (status === 1) return "已通过";
    if (status === 2) return "已拒绝";
    return "-";
  };

  const renderType = (type?: number) => {
    if (type === 1) return "出售";
    if (type === 2) return "租赁";
    return "-";
  };

  const renderDate = (date?: Date) => date ? new Date(date).toLocaleString() : "-";

  if (view === "detail") {
    return (
      <div>
        <Space style={{ marginBottom: 16 }}>
          <Button icon={<ArrowLeftOutlined />} onClick={backToList}>
            返回车位列表
          </Button>
          {detailRecord && (
            <Button type="primary" onClick={() => handleEditClick(detailRecord)}>
              编辑
            </Button>
          )}
        </Space>
        <div style={{ background: "#fff", borderRadius: 8, padding: 24, border: "1px solid #f0f0f0" }}>
          <h2 style={{ marginTop: 0, marginBottom: 16 }}>车位详情</h2>
          {detailLoading ? (
            <div>加载中...</div>
          ) : (
            <>
              <Descriptions bordered column={2} size="middle">
                <Descriptions.Item label="车位号">{detailRecord?.parkingNo || "-"}</Descriptions.Item>
                <Descriptions.Item label="租售类型">{renderType(detailRecord?.type)}</Descriptions.Item>
                <Descriptions.Item label="价格">
                  {detailRecord?.price != null ? `¥${Number(detailRecord.price).toFixed(2)}` : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="联系电话">{detailRecord?.phone || "-"}</Descriptions.Item>
                <Descriptions.Item label="城市">{detailRecord?.city || "-"}</Descriptions.Item>
                <Descriptions.Item label="区域">{detailRecord?.area || "-"}</Descriptions.Item>
                <Descriptions.Item label="小区">{detailRecord?.community || "-"}</Descriptions.Item>
                <Descriptions.Item label="审核状态">{renderStatus(detailRecord?.status)}</Descriptions.Item>
                <Descriptions.Item label="靠近楼栋" span={2}>
                  {detailRecord?.buildings ? String(detailRecord.buildings).split(",").filter(Boolean).join("、") : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="位置描述" span={2}>{detailRecord?.positionDesc || "-"}</Descriptions.Item>
                <Descriptions.Item label="规格描述" span={2}>{detailRecord?.specs || "-"}</Descriptions.Item>
                <Descriptions.Item label="描述" span={2}>{detailRecord?.description || "-"}</Descriptions.Item>
                <Descriptions.Item label="创建时间">{renderDate(detailRecord?.gmtCreate)}</Descriptions.Item>
                <Descriptions.Item label="审核时间">{renderDate(detailRecord?.auditTime)}</Descriptions.Item>
                <Descriptions.Item label="驳回原因" span={2}>{detailRecord?.auditRemark || "-"}</Descriptions.Item>
              </Descriptions>
              <div style={{ marginTop: 24 }}>
                <h3 style={{ marginBottom: 12 }}>车位照片</h3>
                {detailRecord?.images?.length ? (
                  <Image.PreviewGroup>
                    <Space wrap>
                      {detailRecord.images.map((image) => (
                        <Image
                          key={image.id || image.url}
                          width={160}
                          height={120}
                          src={image.url}
                          alt="车位照片"
                          style={{ objectFit: "cover", borderRadius: 8 }}
                        />
                      ))}
                    </Space>
                  </Image.PreviewGroup>
                ) : (
                  <div style={{ color: "#999" }}>暂无照片</div>
                )}
              </div>
            </>
          )}
        </div>
        {editingRecord && (
          <MarketForm
            title="编辑车位信息"
            open={editModalVisible}
            initialValues={editInitialValues || editingRecord}
            onOpenChange={(open) => {
              setEditModalVisible(open);
              if (!open) {
                setEditingRecord(null);
                setEditInitialValues(null);
              }
            }}
            onFinish={async (values) => {
              if (!editingRecord.id) return false;
              try {
                await updateMarket({ ...values, id: editingRecord.id });
                message.success("编辑成功");
                setEditModalVisible(false);
                setEditingRecord(null);
                handleDetailClick(editingRecord);
                return true;
              } catch {
                message.error("编辑失败");
                return false;
              }
            }}
            trigger={<></>}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      {/* 搜索表单 */}
      <Form
        form={searchForm}
        layout="inline"
        style={{ marginBottom: 16 }}
        onFinish={handleSearch}
      >
        <Form.Item name="parkingNo" label="车位编号">
          <Input placeholder="输入车位编号" allowClear />
        </Form.Item>
        <Form.Item name="type" label="租售类型">
          <Select placeholder="请选择" allowClear style={{ width: 120 }}>
            <Option value={1}>出售</Option>
            <Option value={2}>租赁</Option>
          </Select>
        </Form.Item>
        <Form.Item name="status" label="审核状态">
          <Select placeholder="请选择" allowClear style={{ width: 120 }}>
            <Option value={0}>待审核</Option>
            <Option value={1}>已通过</Option>
            <Option value={2}>已拒绝</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              搜索
            </Button>
            <Button onClick={handleReset} icon={<ReloadOutlined />}>
              重置
            </Button>
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
                  fetchData(); // 刷新列表
                  return true;
                } catch {
                  message.error("新增失败");
                  return false;
                }
              }}
            />
          </Space>
        </Form.Item>
      </Form>

      {/* 表格 */}
      <Table<Market>
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        loading={loading}
        scroll={{ x: 1600 }}
        pagination={false}
        onChange={handleTableChange}
      />

      {/* 分页 */}
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
            setPagination({ current: 1, pageSize: size });
          }}
        />
      </div>

      {/* 编辑表单 */}
      {editingRecord && (
        <MarketForm
          title="编辑车位信息"
          open={editModalVisible}
          initialValues={editInitialValues || editingRecord}
          onOpenChange={(open) => {
            setEditModalVisible(open);
            if (!open) {
              setEditingRecord(null);
              setEditInitialValues(null);
            }
          }}
          onFinish={async (values) => {
            if (!editingRecord.id) return false;
            try {
              await updateMarket({
                ...values,
                id: editingRecord.id,

              });
              message.success("编辑成功");
              setEditModalVisible(false);
              setEditingRecord(null);
              fetchData(); // 刷新列表
              return true;
            } catch {
              message.error("编辑失败");
              return false;
            }
          }}
          trigger={<></>} // 不使用trigger，因为我们手动控制显示
        />
      )}
    </div>
  );
};

export default MarketPage;
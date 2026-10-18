"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Descriptions,
  DatePicker,
  Form,
  Image,
  Input,
  message,
  Modal,
  Pagination,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { Dayjs } from "dayjs";
import type { Feedback, FeedbackRequest } from "@/types/feedback";
import { getFeedbackList, getFeedbackDetail, handleFeedback } from "@/services/feedback";

const { RangePicker } = DatePicker;

// 与后端预置字典 feedback_type 保持一致
const TYPE_OPTIONS = [
  { value: "bug", label: "功能异常" },
  { value: "advice", label: "产品建议" },
  { value: "other", label: "其他" },
];

interface SearchValues {
  status?: number;
  type?: string;
  keyword?: string;
  timeRange?: [Dayjs | null, Dayjs | null] | null;
}

const FeedbackPage: React.FC = () => {
  const [dataSource, setDataSource] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [view, setView] = useState<"list" | "detail">("list");
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailRecord, setDetailRecord] = useState<Feedback | null>(null);

  // 分页参数
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  // 搜索条件（变更后由下方 effect 统一触发请求，避免双请求与旧页码问题）
  const [searchParams, setSearchParams] = useState<FeedbackRequest>({});

  // 搜索表单
  const [searchForm] = Form.useForm();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getFeedbackList({
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        ...searchParams,
      });

      if (response.code === 200) {
        setDataSource(response.data || []);
        setTotal(response.page?.total || 0);
      } else {
        message.error(response.message || "加载数据失败");
        setDataSource([]);
        setTotal(0);
      }
    } catch {
      message.error("加载数据失败");
      setDataSource([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [pagination, searchParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDetailClick = async (record: Feedback) => {
    if (!record.id) return;
    setDetailLoading(true);
    setView("detail");
    try {
      const res = await getFeedbackDetail(record.id);
      setDetailRecord(res?.data || record);
    } catch {
      message.error("获取反馈详情失败");
      setDetailRecord(record);
    } finally {
      setDetailLoading(false);
    }
  };

  const backToList = () => {
    setView("list");
    setDetailRecord(null);
  };

  // 搜索：重置到第一页
  const handleSearch = (values: SearchValues) => {
    setSearchParams({
      status: values.status,
      type: values.type,
      keyword: values.keyword,
      startTime: values.timeRange?.[0] ? values.timeRange[0].format("YYYY-MM-DD HH:mm:ss") : undefined,
      endTime: values.timeRange?.[1] ? values.timeRange[1].format("YYYY-MM-DD HH:mm:ss") : undefined,
    });
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleReset = () => {
    searchForm.resetFields();
    setSearchParams({});
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  // 标记已处理（需填写处理备注）
  const handleProcess = (record: Feedback) => {
    if (!record.id) return;
    let remark = "";
    Modal.confirm({
      title: "处理反馈",
      content: (
        <div>
          <p style={{ color: "#999" }}>处理备注将作为反馈的处理记录，必填</p>
          <Input.TextArea
            rows={3}
            placeholder="请填写处理结果或说明（必填）"
            maxLength={200}
            onChange={(e) => {
              remark = e.target.value;
            }}
          />
        </div>
      ),
      okText: "确认处理",
      cancelText: "取消",
      onOk() {
        if (!remark.trim()) {
          message.warning("请填写处理备注");
          return Promise.reject();
        }
        return handleFeedback(record.id!, { handleRemark: remark.trim() }).then(() => {
          message.success("已标记为已处理");
          fetchData();
        });
      },
    });
  };

  const renderType = (type?: string) => {
    const option = TYPE_OPTIONS.find((item) => item.value === type);
    return option ? option.label : type || "-";
  };

  const renderTypeTag = (type?: string) => {
    const color = type === "bug" ? "red" : type === "advice" ? "blue" : "default";
    return <Tag color={color}>{renderType(type)}</Tag>;
  };

  const renderStatus = (status?: number) => (
    <Tag color={status === 1 ? "green" : "orange"}>
      {status === 1 ? "已处理" : "待处理"}
    </Tag>
  );

  const renderDate = (date?: string | Date | null) =>
    date ? new Date(date).toLocaleString() : "-";

  // 表格列定义
  const columns: ColumnsType<Feedback> = [
    {
      title: "序号",
      key: "index",
      width: 60,
      fixed: "left",
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "反馈类型",
      dataIndex: "type",
      key: "type",
      width: 110,
      render: renderTypeTag,
    },
    {
      title: "反馈内容",
      dataIndex: "content",
      key: "content",
      width: 260,
      render: (content: string, record) => (
        <Typography.Text
          style={{ maxWidth: 240 }}
          ellipsis={{ tooltip: content }}
          onClick={() => handleDetailClick(record)}
        >
          {content || "-"}
        </Typography.Text>
      ),
    },
    {
      title: "提交人",
      key: "submitter",
      width: 160,
      render: (_, record) =>
        record.userName ? `${record.userName}${record.userDoorplate ? `（${record.userDoorplate}）` : ""}` : "-",
    },
    {
      title: "联系方式",
      key: "contact",
      width: 130,
      render: (_, record) => record.contact || record.userMobile || "-",
    },
    {
      title: "截图数",
      key: "imageCount",
      width: 90,
      render: (_, record) => record.images?.length || 0,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: renderStatus,
    },
    {
      title: "提交时间",
      dataIndex: "gmtCreate",
      key: "gmtCreate",
      width: 170,
      render: renderDate,
    },
    {
      title: "操作",
      key: "action",
      width: 140,
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleDetailClick(record)}>
            查看
          </Button>
          {record.status === 0 && (
            <Button type="link" size="small" style={{ color: "#52c41a" }} onClick={() => handleProcess(record)}>
              处理
            </Button>
          )}
        </Space>
      ),
    },
  ];

  if (view === "detail") {
    return (
      <div>
        <Space style={{ marginBottom: 16 }}>
          <Button icon={<ArrowLeftOutlined />} onClick={backToList}>
            返回反馈列表
          </Button>
          {detailRecord?.status === 0 && (
            <Button type="primary" icon={<CheckOutlined />} onClick={() => handleProcess(detailRecord)}>
              标记已处理
            </Button>
          )}
        </Space>
        <div style={{ background: "#fff", borderRadius: 8, padding: 24, border: "1px solid #f0f0f0" }}>
          <h2 style={{ marginTop: 0, marginBottom: 16 }}>反馈详情</h2>
          {detailLoading && !detailRecord ? (
            <div>加载中...</div>
          ) : (
            <>
              <Descriptions bordered column={2} size="middle">
                <Descriptions.Item label="反馈类型">{renderTypeTag(detailRecord?.type)}</Descriptions.Item>
                <Descriptions.Item label="状态">{renderStatus(detailRecord?.status)}</Descriptions.Item>
                <Descriptions.Item label="提交人">{detailRecord?.userName || "-"}</Descriptions.Item>
                <Descriptions.Item label="门牌">{detailRecord?.userDoorplate || "-"}</Descriptions.Item>
                <Descriptions.Item label="联系方式">{detailRecord?.contact || detailRecord?.userMobile || "-"}</Descriptions.Item>
                <Descriptions.Item label="提交时间">{renderDate(detailRecord?.gmtCreate)}</Descriptions.Item>
                <Descriptions.Item label="反馈内容" span={2}>
                  {detailRecord?.content || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="处理备注" span={2}>
                  {detailRecord?.handleRemark || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="处理时间">{renderDate(detailRecord?.handleTime)}</Descriptions.Item>
                <Descriptions.Item label="更新时间">{renderDate(detailRecord?.gmtModify)}</Descriptions.Item>
              </Descriptions>
              <div style={{ marginTop: 24 }}>
                <h3 style={{ marginBottom: 12 }}>反馈截图</h3>
                {detailRecord?.images?.length ? (
                  <Image.PreviewGroup>
                    <Space wrap>
                      {detailRecord.images.map((image) => (
                        <Image
                          key={image.id || image.url}
                          width={160}
                          height={120}
                          src={image.url}
                          alt="反馈截图"
                          style={{ objectFit: "cover", borderRadius: 8 }}
                        />
                      ))}
                    </Space>
                  </Image.PreviewGroup>
                ) : (
                  <div style={{ color: "#999" }}>暂无截图</div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* 搜索表单 */}
      <Form
        form={searchForm}
        layout="inline"
        style={{ marginBottom: 16, rowGap: 8 }}
        onFinish={handleSearch}
      >
        <Form.Item name="status" label="状态">
          <Select placeholder="请选择" allowClear style={{ width: 120 }}>
            <Select.Option value={0}>待处理</Select.Option>
            <Select.Option value={1}>已处理</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="type" label="反馈类型">
          <Select placeholder="请选择" allowClear style={{ width: 120 }}>
            {TYPE_OPTIONS.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="keyword" label="关键字">
          <Input placeholder="内容/联系方式/提交人" allowClear style={{ width: 200 }} />
        </Form.Item>
        <Form.Item name="timeRange" label="提交时间">
          <RangePicker showTime style={{ width: 380 }} />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              搜索
            </Button>
            <Button onClick={handleReset} icon={<ReloadOutlined />}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>

      {/* 表格 */}
      <Table<Feedback>
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        loading={loading}
        scroll={{ x: 1400 }}
        pagination={false}
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
    </div>
  );
};

export default FeedbackPage;

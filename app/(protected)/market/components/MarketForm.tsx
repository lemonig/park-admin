// components/MarketForm.tsx

"use client";

import React from "react";
import {
  ModalForm,
  ProFormText,
  ProFormDigit,
  ProFormTextArea,
  ProFormSelect,
} from "@ant-design/pro-components";
import { message } from "antd";
import type { MarketItem } from "@/types/market";

interface MarketFormProps {
  title: string;
  trigger: React.ReactNode;
  onFinish: (values: MarketItem) => Promise<boolean>;
  initialValues?: MarketItem; // 编辑时传入初始值（ProTable 会自动传）
}

const MarketForm: React.FC<MarketFormProps> = ({
  title,
  trigger,
  onFinish,
  initialValues,
}) => {
  return (
    <ModalForm<MarketItem>
      title={title}
      trigger={trigger}
      initialValues={initialValues}
      onFinish={async (values) => {
        const success = await onFinish(values as MarketItem);
        return success;
      }}
      modalProps={{
        destroyOnClose: true,
        width: 600,
      }}
      submitter={{
        submitButtonProps: {
          style: { display: "block", margin: "0 auto" },
        },
      }}
    >
      {/* 业务编码（新增时可手动填或后端自动生成，编辑时只读） */}
      <ProFormText
        name="code"
        label="业务编码"
        placeholder="如 PARK-20251223-001（可留空由系统生成）"
        rules={[{ required: false }]}
        readonly={!!initialValues?.code} // 编辑时不可改
      />

      {/* 类型 */}
      <ProFormSelect
        name="type"
        label="租售类型"
        rules={[{ required: true, message: "请选择租售类型" }]}
        options={[
          { label: "出售", value: 1 },
          { label: "租赁", value: 2 },
        ]}
        placeholder="请选择"
      />

      {/* 价格 */}
      <ProFormDigit
        name="price"
        label="价格（元）"
        rules={[{ required: true, message: "请输入价格" }]}
        min={0}
        max={99999999}
        fieldProps={{ precision: 2 }}
        placeholder="如 200000.00"
      />

      {/* 车位编号 */}
      <ProFormText
        name="parking_no"
        label="车位编号"
        rules={[{ required: true, message: "请输入车位编号" }]}
        placeholder="如 A-101"
      />

      {/* 联系电话（关键字段） */}
      <ProFormText
        name="phone"
        label="联系电话"
        rules={[
          { required: true, message: "请输入联系电话" },
          { pattern: /^1[3-9]\d{9}$/, message: "请输入有效的手机号" },
        ]}
        placeholder="用于用户点击拨打"
      />

      {/* 位置描述 */}
      <ProFormText
        name="position_desc"
        label="位置描述"
        placeholder="如 地下二层A区靠近电梯"
      />

      {/* 规格描述 */}
      <ProFormText
        name="specs"
        label="规格描述"
        placeholder="如 标准车位、可停SUV、带充电桩"
      />

      {/* 详细描述 */}
      <ProFormTextArea
        name="description"
        label="详细描述"
        placeholder="车位详细信息、产权情况等（可选）"
        fieldProps={{ rows: 4 }}
      />

      {/* 审核状态（后台管理专用，小程序发布默认待审核） */}
      <ProFormSelect
        name="status"
        label="审核状态"
        rules={[{ required: true, message: "请选择审核状态" }]}
        initialValue={0} // 新增默认待审核
        options={[
          { label: "待审核", value: 0 },
          { label: "已通过", value: 1 },
          { label: "已拒绝", value: 2 },
        ]}
      />
    </ModalForm>
  );
};

export default MarketForm;

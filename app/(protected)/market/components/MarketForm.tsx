// components/MarketForm.tsx

"use client";

import React, { useState } from "react";
import {
  ModalForm,
  ProFormText,
  ProFormDigit,
  ProFormTextArea,
  ProFormSelect,
} from "@ant-design/pro-components";
import { Form, Image, message, Space, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { RcFile, UploadFile } from "antd/es/upload/interface";
import type { Market, SimpleImage } from "@/types/market";
import { uploadMarketImage } from "@/services/market";

interface MarketFormProps {
  title: string;
  trigger: React.ReactNode;
  onFinish: (values: Market) => Promise<boolean>;
  initialValues?: Market; // 编辑时传入初始值
  open?: boolean; // 外部控制显示
  onOpenChange?: (open: boolean) => void; // 外部控制显示变化
}

const toUploadFiles = (images?: SimpleImage[]): UploadFile[] => {
  return (images ?? []).map((image) => ({
    uid: image.id || image.url || Math.random().toString(),
    name: image.id || 'image',
    status: 'done',
    url: image.url,
    response: { data: image },
  }));
};

const toImages = (files: UploadFile[]): SimpleImage[] => {
  return files.reduce<SimpleImage[]>((images, file) => {
    const data = file.response?.data as SimpleImage | undefined;
    const id = data?.id || file.uid;
    const url = data?.url || file.url;
    if (id && url) {
      images.push({ id, url });
    }
    return images;
  }, []);
};

const MarketForm: React.FC<MarketFormProps> = ({
  title,
  trigger,
  onFinish,
  initialValues,
  open,
  onOpenChange,
}) => {
  const [form] = Form.useForm<Market>();
  const [fileList, setFileList] = useState<UploadFile[]>(toUploadFiles(initialValues?.images));

  return (
    <ModalForm<Market>
      form={form}
      title={title}
      trigger={trigger}
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          setFileList(toUploadFiles(initialValues?.images));
        }
        onOpenChange?.(nextOpen);
      }}
      initialValues={initialValues}
      onFinish={async (values) => {
        const success = await onFinish({
          ...(values as Market),
          images: toImages(fileList),
        });
        return success;
      }}
      modalProps={{
        destroyOnHidden: true,
        width: 600,
      }}
      submitter={{
        submitButtonProps: {
          style: { display: "block", margin: "0 auto" },
        },
      }}
    >



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
        name="parkingNo"
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
      {/* <ProFormText
        name="position_desc"
        label="位置描述"
        placeholder="如 地下二层A区靠近电梯"
      /> */}

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

      <Form.Item label="车位照片">
        <Upload
          accept="image/*"
          listType="picture-card"
          fileList={fileList}
          beforeUpload={(file) => {
            if (!file.type.startsWith('image/')) {
              message.error('只能上传图片文件');
              return Upload.LIST_IGNORE;
            }
            return true;
          }}
          customRequest={async ({ file, onSuccess, onError }) => {
            try {
              const res = await uploadMarketImage(file as RcFile);
              onSuccess?.(res);
            } catch (error) {
              onError?.(error as Error);
            }
          }}
          onChange={({ fileList }) => setFileList(fileList)}
          onRemove={(file) => {
            setFileList((files) => files.filter((item) => item.uid !== file.uid));
          }}
        >
          {fileList.length >= 9 ? null : (
            <Space direction="vertical" size={4} align="center">
              <PlusOutlined />
              <span>上传</span>
            </Space>
          )}
        </Upload>
        {fileList.some((file) => file.url) && (
          <Image.PreviewGroup>
            <div style={{ display: 'none' }}>
              {fileList
                .filter((file) => file.url)
                .map((file) => (
                  <Image key={file.uid} src={file.url} alt="车位照片" />
                ))}
            </div>
          </Image.PreviewGroup>
        )}
      </Form.Item>

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

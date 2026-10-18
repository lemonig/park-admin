export interface FeedbackImage {
  id: string;
  url: string;
}

// 意见反馈（对应后端 /api/admin/feedback/*）
export interface Feedback {
  id?: number;
  code?: string;
  userId?: number;
  // 反馈类型（字典 feedback_type 的 value：bug/advice/other）
  type?: string;
  content?: string;
  contact?: string | null;
  // 0 待处理 1 已处理
  status?: number;
  handleRemark?: string | null;
  handleBy?: number | null;
  handleTime?: string | Date | null;
  gmtCreate?: string | Date;
  gmtModify?: string | Date;
  // 提交人信息（后端联查 user 表返回）
  userName?: string | null;
  userDoorplate?: string | null;
  userMobile?: string | null;
  images?: FeedbackImage[];
}

export interface FeedbackRequest {
  pageNum?: number;
  pageSize?: number;
  status?: number;
  type?: string;
  keyword?: string;
  startTime?: string;
  endTime?: string;
}

export interface FeedbackRps {
  code: number;
  message: string;
  success?: boolean;
  data?: Feedback[] | null;
  page?: {
    pageNum?: number;
    pageSize?: number;
    total?: number;
    pages?: number;
  };
}

export interface FeedbackDetailRps {
  code: number;
  message: string;
  success?: boolean;
  data?: Feedback | null;
}

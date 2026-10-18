// services/feedback.ts
import { _get, _put } from './request';
import type {
  FeedbackDetailRps,
  FeedbackRequest,
  FeedbackRps,
} from '@/types/feedback';

// 列表查询（分页、过滤）
export const getFeedbackList = (params: FeedbackRequest) => {
  return _get<FeedbackRps, FeedbackRequest>({
    url: '/admin/feedback/list',
    params,
  });
};

// 详情
export const getFeedbackDetail = (id: number) => {
  return _get<FeedbackDetailRps, undefined>({
    url: `/admin/feedback/detail/${id}`,
  });
};

// 标记已处理（handleRemark 必填，仅待处理状态可处理）
export const handleFeedback = (
  id: number,
  data: { handleRemark: string }
) => {
  return _put({ url: `/admin/feedback/${id}/handle`, data });
};

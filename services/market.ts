// services/market.ts
import request, { _post, _get, _delete, _put } from './request';

import type { Market, MarketRps, Request } from '@/types/market';

// 列表查询（分页、排序、过滤）
export const getMarketList = (params: Request) => {
  return _get<MarketRps, Request>({ url: '/admin/market/list', params });
};

// 新增
export const addMarket = (data: Market) => {
  return _post({ url: '/admin/market', data });
};

// 更新
export const updateMarket = (data: Market) => {
  return _put({ url: `/admin/market/${data.id}`, data });
};

// 删除
export const deleteMarket = (id: number) => {
  return _delete({ url: `/admin/market/${id}` });
};

// 详情
export const getMarketDetail = (id: number) => {
  return _get({ url: `/admin/market/detail/${id}` });
};

// 审核
export const auditMarket = (
  id: number,
  data: { status: number; remark?: string }
) => {
  return _post({ url: `/admin/market/${id}/audit`, data });
};

export const uploadMarketImage = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return request.post('/admin/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

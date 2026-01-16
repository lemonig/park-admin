/*
 * @Author: Jonny
 * @Date: 2025-12-29 18:56:51
 * @LastEditors: Jonny
 * @LastEditTime: 2026-01-08 19:28:14
 * @FilePath: \park-web\services\market.ts
 */
// services/market.ts
import request from './request';
// import { clientRequest as request, serverRequest } from '@/lib/request';
import type { MarketItem } from '@/types/market';

// 列表查询（分页、排序、过滤）
export const getMarketList = (params: any) => {
  return request.get('/market/list', params);
};

// 新增
export const addMarket = (data: MarketItem) => {
  return request.post('/market', data);
};

// 更新
export const updateMarket = (id: number, data: MarketItem) => {
  return request.post(`/market/${id}`, data);
};

// 删除
export const deleteMarket = (id: number) => {
  return request.delete(`/market/${id}`);
};

// 详情（可选，如果需要单独详情页）
export const getMarketDetail = (id: number) => {
  return request.get(`/market/${id}`);
};
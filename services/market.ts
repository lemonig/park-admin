/*
 * @Author: Jonny
 * @Date: 2025-12-29 18:56:51
 * @LastEditors: Jonny
 * @LastEditTime: 2026-01-23 16:44:11
 * @FilePath: \park-admin\services\market.ts
 */
// services/market.ts
import { _post, _get, _delete,_put } from './request';
// import { clientRequest as request, serverRequest } from '@/lib/request';
import type { Market, MarketRps, Request } from '@/types/market';

// 列表查询（分页、排序、过滤）
export const getMarketList = (params: Request) => {
  return _get<MarketRps, Request>({ url: '/market/list', params });
};

// 新增
export const addMarket = (data: Market) => {
  return _post({ url: '/market/add', data });
};

// 更新
export const updateMarket = ( data: Market) => {
  return _put({ url: `/market/update`, data });
};

// 删除
export const deleteMarket = (id: number) => {
  return _delete({ url: `/market/delete/${id}` });
};

// 详情（可选，如果需要单独详情页）
export const getMarketDetail = (id: number) => {
  return _get({ url: `/market/${id}` });
};
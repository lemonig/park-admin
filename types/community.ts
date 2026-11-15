/**
 * 小区字典（community）类型定义
 */
import { ApiResponse } from './public';

/** 小区 */
export interface Community {
  id?: number;
  name?: string;
  province?: string;
  city?: string;
  area?: string;
  address?: string;
  lat?: number;
  lng?: number;
  status?: number;
  createTime?: string;
  updateTime?: string;
  [property: string]: unknown;
}

export type CommunityRps = ApiResponse<Community[]>;

/** 小区列表请求参数 */
export interface CommunityListParams {
  keyword?: string;
  city?: string;
  area?: string;
  status?: number;
  pageNum?: number;
  pageSize?: number;
}

/** POI 搜索请求参数 */
export interface PoiSearchParams {
  keyword: string;
  city: string;
}

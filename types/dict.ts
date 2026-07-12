/**
 * ApiResponseListDictType
 */

import { ApiResponse } from "./public";
export interface Response {
    code?: number;
    data?: DictType[];
    message?: string;
    meta?: { [key: string]: { [key: string]: any } };
    page?: PageVO;
    success?: boolean;
    timestamp?: Date;
    [property: string]: any;
}

/**
 * DictType，字典类型
 */
export interface DictType {
    code?: string;
    createTime?: Date;
    description?: string;
    id?: number;
    itemCount?: number;
    name?: string;
    status?: number;
    updateTime?: Date;
    [property: string]: any;
}

/**
 * PageVO
 */
export interface PageVO {
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
    pageNum?: number;
    pages?: number;
    pageSize?: number;
    total?: number;
    [property: string]: any;
}

export type DictRps = ApiResponse<DictType[]>;
export type DictItemRps = ApiResponse<DictItem[]>;

/**
 * DictItem，字典项
 */
export interface DictItem {
  id?: number;
  typeId?: number;
  typeCode?: string;
  label?: string;
  value?: string;
  sort?: number;
  status?: number;
  createTime?: Date;
  updateTime?: Date;
  [property: string]: any;
}

/** 字典项列表请求参数 */
export interface DictItemListParams {
  typeId?: number;
  typeCode?: string;
  pageNum?: number;
  pageSize?: number;
}
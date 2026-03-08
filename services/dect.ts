/**
 * 字典类型 & 字典项（字段项）增删改查接口
 * 返回类型参考 @/types/dict
 */
import { _post } from './request';
import type {
  DictType,
  DictItem,
  DictItemListParams,
  DictRps,
  DictItemRps,
} from '@/types/dict';
import type { ApiResponse } from '@/types/public';

const API_PREFIX = '/dict';

// ========== 字典类型 ==========

/** 字典类型列表（返回 data: DictType[]，分页信息在 page） */
export function getTypeList(data?: { pageNum?: number; pageSize?: number }) {
  return _post<DictRps, Record<string, unknown>>({
    url: `${API_PREFIX}/type/list`,
    data: data ?? {},
  });
}

/** 字典类型详情 */
export function getTypeDetail(data: { id: number } | { code: string }) {
  return _post<ApiResponse<DictType>, { id?: number; code?: string }>({
    url: `${API_PREFIX}/type/detail`,
    data,
  });
}

/** 新增字典类型 */
export function createType(data: Partial<DictType>) {
  return _post<ApiResponse<DictType>, Partial<DictType>>({
    url: `${API_PREFIX}/type`,
    data,
  });
}

/** 更新字典类型 */
export function updateType(data: Partial<DictType> & { id: number }) {
  return _post<ApiResponse<unknown>, Partial<DictType> & { id: number }>({
    url: `${API_PREFIX}/type/update`,
    data,
  });
}

/** 删除字典类型 */
export function deleteType(data: { id: number }) {
  return _post<ApiResponse<unknown>, { id: number }>({
    url: `${API_PREFIX}/type/delete`,
    data,
  });
}

// ========== 字典项（字段项） ==========

/** 字典项列表（返回 data: DictItem[]，分页信息在 page） */
export function getItemList(data?: DictItemListParams) {
  return _post<DictItemRps, DictItemListParams | undefined>({
    url: `${API_PREFIX}/item/list`,
    data: data ?? {},
  });
}

/** 字典项详情 */
export function getItemDetail(data: { id: number }) {
  return _post<ApiResponse<DictItem>, { id: number }>({
    url: `${API_PREFIX}/item/detail`,
    data,
  });
}

/** 新增字典项 */
export function createItem(data: Partial<DictItem>) {
  return _post<ApiResponse<DictItem>, Partial<DictItem>>({
    url: `${API_PREFIX}/item`,
    data,
  });
}

/** 更新字典项 */
export function updateItem(data: Partial<DictItem> & { id: number }) {
  return _post<ApiResponse<unknown>, Partial<DictItem> & { id: number }>({
    url: `${API_PREFIX}/item/update`,
    data,
  });
}

/** 删除字典项 */
export function deleteItem(data: { id: number }) {
  return _post<ApiResponse<unknown>, { id: number }>({
    url: `${API_PREFIX}/item/delete`,
    data,
  });
}

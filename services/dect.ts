/**
 * 字典类型 & 字典项（字段项）增删改查接口
 * 返回类型参考 @/types/dict
 */
import { _post, _get, _put, _delete } from './request';
import type {
  DictType,
  DictItem,
  DictItemListParams,
  DictRps,
  DictItemRps,
} from '@/types/dict';
import type { ApiResponse } from '@/types/public';

const API_PREFIX = '/admin/dict';

// ========== 字典类型 ==========

/** 字典类型列表 */
export function getTypeList(params?: { pageNum?: number; pageSize?: number }) {
  return _get<DictRps, Record<string, unknown>>({
    url: `${API_PREFIX}/types`,
    params: params ?? {},
  });
}

/** 字典类型详情 */
export function getTypeDetail(data: { id: number }) {
  return _get<ApiResponse<DictType>, undefined>({
    url: `${API_PREFIX}/types/${data.id}`,
  });
}

/** 新增字典类型 */
export function createType(data: Partial<DictType>) {
  return _post<ApiResponse<DictType>, Partial<DictType>>({
    url: `${API_PREFIX}/types`,
    data,
  });
}

/** 更新字典类型 */
export function updateType(data: Partial<DictType> & { id: number }) {
  return _put<ApiResponse<unknown>, Partial<DictType> & { id: number }>({
    url: `${API_PREFIX}/types/${data.id}`,
    data,
  });
}

/** 删除字典类型 */
export function deleteType(data: { id: number }) {
  return _delete<ApiResponse<unknown>, undefined>({
    url: `${API_PREFIX}/types/${data.id}`,
  });
}

// ========== 字典项（字段项） ==========

/** 字典项列表 */
export function getItemList(params?: DictItemListParams) {
  return _get<DictItemRps, DictItemListParams | undefined>({
    url: `${API_PREFIX}/items`,
    params: params ?? {},
  });
}

/** 字典项详情 */
export function getItemDetail(data: { id: number }) {
  return _get<ApiResponse<DictItem>, undefined>({
    url: `${API_PREFIX}/items/${data.id}`,
  });
}

/** 新增字典项 */
export function createItem(data: Partial<DictItem>) {
  return _post<ApiResponse<DictItem>, Partial<DictItem>>({
    url: `${API_PREFIX}/items`,
    data,
  });
}

/** 更新字典项 */
export function updateItem(data: Partial<DictItem> & { id: number }) {
  return _put<ApiResponse<unknown>, Partial<DictItem> & { id: number }>({
    url: `${API_PREFIX}/items/${data.id}`,
    data,
  });
}

/** 删除字典项 */
export function deleteItem(data: { id: number }) {
  return _delete<ApiResponse<unknown>, undefined>({
    url: `${API_PREFIX}/items/${data.id}`,
  });
}

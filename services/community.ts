/**
 * 小区字典增删改查 + 腾讯地图 POI 搜索代理
 * 返回类型参考 @/types/community
 */
import { _post, _get, _put, _delete } from './request';
import type {
  Community,
  CommunityListParams,
  CommunityRps,
  PoiSearchParams,
} from '@/types/community';
import type { ApiResponse } from '@/types/public';

const API_PREFIX = '/admin/community';

/** 小区列表（分页） */
export function getCommunityList(params?: CommunityListParams) {
  return _get<CommunityRps, CommunityListParams | undefined>({
    url: `${API_PREFIX}/list`,
    params: params ?? {},
  });
}

/** 小区详情 */
export function getCommunityDetail(data: { id: number }) {
  return _get<ApiResponse<Community>, undefined>({
    url: `${API_PREFIX}/${data.id}`,
  });
}

/** 新增小区 */
export function createCommunity(data: Partial<Community>) {
  return _post<ApiResponse<Community>, Partial<Community>>({
    url: `${API_PREFIX}`,
    data,
  });
}

/** 更新小区 */
export function updateCommunity(data: Partial<Community> & { id: number }) {
  return _put<ApiResponse<unknown>, Partial<Community> & { id: number }>({
    url: `${API_PREFIX}/${data.id}`,
    data,
  });
}

/** 删除小区（被车位引用时后端会拒绝） */
export function deleteCommunity(data: { id: number }) {
  return _delete<ApiResponse<unknown>, undefined>({
    url: `${API_PREFIX}/${data.id}`,
  });
}

/** 腾讯地图 POI 搜索（建库辅助：城市 + 关键词） */
export function searchCommunityPoi(params: PoiSearchParams) {
  return _get<ApiResponse<Community[]>, PoiSearchParams>({
    url: `${API_PREFIX}/poi/search`,
    params,
  });
}

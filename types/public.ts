/*
 * @Author: Jonny
 * @Date: 2026-01-23 11:13:51
 * @LastEditors: Jonny
 * @LastEditTime: 2026-01-23 11:15:02
 * @FilePath: \park-admin\types\public.ts
 */
export interface ApiResponse<T = unknown> {
  code: number;                    // 建议必填
  message: string;                 // 建议必填
  success?: boolean;               // 可选或自己计算 code === 0/200

  data?: T | null;                 // 允许 null

  // 只在需要时出现的字段
  page?: PageVO
  meta?: Record<string, unknown>;

  timestamp?: string | Date;
}


interface PageVO {
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  pageNum?: number;
  pages?: number;
  pageSize?: number;
  total?: number;
}



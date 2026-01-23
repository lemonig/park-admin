/*
 * @Author: Jonny
 * @Date: 2025-12-23 08:55:21
 * @LastEditors: Jonny
 * @LastEditTime: 2026-01-23 16:10:22
 * @FilePath: \park-admin\types\market.ts
 */


import { ApiResponse } from "./public";
export interface SimpleImage {
  id?: string;
  url?: string;
}

export interface Market {
  area?: string;
  auditTime?: Date;
  city?: string;
  code?: string;
  community?: string;
  description?: string;
  gmtCreate?: Date;
  gmtModify?: Date;
  id?: number;
  images?: SimpleImage[];
  parkingNo?: string;
  phone?: string;
  positionDesc?: string;
  price?: number;
  specs?: string;
  status?: number;
  type?: number;
  userId?: number;
}


export interface Request {
  /**
   * 页码（最小1）
   */
  pageNum?: number;
  /**
   * 每页大小（最小1，推荐10-50）
   */
  pageSize?: number;
  /**
   * 车位编号模糊查询（如 'A-101'，可选）
   */
  parkingNo?: string;
  /**
   * 审核状态：0=待审核，1=通过，2=拒绝（可选）
   */
  status?: number;
  /**
   * 租售类型：1=出售，2=租赁（可选）
   */
  type?: number;
}

export type MarketRps = ApiResponse<Market[]>;
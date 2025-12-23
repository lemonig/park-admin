/*
 * @Author: Jonny
 * @Date: 2025-12-23 08:55:21
 * @LastEditors: Jonny
 * @LastEditTime: 2025-12-23 09:37:17
 * @FilePath: \park-web\types\market.tsx
 */
export interface MarketItem {
  id: number;
  code: string;
  user_id: number;
  price: number;
  parking_no: string;
  description?: string;
  type: 1 | 2; // 1出售 2租赁
  phone: string;
  position_desc?: string;
  specs?: string;
  status: 0 | 1 | 2;
  audit_time?: string;
  created_at: string;
  updated_at?: string;
  // 预留字段
  city?: string;
  area?: string;
  community?: string;
}

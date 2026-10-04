/*
 * @Author: Jonny
 * @Date: 2025-12-29 18:57:23
 * @LastEditors: Jonny
 * @LastEditTime: 2026-01-23 16:25:45
 * @FilePath: \park-admin\services\request.ts
 */
// services/request.ts

'use client';
// services/request.ts
import axios, {
  InternalAxiosRequestConfig,
} from 'axios';
import { message } from 'antd';

const request = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

export interface ApiResponse<T> {
  code: number;
  msg: string;
  success: boolean;
  data: T;
}

interface GetOptions<P> {
  url: string;
  params?: P;
}

interface PostOptions<D> {
  url: string;
  data?: D;
}


// 请求拦截：统一加 token
request.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // 只有在客户端环境中才访问 localStorage
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token'); // 假设后台登录存这个 key
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// 响应拦截：统一处理错误
request.interceptors.response.use(
  (response) => {
    // 后端约定：code=200 且 success 未被置 false 才是业务成功；
    // 业务错误（如登录失败）返回 HTTP 200 + code 4xx/5xx + success:false + message
    if (response.data.code === 200 && response.data.success !== false) {
      return response.data; // 直接返回 data
    }
    if (response.data.code === 401 && typeof window !== 'undefined') {
      message.error(response.data.message || response.data.msg || '登录过期，请重新登录');
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    } else {
      message.error(response.data.message || response.data.msg || '操作失败');
    }
    return Promise.reject(response);
  },
  (error) => {
    if (error.response?.status === 401) {
      message.error(error.response?.data?.message || '登录过期，请重新登录');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }

    else if (error.response?.status === 400) {
      message.error(error.response?.data?.message || '请求参数错误');
    }
    else {
      message.error(error.response?.data?.message || error.response?.data?.msg || '网络错误');
    }
    return Promise.reject(error);
  },
);

/**
 * GET 请求
 */
export const _get = <T, P>(
  options: GetOptions<P>,
): Promise<T> => {
  const { url, params } = options;
  return request.get(url, { params });
};

/**
 * POST 请求
 */
export const _post = <T, D>(
  options: PostOptions<D>,
): Promise<T> => {
  const { url, data } = options;

  return request.post(url, data);
};

export const _put = <T, D>(
  options: PostOptions<D>,
): Promise<T> => {
  const { url, data } = options;

  return request.put(url, data);
}

export const _delete = <T, D>(
  options: PostOptions<D>,
): Promise<T> => {
  return request.delete(options.url);
};

/**
 * 下载文件请求
 */

export const _download = <T, D>(
  options: PostOptions<D>,
): Promise<T> => {
  const { url, data } = options;

  return request.post(url, data);
};


export default request;
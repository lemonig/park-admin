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
  AxiosError,
  AxiosInstance,
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
  console.log(config);

  // 只有在客户端环境中才访问 localStorage
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token'); // 假设后台登录存这个 key
    if (token) {
      config.headers.token = `${token}`;
    } else {

    }
  }
  return config;
});

// 响应拦截：统一处理错误
request.interceptors.response.use(
  (response) => {
    console.log(response);

    if (response.data.code === 0) {
      return response.data; // 直接返回 data
    }
    message.error(response.data.msg || '操作失败');
    return Promise.reject(response);
  },
  (error) => {
    if (error.response?.status == 401) {
      message.error('登录过期，请重新登录');
      // 只有在客户端环境中才访问 localStorage
      if (typeof window !== 'undefined') {
        // window.location.href = window.location.origin + "/login";

        localStorage.removeItem('token');
      }
    }

    else if (error.response?.status == 400) {
      message.error(error.response.message);
    }
    else {
      message.error(error.response?.data?.msg || '网络错误');
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
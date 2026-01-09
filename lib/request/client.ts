'use client';

import axios, { AxiosInstance } from 'axios';
import { message } from 'antd';
import type { ApiResponse } from './types';

const clientRequest: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ================= request interceptor ================= */

clientRequest.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers!.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ================= response interceptor ================= */

clientRequest.interceptors.response.use(
  (response) => {
    const res = response.data as ApiResponse;

    if (res.code !== 200) {
      message.error(res.message || '请求失败');

      if (res.code === 401) {
        localStorage.clear();
        window.location.href = '/login';
      }

      return Promise.reject(res);
    }

    return res.data;
  },
  (error) => {
    const status = error?.response?.status;

    switch (status) {
      case 401:
        message.error('未登录');
        window.location.href = '/login';
        break;
      case 403:
        message.error('无权限');
        break;
      case 404:
        message.error('接口不存在');
        break;
      case 500:
        message.error('服务异常');
        break;
      default:
        message.error('网络异常');
    }

    return Promise.reject(error);
  }
);

export default clientRequest;

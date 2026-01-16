/*
 * @Author: Jonny
 * @Date: 2025-12-29 18:57:23
 * @LastEditors: Jonny
 * @LastEditTime: 2026-01-15 19:35:27
 * @FilePath: \park-web\services\request.ts
 */
// services/request.ts
import axios from 'axios';
import { message } from 'antd';
import { useRouter } from 'next/navigation'; // 如果需要跳转登录
const router = useRouter();

const request = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

// 请求拦截：统一加 token
request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // 假设后台登录存这个 key
  if (token) {
    config.headers.token = `${token}`;
  } else {
    router.push("/market");
  }
  return config;
});

// 响应拦截：统一处理错误
request.interceptors.response.use(
  (response) => {
    console.log(response);

    // 假设后端成功返回 { code: 0, data: ..., msg: '' }
    if (response.data.code === 0) {
      return response.data.data; // 直接返回 data
    }
    message.error(response.data.msg || '操作失败');
    return Promise.reject(response.data);
  },
  (error) => {
    if (error.response?.error === "UNAUTHENTICATED") {
      message.error('登录过期，请重新登录');
      // useRouter().push('/login'); // 服务端组件不能用 hook，建议在页面处理
      localStorage.removeItem('token');
    } else {
      message.error(error.response?.data?.msg || '网络错误');
    }
    return Promise.reject(error);
  },
);

export default request;
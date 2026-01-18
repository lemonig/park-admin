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

const request = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

// 请求拦截：统一加 token
request.interceptors.request.use((config) => {

  if (localStorage.getItem("token") || !!localStorage.getItem("token")) {
    config.headers["token"] = localStorage.getItem("token");
  }
  return config;
} ,(err) => {
    return Promise.reject(err);
  }),

// 响应拦截：统一处理错误
request.interceptors.response.use(
  (response) => {
    console.log(response);

    // 假设后端成功返回 { code: 0, data: ..., msg: '' }
     if (response.data && response.data.code === 0) {

      if (response.data instanceof Blob) {
        return Promise.resolve(response);
      }

      if (response.data.code === 401) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = window.location.origin + "/login";
      } else if (response.data.code === 403) {
      }
      // else if (response.data.code !== 0) {
      //   return Promise.reject(response);
      // }
      return Promise.resolve(response.data);
    }
    message.error(response.data.msg || '操作失败');
    return Promise.reject(response.data);
  },
  (error) => {
      console.log(error);
    if (error.response?.status === 401) {
      message.error('登录过期，请重新登录');
        // window.location.href = window.location.origin + "/login";
      // localStorage.removeItem('token');
    } else {
      message.error(error.response?.data?.msg || '网络错误');
    }
    return Promise.reject(error);
  },
);

export default request;
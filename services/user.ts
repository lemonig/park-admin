import request from './request';
// import { clientRequest as request, serverRequest } from '@/lib/request';

// 登录
export const login = (params: any) => {
  return request.post('/api/login', params);
};
export const userList = (params: any) => {
  return request.post('/api/user/all', params);
};

import request from './request';

// 登录
export const login = (params: any) => {
  return request.post('/admin/auth/login', params);
};

export const logout = () => {
  return request.post('/admin/auth/logout', {});
};

export interface UserParams {
  id?: number;
  name?: string;
  doorplate?: string;
  account?: string;
  password?: string;
  mobile?: string;
  avatar?: string;
  description?: string;
}

export const userList = () => {
  return request.get('/admin/users');
};

export const userDetail = (params: { id: number }) => {
  return request.get(`/admin/users/${params.id}`);
};

export const userAdd = (params: UserParams) => {
  return request.post('/admin/users', params);
};

export const userUpdate = (params: UserParams) => {
  return request.put(`/admin/users/${params.id}`, params);
};

export const userDelete = (params: { id: number }) => {
  return request.delete(`/admin/users/${params.id}`);
};

export const userResetPassword = (params: { id: number }) => {
  return request.post(`/admin/users/${params.id}/reset-password`, {});
};

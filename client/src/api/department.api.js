import apiClient from './client.js';

export const getDepartmentsApi = (params) => apiClient.get('/departments', { params });
export const getDepartmentByIdApi = (id) => apiClient.get(`/departments/${id}`);
export const createDepartmentApi = (data) => apiClient.post('/departments', data);
export const updateDepartmentApi = ({ id, ...data }) => apiClient.put(`/departments/${id}`, data);
export const deleteDepartmentApi = (id) => apiClient.delete(`/departments/${id}`);

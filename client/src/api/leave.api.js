import apiClient from './client.js';

export const getLeavesApi = (params) => apiClient.get('/leaves', { params });
export const getLeaveByIdApi = (id) => apiClient.get(`/leaves/${id}`);
export const createLeaveApi = (data) => apiClient.post('/leaves', data);
export const updateLeaveStatusApi = ({ id, status, approvedBy }) => apiClient.put(`/leaves/${id}`, { status, approvedBy });
export const getLeaveSummaryApi = (employeeId) => apiClient.get('/leaves/summary', { params: { employeeId } });
export const getMyLeavesApi = (employeeId) => apiClient.get('/leaves', { params: { employee: employeeId } });

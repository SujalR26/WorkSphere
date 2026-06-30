import apiClient from './client.js';

export const getTasksApi = (params) => apiClient.get('/tasks', { params });
export const getTaskByIdApi = (id) => apiClient.get(`/tasks/${id}`);
export const createTaskApi = (data) => apiClient.post('/tasks', data);
export const updateTaskApi = ({ id, ...data }) => apiClient.put(`/tasks/${id}`, data);
export const deleteTaskApi = (id) => apiClient.delete(`/tasks/${id}`);
export const addTaskCommentApi = ({ id, ...commentData }) => apiClient.post(`/tasks/${id}/comments`, commentData);
export const updateTaskStatusApi = ({ id, status }) => apiClient.put(`/tasks/${id}`, { status });
export const updateTaskAssigneeApi = ({ id, assignee }) => apiClient.put(`/tasks/${id}`, { assignee });

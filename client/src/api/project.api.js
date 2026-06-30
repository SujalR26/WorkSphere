import apiClient from './client.js';

export const getProjectsApi = (params) => apiClient.get('/projects', { params });
export const getProjectByIdApi = (id) => apiClient.get(`/projects/${id}`);
export const createProjectApi = (data) => apiClient.post('/projects', data);
export const updateProjectApi = ({ id, ...data }) => apiClient.put(`/projects/${id}`, data);
export const deleteProjectApi = (id) => apiClient.delete(`/projects/${id}`);
export const archiveProjectApi = (id) => apiClient.put(`/projects/${id}`, { status: 'Archived' });
export const completeProjectApi = (id) => apiClient.put(`/projects/${id}`, { status: 'Completed' });

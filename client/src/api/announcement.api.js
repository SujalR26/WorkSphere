import apiClient from './client.js';

export const getAnnouncementsApi = (params) => apiClient.get('/announcements', { params });
export const getAnnouncementByIdApi = (id) => apiClient.get(`/announcements/${id}`);
export const createAnnouncementApi = (data) => apiClient.post('/announcements', data);
export const updateAnnouncementApi = ({ id, ...data }) => apiClient.put(`/announcements/${id}`, data);
export const deleteAnnouncementApi = (id) => apiClient.delete(`/announcements/${id}`);

import apiClient from './client.js';

export const getNotificationsApi = (params) => apiClient.get('/notifications', { params });
export const markNotificationReadApi = (id) => apiClient.put(`/notifications/${id}/read`);
export const markAllNotificationsReadApi = (recipient) => apiClient.put('/notifications/read-all', { recipient });
export const createNotificationApi = (data) => apiClient.post('/notifications', data);

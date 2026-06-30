import apiClient from './client.js';

export const getActivityLogsApi = (params) => apiClient.get('/activity-logs', { params });

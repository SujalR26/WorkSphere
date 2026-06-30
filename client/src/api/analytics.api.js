import apiClient from './client.js';

export const getDashboardStatsApi = () => apiClient.get('/analytics/stats');
export const getDashboardAnalyticsApi = () => apiClient.get('/analytics/dashboard');
export const getReportAnalyticsApi = () => apiClient.get('/analytics/dashboard'); // reusing the general metrics for reporting

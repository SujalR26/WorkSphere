import apiClient from './client.js';

export const getSettingsApi = () => apiClient.get('/settings');
export const updateSettingsApi = (data) => apiClient.put('/settings', data);

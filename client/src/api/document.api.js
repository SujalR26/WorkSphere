import apiClient from './client.js';

export const getDocumentsApi = (params) => apiClient.get('/documents', { params });
export const getDocumentByIdApi = (id) => apiClient.get(`/documents/${id}`);
export const createDocumentApi = (data) => apiClient.post('/documents', data);
export const deleteDocumentApi = (id) => apiClient.delete(`/documents/${id}`);

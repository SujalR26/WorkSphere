import apiClient from './client.js';

export const getTeamsApi = (params) => apiClient.get('/teams', { params });
export const getTeamByIdApi = (id) => apiClient.get(`/teams/${id}`);
export const createTeamApi = (data) => apiClient.post('/teams', data);
export const updateTeamApi = ({ id, ...data }) => apiClient.put(`/teams/${id}`, data);
export const deleteTeamApi = (id) => apiClient.delete(`/teams/${id}`);
export const addTeamMemberApi = ({ id, employeeId }) => apiClient.post(`/teams/${id}/members`, { employeeId });
export const removeTeamMemberApi = ({ id, employeeId }) => apiClient.delete(`/teams/${id}/members/${employeeId}`);

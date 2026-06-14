import API from './axios';

export const login = (credentials) => API.post('/api/auth/login', credentials);

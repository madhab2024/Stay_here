import api from '../services/api';

export const loginUser = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

export const registerUser = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

export const getHostStatus = async () => {
    const response = await api.get('/auth/host-status');
    return response.data;
};

import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const fetchAdminStats = () => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const fetchAllUsers = () => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const fetchAllProperties = () => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_URL}/admin/properties`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

import axios from 'axios';

const client = axios.create({
    baseURL: 'http://localhost:5000', // Adjust if backend runs elsewhere
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor to add auth token
client.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default client;

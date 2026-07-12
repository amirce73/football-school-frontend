import axios from 'axios';

// Create an Axios instance with base URL
const api = axios.create({
    baseURL: 'http://localhost:5200/api', // Address of the .NET Backend
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interceptor to automatically add JWT token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;

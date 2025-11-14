// src/api/api.js
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
});

// Add Authorization header automatically if token is present in localStorage
apiClient.interceptors.request.use((config) => {
    try {
        const stored = localStorage.getItem('authUser');
        if (stored) {
            const { token } = JSON.parse(stored);
            if (token) config.headers['Authorization'] = `Bearer ${token}`;
        }
    } catch (e) {
        // ignore
    }
    return config;
}, (error) => Promise.reject(error));

export default apiClient;

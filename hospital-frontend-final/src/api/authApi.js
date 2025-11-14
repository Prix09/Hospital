// src/api/authApi.js
import apiClient from './api';

export const signup = (signupData) => {
    return apiClient.post('/auth/signup', signupData).then(res => res.data);
};

export const login = (loginData) => {
    return apiClient.post('/auth/signin', loginData).then(res => res.data);
};

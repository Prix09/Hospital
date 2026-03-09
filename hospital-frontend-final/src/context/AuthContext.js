// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import * as authApi from '../api/authApi';
import apiClient from '../api/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Token stored in user object — load from localStorage on mount
    useEffect(() => {
        const s = localStorage.getItem('authUser');
        if (s) {
            try {
                const parsed = JSON.parse(s);
                setUser(parsed);
                if (parsed.token) apiClient.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
            } catch {
                localStorage.removeItem('authUser');
            }
        }
        setLoading(false);
    }, []);

    /**
     * Login with USERNAME (not email) — backend uses username for auth.
     */
    const login = async (username, password) => {
        // Backend Spring Security expects 'username' and 'password'
        const data = await authApi.login({ username, password });
        // Backend JwtResponse: { token, id, email, name, roles: [...] }
        const authUser = {
            id: data.id,
            email: data.email,
            name: data.name || data.username || username,
            roles: data.roles || [],
            token: data.token,
            // Derived convenience field
            token_field: data.token,
        };
        localStorage.setItem('authUser', JSON.stringify(authUser));
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${authUser.token}`;
        setUser(authUser);
        return authUser;
    };

    const signup = async (username, name, email, password, role = 'patient', specialization = '') => {
        const roles = [role];
        await authApi.signup({ username, name, email, password, role: roles, specialization });
        return login(username, password);
    };

    const logout = () => {
        localStorage.removeItem('authUser');
        delete apiClient.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, token: user?.token }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

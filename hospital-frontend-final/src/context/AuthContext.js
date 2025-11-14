// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import * as authApi from '../api/authApi';
import apiClient from '../api/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // load user from localStorage on mount
    useEffect(() => {
        const s = localStorage.getItem('authUser');
        if (s) {
            try {
                const parsed = JSON.parse(s);
                setUser(parsed);
                if (parsed.token) apiClient.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
            } catch (e) {
                localStorage.removeItem('authUser');
            }
        }
        setLoading(false);
    }, []);

    // login returns the user object (with token)
    const login = async (email, password) => {
        const data = await authApi.login({ email, password });
        // Expecting backend JwtResponse like: { token, id, email, name, roles }
        const authUser = {
            id: data.id,
            email: data.email,
            name: data.name,
            roles: data.roles || [],
            token: data.token,
        };
        localStorage.setItem('authUser', JSON.stringify(authUser));
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${authUser.token}`;
        setUser(authUser);
        return authUser;
    };

    // signup(name, email, password, roleString) -> posts then logs in
    const signup = async (name, email, password, role = 'patient') => {
        // backend expects roles as array (Set<String>), so send as array of strings
        const roles = [role]; // e.g. ['patient'] or ['doctor']
        await authApi.signup({ name, email, password, roles });
        // after signup, automatically login and return user
        return login(email, password);
    };

    const logout = () => {
        localStorage.removeItem('authUser');
        delete apiClient.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    return children;
};

export const DoctorRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    const isDoctor = user.roles && user.roles.some(r => r === 'ROLE_DOCTOR' || r === 'doctor');
    if (!isDoctor) return <Navigate to="/" replace />;
    return children;
};

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * A component to protect routes that require any user to be logged in.
 * If the user is not authenticated, it redirects them to the login page.
 */
export const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();

    if (!user) {
        // The 'replace' prop is important for a good user experience,
        // preventing them from using the back button to get to the protected page.
        return <Navigate to="/login" replace />;
    }

    return children;
};


/**
 * A component to protect routes specifically for users with the 'doctor' role.
 * It first checks for login, then checks for the correct role.
 */
export const DoctorRoute = ({ children }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== 'doctor') {
        // If they are logged in but not a doctor, send them to the home page
        // as they have no business on the doctor's dashboard.
        return <Navigate to="/" replace />;
    }

    return children;
};

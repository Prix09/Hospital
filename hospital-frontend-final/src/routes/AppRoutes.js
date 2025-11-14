import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Route Guards
import { ProtectedRoute, DoctorRoute } from './ProtectedRoute';

// Pages
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import DoctorDashboard from '../pages/DoctorDashboard';
import BookAppointmentPage from '../pages/BookAppointmentPage';
import VideoConsultationPage from '../pages/VideoConsultationPage';

export default function AppRoutes() {
    const { user } = useAuth();

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />

            {/* Auth Routes */}
            <Route
                path="/login"
                element={user ? <Navigate to="/" replace /> : <LoginPage />}
            />
            <Route
                path="/signup"
                element={user ? <Navigate to="/" replace /> : <SignupPage />}
            />

            {/* Protected Routes */}
            <Route
                path="/book-appointment"
                element={
                    <ProtectedRoute>
                        <BookAppointmentPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/video-consultation/:appointmentId"
                element={
                    <ProtectedRoute>
                        <VideoConsultationPage />
                    </ProtectedRoute>
                }
            />

            {/* Doctor-only Routes */}
            <Route
                path="/doctor-dashboard"
                element={
                    <DoctorRoute>
                        <DoctorDashboard />
                    </DoctorRoute>
                }
            />

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

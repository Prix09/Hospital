import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { NotificationProvider } from './context/NotificationContext';
import { ProtectedRoute, DoctorRoute } from './routes/ProtectedRoute';

import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DoctorDashboard from './pages/DoctorDashboard';
import BookAppointmentPage from './pages/BookAppointmentPage';
import VideoConsultationPage from './pages/VideoConsultationPage';
import ProfilePage from './pages/ProfilePage';
import AppointmentsPage from './pages/AppointmentsPage';
import DocumentsPage from './pages/DocumentsPage';

function AppContent() {
    const { user } = useAuth();
    const isDoctor = user && user.roles && user.roles.some(r => r === 'ROLE_DOCTOR' || r === 'doctor');

    return (
        <div className="fade-in">
            <Navbar />
            <div className="page-wrapper">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
                    <Route path="/signup" element={user ? <Navigate to="/" replace /> : <SignupPage />} />

                    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                    <Route path="/appointments" element={<ProtectedRoute><AppointmentsPage /></ProtectedRoute>} />
                    <Route path="/documents" element={<ProtectedRoute><DocumentsPage /></ProtectedRoute>} />
                    <Route path="/book-appointment" element={<ProtectedRoute><BookAppointmentPage /></ProtectedRoute>} />
                    <Route path="/video-consultation/:appointmentId" element={<ProtectedRoute><VideoConsultationPage /></ProtectedRoute>} />
                    <Route path="/doctor-dashboard" element={<DoctorRoute><DoctorDashboard /></DoctorRoute>} />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </div>
    );
}

export default function App() {
    return (
        <NotificationProvider>
            <AppContent />
        </NotificationProvider>
    );
}

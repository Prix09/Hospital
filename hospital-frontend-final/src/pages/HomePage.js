import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function HomePage() {
    const { user, logout } = useAuth();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800 p-4">
            <div className="max-w-2xl w-full text-center p-8 bg-white rounded-xl shadow-md">
                <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4">
                    Welcome to HealthConnect
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                    Your trusted platform for online medical consultations.
                </p>

                {user ? (
                    // --- User is Logged In ---
                    <div>
                        <p className="text-xl mb-4">
                            Hello, <span className="font-semibold">{user.email}</span>!
                        </p>
                        <p className="mb-6">What would you like to do today?</p>
                        <div className="flex flex-col md:flex-row gap-4 justify-center">
                            {user.role === 'doctor' ? (
                                <Link
                                    to="/doctor-dashboard"
                                    className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors"
                                >
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <Link
                                    to="/book-appointment"
                                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                                >
                                    Book an Appointment
                                </Link>
                            )}
                            <button
                                onClick={logout}
                                className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                ) : (
                    // --- User is Logged Out ---
                    <div>
                        <p className="mb-6">Please log in or sign up to continue.</p>
                        <div className="flex gap-4 justify-center flex-wrap">
                            <Link
                                to="/login"
                                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="px-8 py-3 bg-gray-700 text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 transition-colors"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

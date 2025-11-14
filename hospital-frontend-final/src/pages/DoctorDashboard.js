import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/formatDate';

export default function DoctorDashboard() {
    const { user, token, logout } = useAuth();
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/appointments/doctor/${user.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                setAppointments(data);
            } catch (err) {
                console.error('Error fetching appointments', err);
            }
        };
        fetchAppointments();
    }, [user.id, token]);

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-6xl p-6 bg-white rounded-xl shadow-lg text-gray-800">
                <header className="flex flex-wrap justify-between items-center pb-4 border-b border-gray-200 mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Doctor Dashboard</h1>
                    <div className="flex gap-4">
                        <Link
                            to="/"
                            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                        >
                            Home
                        </Link>
                        <button
                            onClick={logout}
                            className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                <main>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Upcoming Appointments</h2>
                    <div className="space-y-4">
                        {appointments.length === 0 && <p>No appointments found.</p>}
                        {appointments.map((apt) => (
                            <div
                                key={apt.id}
                                className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-wrap justify-between items-center gap-4"
                            >
                                <div>
                                    <p className="font-bold text-lg">{apt.patientName}</p>
                                    <p className="text-gray-600">Date: {formatDate(apt.appointmentTime)}</p>
                                    <p className={`font-semibold px-3 py-1 text-sm rounded-full ${
                                        apt.status === 'SCHEDULED'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-green-100 text-green-800'
                                    }`}>
                                        {apt.status}
                                    </p>
                                </div>
                                {apt.status === 'SCHEDULED' && (
                                    <Link
                                        to={`/video-consultation/${apt.id}`}
                                        className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
                                    >
                                        Start Video Consultation
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}

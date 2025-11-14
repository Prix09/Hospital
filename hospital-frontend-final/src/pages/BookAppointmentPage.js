import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function BookAppointmentPage() {
    const { user, token } = useAuth();
    const navigate = useNavigate();

    // State initialization
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true); // State to handle loading UX

    // Fetch all doctors from backend
    useEffect(() => {
        // Don't fetch if there's no token
        if (!token) {
            setLoading(false);
            return;
        }

        const fetchDoctors = async () => {
            setLoading(true);
            try {
                const res = await fetch('http://localhost:8080/api/users/doctors', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch doctors from the server.');
                }

                const data = await res.json();

                // ✅ KEY FIX: Only update state if the API returns a valid array
                if (Array.isArray(data)) {
                    setDoctors(data);
                    // Set a default selection only if doctors are available
                    if (data.length > 0) {
                        setSelectedDoctor(data[0].id);
                    }
                } else {
                    console.error("API did not return an array:", data);
                    setDoctors([]); // Keep state as an empty array to prevent crashes
                }
            } catch (err) {
                console.error('Error fetching doctors:', err);
                setMessage('Could not load doctor information.'); // Show a user-friendly error
            } finally {
                setLoading(false); // Stop loading in all cases
            }
        };

        fetchDoctors();
    }, [token]);

    const handleBooking = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!selectedDoctor) {
            setMessage('Please select a doctor.');
            return;
        }

        try {
            const res = await fetch('http://localhost:8080/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    patientId: user.id,
                    doctorId: selectedDoctor,
                    // ✅ FIX: Format the date to a standard ISO string for the backend
                    appointmentTime: new Date(appointmentDate).toISOString(),
                }),
            });

            const responseData = await res.json();

            if (!res.ok) {
                setMessage(responseData.message || 'Booking failed. Please try again.');
            } else {
                setMessage('Appointment booked successfully!');
                navigate(`/video-consultation/${responseData.id}`);
            }
        } catch (err) {
            setMessage('An error occurred while booking the appointment.');
            console.error(err);
        }
    };

    // Show a loading message while fetching data
    if (loading) {
        return <div className="text-center p-10 font-semibold">Loading doctors...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-2xl p-8 bg-white rounded-xl shadow-md text-gray-800">
                <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
                    Book an Appointment
                </h1>
                <p className="text-center text-lg mb-8">
                    Logged in as: <span className="font-semibold">{user?.email}</span>
                </p>

                <form onSubmit={handleBooking} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Select Doctor</label>
                        <select
                            value={selectedDoctor}
                            onChange={(e) => setSelectedDoctor(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                            disabled={doctors.length === 0} // Disable the dropdown if no doctors are available
                        >
                            {/* ✅ FIX: Handle the case where the doctors array is empty */}
                            {doctors.length === 0 ? (
                                <option>No doctors available</option>
                            ) : (
                                doctors.map((doc) => (
                                    <option key={doc.id} value={doc.id}>
                                        {doc.name} ({doc.specialization || 'General'})
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Select Date & Time</label>
                        <input
                            type="datetime-local"
                            value={appointmentDate}
                            onChange={(e) => setAppointmentDate(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    {message && <p className="text-sm text-center text-red-600 font-semibold">{message}</p>}

                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                        disabled={doctors.length === 0} // Also disable the button if no doctors
                    >
                        Confirm Booking
                    </button>
                </form>
            </div>
        </div>
    );
}
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function VideoConsultationPage() {
    const { user } = useAuth();
    const { appointmentId } = useParams(); // Read appointmentId from URL
    const [callStarted, setCallStarted] = useState(false);

    const handleStartCall = () => {
        // Here you can initialize your WebRTC or signaling logic
        setCallStarted(true);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white p-4">
            <div className="w-full max-w-4xl p-8 bg-gray-900 rounded-xl shadow-lg text-center">
                <h1 className="text-4xl font-bold mb-4">Video Consultation</h1>
                <p className="text-lg text-gray-300 mb-6">
                    Appointment ID: <span className="font-semibold">{appointmentId}</span>
                </p>

                {!callStarted ? (
                    <button
                        onClick={handleStartCall}
                        className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors mb-6"
                    >
                        Start Video Consultation
                    </button>
                ) : (
                    <div className="w-full aspect-video bg-black rounded-lg flex items-center justify-center border border-gray-600 mb-6">
                        <p className="text-gray-400">Video feed is live...</p>
                        {/* Your WebRTC video elements would go here */}
                    </div>
                )}

                <p className="mb-8">
                    You are in the consultation room as <span className="font-semibold">{user?.email}</span>.
                </p>

                <Link
                    to="/"
                    className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors"
                >
                    End Call & Return Home
                </Link>
            </div>
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function AppointmentsPage() {
    const { user, token } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(true);

    const isDoctor = user && user.roles && user.roles.some(r => r === 'ROLE_DOCTOR' || r === 'doctor');

    useEffect(() => {
        fetchAppointments();
    }, [user]);

    const fetchAppointments = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const endpoint = isDoctor
                ? `http://localhost:8080/api/appointments/doctor/${user.id}`
                : `http://localhost:8080/api/appointments/patient/${user.id}`;
            const res = await fetch(endpoint, { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            if (res.ok) {
                setAppointments(Array.isArray(data) ? data : []);
            } else {
                setMessage({ text: data.message || 'Failed to load appointments.', type: 'error' });
            }
        } catch {
            setMessage({ text: 'Could not connect to server.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Cancel this appointment?')) return;
        try {
            const res = await fetch(`http://localhost:8080/api/appointments/${id}/cancel`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setMessage({ text: 'Appointment cancelled.', type: 'success' });
                fetchAppointments();
            }
        } catch {
            setMessage({ text: 'Failed to cancel.', type: 'error' });
        }
    };

    const handleDownloadPrescription = async (appointmentId) => {
        setMessage({ text: '⏳ Generating prescription...', type: 'info' });
        try {
            // Step 1: Auto-generate prescription (creates one from reason if it doesn't exist)
            const autoRes = await fetch(`http://localhost:8080/api/prescriptions/auto/${appointmentId}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!autoRes.ok) {
                const err = await autoRes.json();
                setMessage({ text: err.message || 'Failed to generate prescription.', type: 'error' });
                return;
            }
            const prescription = await autoRes.json();

            // Step 2: Download the PDF
            const pdfRes = await fetch(`http://localhost:8080/api/prescriptions/${prescription.id}/download`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (pdfRes.ok) {
                const blob = await pdfRes.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `prescription-${appointmentId}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                setMessage({
                    text: `✅ Prescription generated! Diagnosis: ${prescription.diagnosis}`,
                    type: 'success'
                });
            } else {
                setMessage({ text: 'Failed to download PDF.', type: 'error' });
            }
        } catch {
            setMessage({ text: 'Error generating prescription. Please try again.', type: 'error' });
        }
    };

    const statusClass = (s) => {
        const map = { APPROVED: 'badge badge-green', SCHEDULED: 'badge badge-yellow', CANCELLED: 'badge badge-red', COMPLETED: 'badge badge-blue' };
        return map[s] || 'badge badge-gray';
    };

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 className="section-title" style={{ marginBottom: '0.25rem' }}>
                        {isDoctor ? 'Patient Appointments' : 'My Appointments'}
                    </h1>
                    <p className="text-muted">{appointments.length} total appointments</p>
                </div>
                {!isDoctor && (
                    <Link to="/book-appointment">
                        <button className="btn btn-primary">+ Book Appointment</button>
                    </Link>
                )}
            </div>

            {message.text && (
                <div className={`alert alert-${message.type}`} style={{ marginBottom: '1.5rem' }}>
                    {message.text}
                </div>
            )}

            {loading ? (
                <div className="spinner"></div>
            ) : appointments.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
                    <h3 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>No appointments yet</h3>
                    <p className="text-muted">
                        {isDoctor ? 'No patients have booked with you yet.' : 'Book your first appointment to get started.'}
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {appointments.map(apt => (
                        <div key={apt.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <span className={statusClass(apt.status)}>{apt.status}</span>
                                    <span className="text-muted">#{apt.id}</span>
                                </div>
                                <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1e293b', marginBottom: '0.25rem' }}>
                                    {isDoctor
                                        ? `Patient: ${apt.patientName}`
                                        : `Dr. ${(apt.doctorName || '').replace(/^Dr\.?\s+/i, '').trim()}`}
                                </h3>
                                <p className="text-muted">
                                    📅 {new Date(apt.appointmentTime).toLocaleString()}
                                </p>
                                {apt.reason && <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>Reason: {apt.reason}</p>}
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {apt.status === 'SCHEDULED' && !isDoctor && (
                                    <button className="btn btn-danger btn-sm" onClick={() => handleCancel(apt.id)}>Cancel</button>
                                )}
                                {(apt.status === 'APPROVED' || apt.status === 'SCHEDULED') && (
                                    <Link to={`/video-consultation/${apt.id}`}>
                                        <button className="btn btn-success btn-sm">🎥 Join Video</button>
                                    </Link>
                                )}
                                {apt.status !== 'CANCELLED' && !isDoctor && (
                                    <button className="btn btn-secondary btn-sm" onClick={() => handleDownloadPrescription(apt.id)}>
                                        📄 Prescription
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

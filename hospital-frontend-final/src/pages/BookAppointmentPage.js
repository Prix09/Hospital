import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function BookAppointmentPage() {
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [reason, setReason] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!token) { setLoading(false); return; }
        const fetchDoctors = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/users/doctors', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (Array.isArray(data)) {
                    setDoctors(data);
                    if (data.length > 0) setSelectedDoctor(data[0].id);
                }
            } catch {
                setMessage({ text: 'Could not load doctors. Please try again.', type: 'error' });
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, [token]);

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!selectedDoctor) { setMessage({ text: 'Please select a doctor.', type: 'error' }); return; }
        setSubmitting(true);
        setMessage({ text: '', type: '' });
        try {
            const res = await fetch('http://localhost:8080/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    patientId: user.id,
                    doctorId: parseInt(selectedDoctor),
                    appointmentTime: new Date(appointmentDate).toISOString(),
                    reason
                })
            });
            const data = await res.json();
            if (res.ok) {
                setMessage({ text: '✅ Appointment booked successfully! Awaiting doctor approval.', type: 'success' });
                setTimeout(() => navigate('/appointments'), 2000);
            } else {
                setMessage({ text: data.message || 'Booking failed. Please try again.', type: 'error' });
            }
        } catch {
            setMessage({ text: 'Could not connect to server.', type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)', background: 'linear-gradient(135deg, #eff6ff, #f5f3ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div className="card slide-up" style={{ maxWidth: '600px', width: '100%', borderRadius: '24px', padding: '2.5rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.35rem' }}>Book an Appointment</h1>
                    <p className="text-muted">Fill in the details below to schedule your consultation</p>
                </div>

                {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}

                {loading ? (
                    <div className="spinner"></div>
                ) : (
                    <form onSubmit={handleBooking}>
                        <div className="form-group">
                            <label className="form-label">Select Doctor</label>
                            <select
                                className="form-select"
                                value={selectedDoctor}
                                onChange={e => setSelectedDoctor(e.target.value)}
                                required
                                disabled={doctors.length === 0}
                            >
                                {doctors.length === 0
                                    ? <option>No doctors available</option>
                                    : doctors.map(d => (
                                        <option key={d.id} value={d.id}>
                                            Dr. {(d.name || '').replace(/^Dr\.?\s+/i, '').trim()} — {d.specialization || 'General Practice'}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Date & Time</label>
                            <input
                                className="form-input"
                                type="datetime-local"
                                value={appointmentDate}
                                onChange={e => setAppointmentDate(e.target.value)}
                                required
                                min={new Date().toISOString().slice(0, 16)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Reason for Visit</label>
                            <textarea
                                className="form-input"
                                rows="4"
                                placeholder="Describe your symptoms or reason for the consultation..."
                                value={reason}
                                onChange={e => setReason(e.target.value)}
                                required
                                style={{ resize: 'vertical' }}
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitting || doctors.length === 0}
                            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
                        >
                            {submitting ? 'Booking...' : '📅 Confirm Appointment'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
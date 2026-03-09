import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

function PrescriptionModal({ appointment, onClose, onSave }) {
    const [form, setForm] = useState({ diagnosis: '', medication: '', dosage: '', instructions: '' });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        const instructions = form.dosage
            ? `Dosage: ${form.dosage}. ${form.instructions}`.trim()
            : form.instructions;
        await onSave({
            appointmentId: appointment.id,
            diagnosis: form.diagnosis,
            medication: form.medication,
            instructions,
        });
        setSaving(false);
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>✕</button>
                <h2 className="modal-title">Write Prescription</h2>
                <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
                    Patient: <strong>{appointment.patientName}</strong>
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Diagnosis</label>
                        <input className="form-input" placeholder="e.g. Viral Fever" value={form.diagnosis} onChange={e => setForm({ ...form, diagnosis: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Medication</label>
                        <input className="form-input" placeholder="e.g. Paracetamol 500mg" value={form.medication} onChange={e => setForm({ ...form, medication: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Dosage</label>
                        <input className="form-input" placeholder="e.g. 3 times a day for 5 days" value={form.dosage} onChange={e => setForm({ ...form, dosage: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Instructions</label>
                        <textarea className="form-input" rows="3" placeholder="Additional instructions..." value={form.instructions} onChange={e => setForm({ ...form, instructions: e.target.value })} style={{ resize: 'vertical' }}></textarea>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Prescription'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function DoctorDashboard() {
    const { user, token, logout } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [availability, setAvailability] = useState([]);
    const [newSlot, setNewSlot] = useState({ dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '17:00' });
    const [message, setMessage] = useState({ text: '', type: '' });
    const [selectedApt, setSelectedApt] = useState(null);
    const [activeTab, setActiveTab] = useState('appointments');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
        fetchAvailability();
    }, []);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8080/api/appointments/doctor/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setAppointments(Array.isArray(data) ? data : []);
        } catch { } finally { setLoading(false); }
    };

    const fetchAvailability = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/doctors/${user.id}/availability`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setAvailability(Array.isArray(data) ? data : []);
        } catch { }
    };

    const handleApprove = async (id) => {
        const res = await fetch(`http://localhost:8080/api/appointments/${id}/approve`, {
            method: 'PUT', headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) { setMessage({ text: 'Appointment approved ✅', type: 'success' }); fetchAppointments(); }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Reject this appointment?')) return;
        const res = await fetch(`http://localhost:8080/api/appointments/${id}/cancel`, {
            method: 'PUT', headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) { setMessage({ text: 'Appointment rejected.', type: 'info' }); fetchAppointments(); }
    };

    const handleAddAvailability = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:8080/api/doctors/availability', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ ...newSlot, doctorId: user.id })
        });
        if (res.ok) { fetchAvailability(); setMessage({ text: 'Availability slot added!', type: 'success' }); }
    };

    const handleDeleteAvailability = async (id) => {
        await fetch(`http://localhost:8080/api/doctors/availability/${id}`, {
            method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
        });
        fetchAvailability();
    };

    const handleSavePrescription = async (prescriptionData) => {
        const res = await fetch('http://localhost:8080/api/prescriptions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(prescriptionData)
        });
        if (res.ok) {
            setMessage({ text: 'Prescription saved successfully ✅', type: 'success' });
            setSelectedApt(null);
        } else {
            setMessage({ text: 'Failed to save prescription.', type: 'error' });
        }
    };

    const statusBadge = (s) => {
        const map = { APPROVED: 'badge badge-green', SCHEDULED: 'badge badge-yellow', CANCELLED: 'badge badge-red', COMPLETED: 'badge badge-blue' };
        return map[s] || 'badge badge-gray';
    };

    const stats = {
        total: appointments.length,
        pending: appointments.filter(a => a.status === 'SCHEDULED').length,
        approved: appointments.filter(a => a.status === 'APPROVED').length,
    };

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem', maxWidth: '1100px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#1e293b' }}>Doctor Dashboard</h1>
                    <p className="text-muted">Welcome, Dr. {((user?.name || user?.email || '')).replace(/^Dr\.?\s+/i, '').trim()}</p>
                </div>
                <button className="btn btn-danger btn-sm" onClick={logout}>Logout</button>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '2rem' }}>
                {[
                    { label: 'Total', value: stats.total, icon: '📋', color: '#4f46e5' },
                    { label: 'Pending', value: stats.pending, icon: '⏳', color: '#d97706' },
                    { label: 'Approved', value: stats.approved, icon: '✅', color: '#059669' },
                ].map(s => (
                    <div key={s.label} className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{s.icon}</div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                        <div className="text-muted">{s.label}</div>
                    </div>
                ))}
            </div>

            {message.text && <div className={`alert alert-${message.type}`} style={{ marginBottom: '1.5rem' }}>{message.text}</div>}

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0' }}>
                {['appointments', 'availability'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '0.6rem 1.25rem', border: 'none', cursor: 'pointer', fontWeight: 600,
                            fontSize: '0.9rem', borderRadius: '8px 8px 0 0', background: 'none',
                            color: activeTab === tab ? '#4f46e5' : '#64748b',
                            borderBottom: activeTab === tab ? '2px solid #4f46e5' : '2px solid transparent',
                            marginBottom: '-2px',
                        }}
                    >
                        {tab === 'appointments' ? '📋 Appointments' : '🗓 Availability'}
                    </button>
                ))}
            </div>

            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
                loading ? <div className="spinner"></div> :
                appointments.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                        <h3 style={{ color: '#1e293b' }}>No appointments yet</h3>
                        <p className="text-muted">Patients will appear here once they book with you.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {appointments.map(apt => (
                            <div key={apt.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                <div>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                                        <span className={statusBadge(apt.status)}>{apt.status}</span>
                                        <span className="text-muted">#{apt.id}</span>
                                    </div>
                                    <p style={{ fontWeight: 700, fontSize: '1.05rem' }}>{apt.patientName}</p>
                                    <p className="text-muted">📅 {new Date(apt.appointmentTime).toLocaleString()}</p>
                                    {apt.reason && <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>Reason: {apt.reason}</p>}
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {apt.status === 'SCHEDULED' && (
                                        <>
                                            <button className="btn btn-success btn-sm" onClick={() => handleApprove(apt.id)}>✅ Approve</button>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleCancel(apt.id)}>✕ Reject</button>
                                        </>
                                    )}
                                    {apt.status === 'APPROVED' && (
                                        <>
                                            <Link to={`/video-consultation/${apt.id}`}>
                                                <button className="btn btn-primary btn-sm">🎥 Start Session</button>
                                            </Link>
                                            <button className="btn btn-secondary btn-sm" onClick={() => setSelectedApt(apt)}>📄 Prescribe</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}

            {/* Availability Tab */}
            {activeTab === 'availability' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div className="card">
                        <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Add Time Slot</h3>
                        <form onSubmit={handleAddAvailability}>
                            <div className="form-group">
                                <label className="form-label">Day of Week</label>
                                <select className="form-select" value={newSlot.dayOfWeek} onChange={e => setNewSlot({ ...newSlot, dayOfWeek: e.target.value })}>
                                    {['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'].map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Start</label>
                                    <input className="form-input" type="time" value={newSlot.startTime} onChange={e => setNewSlot({ ...newSlot, startTime: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">End</label>
                                    <input className="form-input" type="time" value={newSlot.endTime} onChange={e => setNewSlot({ ...newSlot, endTime: e.target.value })} />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>+ Add Slot</button>
                        </form>
                    </div>

                    <div className="card">
                        <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Current Slots ({availability.length})</h3>
                        {availability.length === 0 ? (
                            <p className="text-muted" style={{ textAlign: 'center', padding: '1.5rem 0' }}>No availability slots set.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {availability.map(s => (
                                    <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.85rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{s.dayOfWeek}: {s.startTime} – {s.endTime}</span>
                                        <button onClick={() => handleDeleteAvailability(s.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '1.1rem' }}>🗑</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {selectedApt && (
                <PrescriptionModal
                    appointment={selectedApt}
                    onClose={() => setSelectedApt(null)}
                    onSave={handleSavePrescription}
                />
            )}
        </div>
    );
}

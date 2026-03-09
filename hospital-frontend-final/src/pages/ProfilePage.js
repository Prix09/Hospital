import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../api/api';

export default function ProfilePage() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) return;
        apiClient.get('/users/me')
            .then(res => setProfile(res.data))
            .catch(() => setError('Failed to load profile. Please try again.'))
            .finally(() => setLoading(false));
    }, [user]);

    if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}><div className="spinner"></div></div>;
    if (error) return <div className="container" style={{ paddingTop: '2rem' }}><div className="alert alert-error">{error}</div></div>;

    const data = profile || user || {};
    const isDoctor = data.roles && data.roles.some(r => r === 'ROLE_DOCTOR' || r === 'doctor');

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem', maxWidth: '700px' }}>
            <h1 className="section-title">My Profile</h1>

            {/* Avatar card */}
            <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: '2rem', fontWeight: 800, flexShrink: 0
                }}>
                    {(data.name || data.email || 'U')[0].toUpperCase()}
                </div>
                <div>
                    <h2 style={{ fontWeight: 800, fontSize: '1.35rem', color: '#1e293b' }}>{data.name || 'Unknown User'}</h2>
                    <p className="text-muted">{data.email}</p>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        {(data.roles || []).map(r => (
                            <span key={r} className="badge badge-purple">
                                {r.replace('ROLE_', '')}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Info card */}
            <div className="card">
                <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Account Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                    {[
                        { label: 'Full Name', value: data.name },
                        { label: 'Username', value: data.username },
                        { label: 'Email Address', value: data.email },
                        { label: 'Account Type', value: isDoctor ? 'Doctor' : 'Patient' },
                        ...(data.specialization ? [{ label: 'Specialization', value: data.specialization }] : []),
                    ].map(item => (
                        <div key={item.label}>
                            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {item.label}
                            </p>
                            <p style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.975rem' }}>{item.value || '—'}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

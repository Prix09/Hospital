import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function SignupPage() {
    const [form, setForm] = useState({
        username: '', name: '', email: '', password: '', role: 'patient', specialization: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const user = await signup(form.username, form.name, form.email, form.password, form.role, form.role === 'doctor' ? form.specialization : '');
            const isDoctor = user && user.roles && user.roles.some(r => r === 'ROLE_DOCTOR' || r === 'doctor');
            navigate(isDoctor ? '/doctor-dashboard' : '/book-appointment');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card slide-up" style={{ maxWidth: '500px' }}>
                <div className="auth-logo">
                    <div className="auth-logo-icon">M+</div>
                    <h1 className="auth-title">Create Account</h1>
                    <p className="auth-subtitle">Join MediSync today — it's free</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">Username</label>
                            <input className="form-input" type="text" name="username" placeholder="username" value={form.username} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input className="form-input" type="text" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input className="form-input" type="email" name="email" placeholder="john@example.com" value={form.email} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input className="form-input" type="password" name="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required minLength="6" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">I am a</label>
                        <select className="form-select" name="role" value={form.role} onChange={handleChange}>
                            <option value="patient">Patient</option>
                            <option value="doctor">Doctor</option>
                        </select>
                    </div>

                    {form.role === 'doctor' && (
                        <div className="form-group">
                            <label className="form-label">Specialization</label>
                            <input className="form-input" type="text" name="specialization" placeholder="e.g. Cardiology, Orthopedics" value={form.specialization} onChange={handleChange} required />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', marginTop: '0.5rem' }}
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#64748b', fontSize: '0.9rem' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#4f46e5', fontWeight: 600 }}>Sign in</Link>
                </p>
            </div>
        </div>
    );
}
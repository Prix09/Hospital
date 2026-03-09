import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function HomePage() {
    const { user } = useAuth();
    const isDoctor = user && user.roles && user.roles.some(r => r === 'ROLE_DOCTOR' || r === 'doctor');

    const features = [
        { icon: '📅', title: 'Easy Booking', desc: 'Book appointments with top doctors in seconds.' },
        { icon: '🎥', title: 'Video Consultations', desc: 'Meet your doctor face-to-face from home.' },
        { icon: '📄', title: 'Digital Prescriptions', desc: 'Get and download prescriptions instantly.' },
        { icon: '📁', title: 'Medical Records', desc: 'Securely store and access your health documents.' },
    ];

    return (
        <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f5f3ff 60%, #fdf4ff 100%)', minHeight: 'calc(100vh - 64px)' }}>
            <div className="hero">
                <div className="fade-in">
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        background: '#eff6ff', color: '#4f46e5', borderRadius: '50px',
                        padding: '0.35rem 1rem', fontSize: '0.85rem', fontWeight: 600,
                        marginBottom: '1.5rem', border: '1px solid #c7d2fe'
                    }}>
                        ✨ Trusted by 10,000+ patients
                    </div>

                    <h1 className="hero-title">
                        Your Health, Our <span>Priority</span>
                    </h1>
                    <p className="hero-subtitle">
                        Book appointments, consult doctors via video, manage prescriptions and medical records — all in one secure platform.
                    </p>

                    <div className="hero-actions">
                        {user ? (
                            isDoctor ? (
                                <Link to="/doctor-dashboard">
                                    <button className="btn btn-primary btn-lg">Go to Dashboard →</button>
                                </Link>
                            ) : (
                                <>
                                    <Link to="/book-appointment">
                                        <button className="btn btn-primary btn-lg">Book Appointment →</button>
                                    </Link>
                                    <Link to="/appointments">
                                        <button className="btn btn-secondary btn-lg">My Appointments</button>
                                    </Link>
                                </>
                            )
                        ) : (
                            <>
                                <Link to="/signup">
                                    <button className="btn btn-primary btn-lg">Get Started Free →</button>
                                </Link>
                                <Link to="/login">
                                    <button className="btn btn-secondary btn-lg">Sign In</button>
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="features-grid">
                        {features.map((f, i) => (
                            <div key={i} className="feature-card">
                                <div className="feature-icon">{f.icon}</div>
                                <h3>{f.title}</h3>
                                <p>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

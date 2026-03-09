import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const isDoctor = user && user.roles && user.roles.some(r => r === 'ROLE_DOCTOR' || r === 'doctor');

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                {/* Logo + Home side by side on the LEFT */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
                        <div className="navbar-logo-icon">M+</div>
                        <span className="navbar-logo">MediSync</span>
                    </Link>
                    {/* Home link next to logo */}
                    <NavLink to="/" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} end>
                        Home
                    </NavLink>
                </div>

                {/* Center Nav Links (authenticated pages) */}
                <div className="navbar-links">
                    {user && !isDoctor && (
                        <>
                            <NavLink to="/book-appointment" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Book</NavLink>
                            <NavLink to="/appointments" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Appointments</NavLink>
                            <NavLink to="/documents" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Documents</NavLink>
                        </>
                    )}
                    {user && isDoctor && (
                        <NavLink to="/doctor-dashboard" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Dashboard</NavLink>
                    )}
                    {user && <NavLink to="/profile" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Profile</NavLink>}
                </div>

                {/* Right Actions */}
                <div className="navbar-actions">
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>
                                👤 {user.name || user.email}
                            </span>
                            <button className="btn btn-danger btn-sm" onClick={handleLogout}>Logout</button>
                        </div>
                    ) : (
                        <>
                            <Link to="/login"><button className="btn btn-outline btn-sm">Login</button></Link>
                            <Link to="/signup"><button className="btn btn-primary btn-sm">Sign Up</button></Link>
                        </>
                    )}
                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.4rem' }}
                        className="mobile-menu-btn"
                    >
                        {menuOpen ? '✕' : '☰'}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div style={{ background: 'white', borderTop: '1px solid #e2e8f0', padding: '1rem 1.5rem' }}>
                    <NavLink to="/" className="nav-link" style={{ display: 'block', marginBottom: '0.5rem' }} onClick={() => setMenuOpen(false)}>Home</NavLink>
                    {user && !isDoctor && <>
                        <NavLink to="/book-appointment" className="nav-link" style={{ display: 'block', marginBottom: '0.5rem' }} onClick={() => setMenuOpen(false)}>Book Appointment</NavLink>
                        <NavLink to="/appointments" className="nav-link" style={{ display: 'block', marginBottom: '0.5rem' }} onClick={() => setMenuOpen(false)}>My Appointments</NavLink>
                        <NavLink to="/documents" className="nav-link" style={{ display: 'block', marginBottom: '0.5rem' }} onClick={() => setMenuOpen(false)}>Documents</NavLink>
                    </>}
                    {user && isDoctor && <NavLink to="/doctor-dashboard" className="nav-link" style={{ display: 'block', marginBottom: '0.5rem' }} onClick={() => setMenuOpen(false)}>Dashboard</NavLink>}
                    {user && <NavLink to="/profile" className="nav-link" style={{ display: 'block', marginBottom: '0.5rem' }} onClick={() => setMenuOpen(false)}>Profile</NavLink>}
                    <div style={{ marginTop: '1rem' }}>
                        {user
                            ? <button className="btn btn-danger w-full" onClick={() => { handleLogout(); setMenuOpen(false); }}>Logout</button>
                            : <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <Link to="/login" style={{ flex: 1 }} onClick={() => setMenuOpen(false)}><button className="btn btn-outline w-full">Login</button></Link>
                                <Link to="/signup" style={{ flex: 1 }} onClick={() => setMenuOpen(false)}><button className="btn btn-primary w-full">Sign Up</button></Link>
                              </div>
                        }
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

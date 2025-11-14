import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-white shadow-md fixed w-full z-40">
            <div className="container mx-auto flex justify-between items-center px-4 py-3">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-2">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20" />
                    </svg>
                    <span className="font-bold text-lg text-blue-600">MediConnect</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-4">
                    <NavLink to="/" className="nav-link">Home</NavLink>
                    {user && user.role === 'doctor' && <NavLink to="/doctor-dashboard" className="nav-link">Dashboard</NavLink>}
                    {user && user.role !== 'doctor' && <NavLink to="/book-appointment" className="nav-link">Appointments</NavLink>}
                </div>

                {/* Desktop Buttons */}
                <div className="hidden md:flex items-center space-x-2">
                    {user ? (
                        <Button onClick={logout} variant="danger">Logout</Button>
                    ) : (
                        <>
                            <Link to="/login"><Button variant="primary">Login</Button></Link>
                            <Link to="/signup"><Button variant="secondary">Sign Up</Button></Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md text-gray-500 hover:bg-gray-100">
                        {isOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white shadow-lg border-t border-gray-200">
                    <NavLink to="/" className="block px-4 py-2">Home</NavLink>
                    {user && user.role === 'doctor' && <NavLink to="/doctor-dashboard" className="block px-4 py-2">Dashboard</NavLink>}
                    {user && user.role !== 'doctor' && <NavLink to="/book-appointment" className="block px-4 py-2">Appointments</NavLink>}

                    <div className="px-4 py-2">
                        {user ? (
                            <Button onClick={logout} variant="danger" className="w-full">Logout</Button>
                        ) : (
                            <>
                                <Link to="/login"><Button variant="primary" className="w-full mb-2">Login</Button></Link>
                                <Link to="/signup"><Button variant="secondary" className="w-full">Sign Up</Button></Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
    const { user } = useAuth();
    const [collapsed, setCollapsed] = useState(false);

    if (!user) return null;

    const patientLinks = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Book Appointment', path: '/book-appointment' },
        { name: 'My Appointments', path: '/my-appointments' },
        { name: 'Medical Records', path: '/records' },
    ];

    const doctorLinks = [
        { name: 'Dashboard', path: '/doctor-dashboard' },
        { name: 'Pending Appointments', path: '/pending-appointments' },
        { name: 'My Schedule', path: '/schedule' },
    ];

    const links = user.role === 'doctor' ? doctorLinks : patientLinks;

    const activeLinkStyle = {
        fontWeight: 'bold',
        color: '#2563EB',
        backgroundColor: '#F3F4F6',
    };

    return (
        <aside className={`bg-white shadow-lg h-screen fixed top-0 left-0 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                {!collapsed && (
                    <div>
                        <h2 className="text-xl font-bold text-blue-600">MediConnect</h2>
                        <p className="text-sm text-gray-500 capitalize">{user.role} Panel</p>
                    </div>
                )}
                <button onClick={() => setCollapsed(!collapsed)} className="p-2 rounded-md text-gray-500 hover:bg-gray-100">
                    {collapsed ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M15.707 14.707a1 1 0 01-1.414 0L10 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 5.293a1 1 0 011.414 0L10 9.586l4.293-4.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    )}
                </button>
            </div>

            <nav className="mt-4">
                <ul>
                    {links.map((link) => (
                        <li key={link.name}>
                            <NavLink
                                to={link.path}
                                className="flex items-center px-4 py-2 mt-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition-colors"
                                style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
                            >
                                <span className="truncate">{!collapsed && link.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;

import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

const DashboardLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main content */}
            <div className="flex-1 flex flex-col ml-64 md:ml-64">
                <Navbar />
                <main className="flex-1 p-6 bg-gray-50 mt-16">{children}</main>
                <Footer />
            </div>
        </div>
    );
};

export default DashboardLayout;

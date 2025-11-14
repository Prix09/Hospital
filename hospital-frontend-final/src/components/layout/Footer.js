import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-100 border-t border-gray-200 py-4 mt-auto">
            <div className="container mx-auto text-center text-sm text-gray-600">
                <p>&copy; {new Date().getFullYear()} Tele-Health Platform. All rights reserved.</p>
                <p className="mt-1">
                    <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>
                    <span className="mx-2">|</span>
                    <Link to="/terms-of-service" className="hover:underline">Terms of Service</Link>
                </p>
            </div>
        </footer>
    );
};

export default Footer;

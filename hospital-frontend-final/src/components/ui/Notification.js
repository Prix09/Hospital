import React from 'react';

export default function Notification({ message, type, onClose }) {
    const getStyles = () => {
        switch (type) {
            case 'success': return 'bg-green-600';
            case 'error': return 'bg-red-600';
            case 'warning': return 'bg-yellow-500';
            default: return 'bg-blue-600';
        }
    };

    return (
        <div className={`${getStyles()} text-white px-6 py-3 rounded-xl shadow-2xl flex justify-between items-center min-w-[300px] animate-slide-up glassmorphism`}>
            <span>{message}</span>
            <button onClick={onClose} className="ml-4 font-bold hover:scale-125 transition-transform text-xl">&times;</button>
        </div>
    );
}

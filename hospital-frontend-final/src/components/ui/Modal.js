import React, { useEffect } from 'react';

const Modal = ({ title, children, onClose, size = 'md', footer }) => {
    // Prevent clicks inside the modal from closing it
    const handleModalContentClick = (e) => {
        e.stopPropagation();
    };

    // Close modal on ESC key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Modal size classes
    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-lg',
        lg: 'max-w-3xl',
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
            onClick={onClose} // Close modal when clicking on overlay
        >
            <div
                className={`bg-white rounded-lg shadow-2xl w-full ${sizeClasses[size]}`}
                onClick={handleModalContentClick}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">{children}</div>

                {/* Optional Footer */}
                {footer && <div className="px-6 py-4 border-t border-gray-200">{footer}</div>}
            </div>
        </div>
    );
};

export default Modal;

import React from 'react';

const Spinner = ({ size = 'md', color = 'blue', className = '' }) => {
    // Size classes
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-4',
        lg: 'w-12 h-12 border-6',
    };

    // Color classes
    const colorClasses = {
        blue: 'border-blue-500 border-t-transparent',
        gray: 'border-gray-500 border-t-transparent',
        red: 'border-red-500 border-t-transparent',
        green: 'border-green-500 border-t-transparent',
    };

    return (
        <div className="flex justify-center items-center">
            <div
                className={`rounded-full animate-spin ${sizeClasses[size]} ${
                    colorClasses[color]
                } ${className}`}
            ></div>
        </div>
    );
};

export default Spinner;

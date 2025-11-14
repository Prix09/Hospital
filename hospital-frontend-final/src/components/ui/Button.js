import React from 'react';

const Button = ({
                    children,
                    onClick,
                    type = 'button',
                    variant = 'primary',
                    size = 'md',
                    disabled = false,
                    loading = false,
                    className = '',
                }) => {
    // Base styling
    const baseStyles =
        'inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-200 ease-in-out';

    // Button sizes
    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-5 py-3 text-lg',
    };

    // Variants
    const variantStyles = {
        primary:
            'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-md hover:shadow-lg',
        secondary:
            'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400 shadow-sm hover:shadow-md',
        danger:
            'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-md hover:shadow-lg',
        outline:
            'border border-gray-400 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-400 shadow-sm',
    };

    const disabledStyles = 'opacity-50 cursor-not-allowed shadow-none';

    return (
        <button
            type={type}
            onClick={!disabled && !loading ? onClick : undefined}
            disabled={disabled || loading}
            aria-disabled={disabled || loading}
            className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${
                disabled || loading ? disabledStyles : ''
            } ${className}`}
        >
            {loading ? 'Loading...' : children}
        </button>
    );
};

export default Button;

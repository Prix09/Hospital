import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', size = 'md', disabled = false, loading = false, className = '' }) => {
    const sizeClass = { sm: 'btn-sm', md: '', lg: 'btn-lg' }[size] || '';
    const variantClass = {
        primary: 'btn-primary', secondary: 'btn-secondary',
        danger: 'btn-danger', success: 'btn-success', outline: 'btn-outline'
    }[variant] || 'btn-primary';

    return (
        <button
            type={type}
            onClick={!disabled && !loading ? onClick : undefined}
            disabled={disabled || loading}
            className={`btn ${variantClass} ${sizeClass} ${className}`}
        >
            {loading ? 'Loading...' : children}
        </button>
    );
};

export default Button;

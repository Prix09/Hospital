import React from 'react';

const Input = ({
                   id,
                   label,
                   type = 'text',
                   value,
                   onChange,
                   placeholder = '',
                   required = false,
                   disabled = false,
                   error = false,
                   size = 'md',
                   variant = 'default',
                   className = '',
               }) => {
    // Base styles
    const baseStyles =
        'w-full rounded-md shadow-sm focus:outline-none transition-all duration-200 ease-in-out';

    // Variants
    const variantStyles = {
        default: 'border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500',
        outline: 'border border-gray-400 bg-white text-gray-900 placeholder-gray-400 focus:ring-gray-500 focus:border-gray-500',
        filled: 'border border-gray-300 bg-gray-100 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500',
    };

    // Size styles
    const sizeStyles = {
        sm: 'px-2 py-1 text-sm',
        md: 'px-3 py-2 text-base',
        lg: 'px-4 py-3 text-lg',
    };

    // Disabled and error styles
    const disabledStyles = 'bg-gray-100 cursor-not-allowed opacity-50';
    const errorStyles = 'border-red-500 focus:ring-red-500 focus:border-red-500';

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <input
                type={type}
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${
                    disabled ? disabledStyles : ''
                } ${error ? errorStyles : ''} ${className}`}
            />
        </div>
    );
};

export default Input;

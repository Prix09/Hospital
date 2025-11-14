import React from 'react';

const Card = ({
                  children,
                  variant = 'default',
                  padding = 'md',
                  hoverable = false,
                  className = '',
              }) => {
    // Base styles
    const baseStyles = 'bg-white rounded-lg shadow-md transition-all duration-200';

    // Variants (background options)
    const variantStyles = {
        default: 'bg-white',
        light: 'bg-gray-50',
        dark: 'bg-gray-800 text-white',
        outline: 'border border-gray-200 bg-white',
    };

    // Padding options
    const paddingStyles = {
        sm: 'p-3',
        md: 'p-6',
        lg: 'p-8',
    };

    // Hover effect (optional)
    const hoverStyles = hoverable ? 'hover:shadow-lg hover:-translate-y-1' : '';

    return (
        <div
            className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${hoverStyles} ${className}`}
        >
            {children}
        </div>
    );
};

export default Card;

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'active' | 'closed' | 'code';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'code', className = '' }) => {
  const variants = {
    active: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800',
    code: 'bg-gray-100 text-gray-800',
  };
  
  return (
    <span className={`px-2 sm:px-3 py-0.5 sm:py-1 inline-flex text-xs leading-5 font-medium rounded-full ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge; 
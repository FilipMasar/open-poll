import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'active' | 'closed' | 'code';
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'code' }) => {
  const variants = {
    active: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800',
    code: 'bg-gray-100 text-gray-800',
  };
  
  return (
    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${variants[variant]}`}>
      {children}
    </span>
  );
};

export default Badge; 
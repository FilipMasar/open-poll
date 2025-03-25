import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '',
  padding = false
}) => {
  const paddingClass = padding ? 'p-4 sm:p-6 md:p-8' : '';
  
  return (
    <div className={`bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden border border-gray-50 ${paddingClass} ${className}`}>
      {children}
    </div>
  );
};

export default Card; 
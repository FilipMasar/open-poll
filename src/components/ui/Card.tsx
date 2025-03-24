import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-50 ${className}`}>
      {children}
    </div>
  );
};

export default Card; 
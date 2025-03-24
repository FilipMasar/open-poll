import React, { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';
}

const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  maxWidth = '7xl' 
}) => {
  return (
    <div className={`max-w-${maxWidth} mx-auto p-6`}>
      {children}
    </div>
  );
};

export default PageContainer; 
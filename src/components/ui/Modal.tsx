import React, { ReactNode, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  variant?: 'default' | 'secondary';
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  variant = 'default'
}) => {
  useEffect(() => {
    // Prevent scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-3 sm:p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl bg-white rounded-2xl shadow-lg overflow-hidden" 
        onClick={e => e.stopPropagation()}
      >
        <div className={variant === 'default' ? 'gradient-bg' : 'gradient-bg-secondary'}>
          <div className="p-4 sm:p-6 md:p-8 text-center">
            <i className={`bx bx-${variant === 'default' ? 'plus-circle' : 'poll'} text-white text-3xl sm:text-4xl md:text-5xl mb-2`}></i>
            <h2 className="text-white text-xl sm:text-2xl font-bold">{title}</h2>
            <p className="text-white opacity-90 mt-1 text-sm sm:text-base">
              {variant === 'default' ? 'Ask an open-ended question' : 'Where opinions matter'}
            </p>
          </div>
        </div>
        
        <div className="p-4 sm:p-6 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal; 
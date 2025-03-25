import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  fullWidth?: boolean;
  iconOnly?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon,
  fullWidth = false,
  iconOnly = false,
  className = '',
  ...props 
}) => {
  // Base classes
  const baseClasses = 'font-medium transition duration-200 flex items-center justify-center';
  
  // Size classes
  const sizeClasses = {
    sm: iconOnly ? 'p-2 text-sm' : 'px-3 py-2 text-sm',
    md: iconOnly ? 'p-2.5 text-base' : 'px-4 py-2.5 text-base',
    lg: iconOnly ? 'p-3 text-lg' : 'px-5 py-3 text-lg',
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'gradient-bg text-white shadow-sm hover:shadow-md',
    secondary: 'bg-gray-100 text-black hover:bg-gray-200',
    outline: 'bg-white text-black border border-gray-200 hover:bg-gray-50',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100',
    success: 'bg-green-50 text-green-600 hover:bg-green-100',
  };
  
  // Border radius
  const borderRadius = iconOnly ? 'rounded-full' : 'rounded-xl';
  
  // Width
  const widthClass = fullWidth ? 'w-full' : '';
  
  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${borderRadius} ${widthClass} ${className}`;
  
  // Make sure touch targets are at least 44px x 44px on mobile
  const touchTargetClass = iconOnly ? 'min-w-[44px] min-h-[44px]' : '';
  
  return (
    <button className={`${classes} ${touchTargetClass}`} {...props}>
      {icon && <span className={`${children && !iconOnly ? 'mr-1.5' : ''}`}>{icon}</span>}
      {(!iconOnly || !icon) && children}
    </button>
  );
};

export default Button; 
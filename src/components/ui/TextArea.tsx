import React, { TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const TextArea: React.FC<TextAreaProps> = ({ 
  label, 
  error, 
  id, 
  className = '', 
  ...props 
}) => {
  return (
    <div className="mb-4 sm:mb-6">
      {label && (
        <label htmlFor={id} className="block text-black text-sm font-medium mb-1.5 sm:mb-2">
          {label}
        </label>
      )}
      <textarea 
        id={id}
        className={`w-full py-2.5 sm:py-3 px-3 sm:px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent text-black ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default TextArea; 
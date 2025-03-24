import React from 'react';
import Link from 'next/link';

interface AdminHeaderProps {
  onLogout?: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout }) => {
  return (
    <div className="border-b border-gray-100">
      <div className="flex justify-between items-center px-8 py-4">
        <div className="flex items-center">
          <i className='bx bx-poll text-primary-500 text-3xl mr-2'></i>
          <h2 className="text-black text-xl font-bold">OpenPoll Admin</h2>
        </div>
        
        <button 
          onClick={onLogout}
          className="p-2 rounded-full text-black hover:bg-gray-100"
        >
          <i className='bx bx-log-out text-xl'></i>
        </button>
      </div>
    </div>
  );
};

export default AdminHeader; 
import React from 'react';

interface AdminHeaderProps {
  onLogout?: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout }) => {
  return (
    <div className="border-b border-gray-100">
      <div className="flex justify-between items-center px-4 sm:px-6 md:px-8 py-3 sm:py-4">
        <div className="flex items-center">
          <i className='bx bx-poll text-primary-500 text-2xl sm:text-3xl mr-2'></i>
          <h2 className="text-black text-lg sm:text-xl font-bold">OpenPoll Admin</h2>
        </div>
        
        <button 
          onClick={onLogout}
          className="p-2 rounded-full text-black hover:bg-gray-100 min-w-[44px] min-h-[44px]"
        >
          <i className='bx bx-log-out text-xl'></i>
        </button>
      </div>
    </div>
  );
};

export default AdminHeader; 
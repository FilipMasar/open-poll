import React from 'react';
import Link from 'next/link';

export interface TabItem {
  name: string;
  href?: string;
  isActive?: boolean;
  onClick?: () => void;
}

interface TabNavigationProps {
  tabs: TabItem[];
}

const TabNavigation: React.FC<TabNavigationProps> = ({ tabs }) => {
  return (
    <div className="border-b border-gray-100">
      <div className="px-8">
        <div className="flex">
          {tabs.map((tab, index) => {
            const className = `px-5 py-4 font-medium ${
              tab.isActive 
                ? 'text-primary-500 border-b-2 border-primary-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`;
            
            return tab.href ? (
              <Link 
                key={index} 
                href={tab.href} 
                className={className}
              >
                {tab.name}
              </Link>
            ) : (
              <button 
                key={index} 
                onClick={tab.onClick} 
                className={className}
              >
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TabNavigation; 
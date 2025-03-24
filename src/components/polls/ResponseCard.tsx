import React from 'react';

interface ResponseCardProps {
  text: string;
  createdAt: Date;
}

const ResponseCard: React.FC<ResponseCardProps> = ({ text, createdAt }) => {
  // Format the timestamp
  const formatDate = (date: Date) => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Check if date is today
    if (date.toDateString() === now.toDateString()) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    }
    
    // Check if date is yesterday
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    }
    
    // Otherwise show full date
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="border border-gray-200 rounded-xl p-5">
      <p className="text-black text-sm mb-3 text-right">{formatDate(new Date(createdAt))}</p>
      <p className="text-black">{text}</p>
    </div>
  );
};

export default ResponseCard; 
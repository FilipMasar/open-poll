import React from 'react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

interface PollHeaderProps {
  question: string;
  code: string;
  status: 'ACTIVE' | 'CLOSED';
  createdAt: Date;
  closedAt?: Date;
  responsesCount: number;
  onEdit?: () => void;
  onShare?: () => void;
  onClose?: () => void;
  onReopen?: () => void;
  onExport?: () => void;
  isAdmin?: boolean;
}

const PollHeader: React.FC<PollHeaderProps> = ({
  question,
  code,
  status,
  createdAt,
  closedAt,
  responsesCount,
  onEdit,
  onShare,
  onClose,
  onReopen,
  onExport,
  isAdmin = false,
}) => {
  const formattedCreatedAt = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedClosedAt = closedAt 
    ? new Date(closedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="p-8 border-b border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center mb-2">
            <Badge variant={status === 'ACTIVE' ? 'active' : 'closed'} className="mr-2">
              {status === 'ACTIVE' ? 'Active' : 'Closed'}
            </Badge>
            <Badge variant="code">Code: {code}</Badge>
          </div>
          <h1 className="text-black text-2xl font-bold mb-1">{question}</h1>
          <p className="text-black text-sm">
            Created on {formattedCreatedAt}
            {formattedClosedAt && ` • Closed on ${formattedClosedAt}`}
            {` • ${responsesCount} response${responsesCount !== 1 ? 's' : ''}`}
          </p>
        </div>
        
        {isAdmin && (
          <div className="flex space-x-2">
            {status === 'ACTIVE' ? (
              <>
                {onEdit && (
                  <Button 
                    variant="secondary" 
                    icon={<i className='bx bx-edit'></i>}
                    onClick={onEdit}
                  >
                    Edit
                  </Button>
                )}
                
                {onShare && (
                  <Button 
                    variant="secondary" 
                    icon={<i className='bx bx-share-alt'></i>}
                    onClick={onShare}
                  >
                    Share
                  </Button>
                )}
                
                {onClose && (
                  <Button 
                    variant="danger" 
                    icon={<i className='bx bx-x-circle'></i>}
                    onClick={onClose}
                  >
                    Close
                  </Button>
                )}
              </>
            ) : (
              <>
                {onExport && (
                  <Button 
                    variant="secondary" 
                    icon={<i className='bx bx-download'></i>}
                    onClick={onExport}
                  >
                    Export
                  </Button>
                )}
                
                {onReopen && (
                  <Button 
                    variant="success" 
                    icon={<i className='bx bx-refresh'></i>}
                    onClick={onReopen}
                  >
                    Reopen
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PollHeader; 
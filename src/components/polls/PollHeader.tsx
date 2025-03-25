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
    <div className="p-4 sm:p-6 md:p-8 border-b border-gray-100">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 md:gap-6">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant={status === 'ACTIVE' ? 'active' : 'closed'}>
              {status === 'ACTIVE' ? 'Active' : 'Closed'}
            </Badge>
            <Badge variant="code">Code: {code}</Badge>
          </div>
          <h1 className="text-black text-xl sm:text-2xl font-bold mb-1">{question}</h1>
          <p className="text-black text-xs sm:text-sm">
            Created on {formattedCreatedAt}
            {formattedClosedAt && ` • Closed on ${formattedClosedAt}`}
            {` • ${responsesCount} response${responsesCount !== 1 ? 's' : ''}`}
          </p>
        </div>
        
        {isAdmin && (
          <div className="flex flex-wrap gap-2">
            {status === 'ACTIVE' ? (
              <>
                {onEdit && (
                  <Button 
                    variant="secondary" 
                    icon={<i className='bx bx-edit'></i>}
                    onClick={onEdit}
                    className="text-sm sm:text-base"
                  >
                    <span className="hidden sm:inline">Edit</span>
                  </Button>
                )}
                
                {onShare && (
                  <Button 
                    variant="secondary" 
                    icon={<i className='bx bx-share-alt'></i>}
                    onClick={onShare}
                    className="text-sm sm:text-base"
                  >
                    <span className="hidden sm:inline">Share</span>
                  </Button>
                )}
                
                {onClose && (
                  <Button 
                    variant="danger" 
                    icon={<i className='bx bx-x-circle'></i>}
                    onClick={onClose}
                    className="text-sm sm:text-base"
                  >
                    <span className="hidden sm:inline">Close</span>
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
                    className="text-sm sm:text-base"
                  >
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                )}
                
                {onReopen && (
                  <Button 
                    variant="success" 
                    icon={<i className='bx bx-refresh'></i>}
                    onClick={onReopen}
                    className="text-sm sm:text-base"
                  >
                    <span className="hidden sm:inline">Reopen</span>
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
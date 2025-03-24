import React, { useState } from 'react';
import Button from '../ui/Button';
import TextArea from '../ui/TextArea';

interface PollFormProps {
  onSubmit: (question: string) => void;
  onCancel?: () => void;
  initialValue?: string;
  isLoading?: boolean;
}

const PollForm: React.FC<PollFormProps> = ({
  onSubmit,
  onCancel,
  initialValue = '',
  isLoading = false,
}) => {
  const [question, setQuestion] = useState(initialValue);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }
    
    // Submit
    onSubmit(question);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextArea
        id="pollQuestion"
        label="Question"
        value={question}
        onChange={(e) => {
          setQuestion(e.target.value);
          setError('');
        }}
        placeholder="Enter your open-ended question..."
        rows={4}
        error={error}
        disabled={isLoading}
      />
      
      <div className="flex space-x-4">
        <Button 
          type="submit" 
          fullWidth 
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create Poll'}
        </Button>
        
        {onCancel && (
          <Button 
            type="button"
            variant="secondary" 
            fullWidth
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default PollForm; 
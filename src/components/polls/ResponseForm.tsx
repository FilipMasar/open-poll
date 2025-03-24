import React, { useState } from 'react';
import Button from '../ui/Button';
import TextArea from '../ui/TextArea';

interface ResponseFormProps {
  onSubmit: (text: string) => void;
  isLoading?: boolean;
}

const ResponseForm: React.FC<ResponseFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!text.trim()) {
      setError('Please enter your response');
      return;
    }
    
    // Submit
    onSubmit(text);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextArea
        id="response"
        label="Your Response"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setError('');
        }}
        placeholder="Share your thoughts here..."
        rows={6}
        error={error}
        disabled={isLoading}
      />
      
      <Button 
        type="submit" 
        fullWidth 
        disabled={isLoading}
      >
        {isLoading ? 'Submitting...' : 'Submit Response'}
      </Button>
    </form>
  );
};

export default ResponseForm; 
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Poll as PollType, PollStatus, Response } from '@prisma/client';
import Layout from '../../components/layout/Layout';
import PageContainer from '../../components/layout/PageContainer';
import Card from '../../components/ui/Card';
import ResponseForm from '../../components/polls/ResponseForm';
import SummaryCard from '../../components/polls/SummaryCard';
import Button from '../../components/ui/Button';

type PollWithCounts = PollType & {
  _count: { responses: number };
};

type WordFrequency = {
  text: string;
  value: number;
};

export default function PollPage() {
  const router = useRouter();
  const { code } = router.query;
  
  const [poll, setPoll] = useState<PollWithCounts | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  useEffect(() => {
    if (code) {
      fetchPoll();
    }
  }, [code]);
  
  const fetchPoll = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/polls/${code}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Poll not found. Please check the code and try again.');
        } else {
          setError('Failed to load poll. Please try again.');
        }
        return;
      }
      
      const data = await response.json();
      setPoll(data);
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmitResponse = async (text: string) => {
    if (!poll) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/polls/${code}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit response');
      }
      
      setIsSubmitted(true);
    } catch (err) {
      setError('Failed to submit your response. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Parse word frequencies from poll data
  const wordFrequencies: WordFrequency[] = poll?.wordCloud 
    ? Object.entries(poll.wordCloud as Record<string, number>).map(([text, value]) => ({ text, value }))
    : [];

  if (isLoading) {
    return (
      <Layout title="Loading Poll - OpenPoll">
        <PageContainer maxWidth="2xl">
          <div className="py-12 text-center">
            <p className="text-black">Loading poll...</p>
          </div>
        </PageContainer>
      </Layout>
    );
  }
  
  if (error || !poll) {
    return (
      <Layout title="Poll Error - OpenPoll">
        <PageContainer maxWidth="2xl">
          <div className="py-12">
            <Card>
              <div className="p-8 text-center">
                <i className='bx bx-error-circle text-red-500 text-5xl mb-4'></i>
                <h2 className="text-black text-2xl font-bold mb-4">Poll Not Found</h2>
                <p className="text-black mb-6">{error || 'This poll does not exist or has been removed.'}</p>
                <Button onClick={() => router.push('/')}>
                  Back to Home
                </Button>
              </div>
            </Card>
          </div>
        </PageContainer>
      </Layout>
    );
  }
  
  if (poll.status === PollStatus.CLOSED) {
    return (
      <Layout title={`${poll.question} - OpenPoll`}>
        <PageContainer maxWidth="2xl">
          <div className="py-12">
            <Card>
              <div className="gradient-bg p-8 text-center">
                <i className='bx bx-poll text-white text-5xl mb-2'></i>
                <h2 className="text-white text-2xl font-bold">Poll Results</h2>
                <p className="text-white opacity-90 mt-1">Poll code: {poll.code} (Closed)</p>
              </div>
              
              <div className="p-4 sm:p-6 md:p-8">
                <div className="text-center mb-8">
                  <h3 className="text-black text-xl font-bold mb-2">{poll.question}</h3>
                  <p className="text-gray-500">
                    Poll closed on {new Date(poll.closedAt as Date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })} • {poll._count.responses} responses collected
                  </p>
                  <div className="mt-4 inline-flex items-center text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                    <i className='bx bx-check-circle mr-2'></i> Thank you for your participation!
                  </div>
                </div>
                
                {poll.wordCloud && poll.aiSummary ? (
                  <SummaryCard 
                    wordFrequencies={wordFrequencies}
                    aiSummary={poll.aiSummary}
                  />
                ) : (
                  <div className="bg-white rounded-xl p-6 border border-gray-200 text-center py-8">
                    <p className="text-black">Results are being processed...</p>
                  </div>
                )}
                
                <div className="mt-8 text-center">
                  <Button 
                    variant="outline" 
                    onClick={() => router.push('/')}
                  >
                    Back to Home
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </PageContainer>
      </Layout>
    );
  }
  
  return (
    <Layout title={`${poll.question} - OpenPoll`}>
      <PageContainer maxWidth="2xl">
        <div className="py-12">
          <Card>
            <div className="gradient-bg p-8 text-center">
              <i className='bx bx-message-square-detail text-white text-5xl mb-2'></i>
              <h2 className="text-white text-2xl font-bold">Take Poll</h2>
              <p className="text-white opacity-90 mt-1">Poll code: {poll.code}</p>
            </div>
            
            <div className="p-8">
              <h3 className="text-black text-xl font-bold mb-6">{poll.question}</h3>
              
              {isSubmitted ? (
                <div className="text-center py-8">
                  <i className='bx bx-check-circle text-green-500 text-5xl mb-4'></i>
                  <h4 className="text-black text-xl font-bold mb-2">Thank You!</h4>
                  <p className="text-black mb-6">Your response has been submitted successfully.</p>
                  <Button 
                    variant="outline" 
                    onClick={() => router.push('/')}
                  >
                    Back to Home
                  </Button>
                </div>
              ) : (
                <ResponseForm 
                  onSubmit={handleSubmitResponse}
                  isLoading={isSubmitting}
                />
              )}
              
              {!isSubmitted && (
                <div className="mt-8 text-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push('/')}
                  >
                    Back to home
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </PageContainer>
    </Layout>
  );
} 
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Poll as PollType, PollStatus, Response } from '@prisma/client';
import Layout from '../../../components/layout/Layout';
import PageContainer from '../../../components/layout/PageContainer';
import AdminHeader from '../../../components/layout/AdminHeader';
import TabNavigation, { TabItem } from '../../../components/ui/TabNavigation';
import ResponseCard from '../../../components/polls/ResponseCard';
import PollHeader from '../../../components/polls/PollHeader';
import SummaryCard from '../../../components/polls/SummaryCard';
import Button from '../../../components/ui/Button';

type PollWithResponses = PollType & {
  responses: Response[];
  _count: { responses: number };
};

type WordFrequency = {
  text: string;
  value: number;
};

export default function AdminPollDetail() {
  const router = useRouter();
  const { id } = router.query;
  
  const [poll, setPoll] = useState<PollWithResponses | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'responses' | 'summary'>('responses');
  const [isClosingPoll, setIsClosingPoll] = useState(false);
  const [isReopeningPoll, setIsReopeningPoll] = useState(false);
  
  const fetchPoll = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/polls/${id}`);
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/');
          return;
        }
        throw new Error('Failed to fetch poll');
      }
      
      const data = await response.json();
      setPoll(data);
      
      // If poll is closed and summary tab is available, show it by default
      if (data.status === PollStatus.CLOSED && data.wordCloud) {
        setActiveTab('summary');
      }
    } catch (err) {
      setError('Failed to load poll. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [id, router]);
  
  useEffect(() => {
    if (id) {
      fetchPoll();
    }
  }, [id, fetchPoll]);
  
  const handleClosePoll = async () => {
    if (!poll) return;
    
    setIsClosingPoll(true);
    try {
      const response = await fetch(`/api/admin/polls/${id}/close`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Failed to close poll');
      }
      
      await fetchPoll();
    } catch (err) {
      setError('Failed to close poll. Please try again.');
      console.error(err);
    } finally {
      setIsClosingPoll(false);
    }
  };
  
  const handleReopenPoll = async () => {
    if (!poll) return;
    
    setIsReopeningPoll(true);
    try {
      const response = await fetch(`/api/admin/polls/${id}/reopen`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Failed to reopen poll');
      }
      
      await fetchPoll();
    } catch (err) {
      setError('Failed to reopen poll. Please try again.');
      console.error(err);
    } finally {
      setIsReopeningPoll(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST'
      });
      router.push('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };
  
  // Parse word frequencies from poll data
  const wordFrequencies: WordFrequency[] = poll?.wordCloud 
    ? Object.entries(poll.wordCloud as Record<string, number>).map(([text, value]) => ({ text, value }))
    : [];
  
  // Define tabs
  const tabs: TabItem[] = [
    { 
      name: 'Responses', 
      isActive: activeTab === 'responses',
      onClick: () => setActiveTab('responses')
    }
  ];
  
  // Add summary tab if poll is closed
  if (poll?.status === PollStatus.CLOSED) {
    tabs.push({
      name: 'Summary',
      isActive: activeTab === 'summary',
      onClick: () => setActiveTab('summary')
    });
  }

  if (isLoading) {
    return (
      <Layout title="Poll Details - OpenPoll">
        <AdminHeader onLogout={handleLogout} />
        <PageContainer>
          <div className="text-center py-12">
            <p className="text-black">Loading poll details...</p>
          </div>
        </PageContainer>
      </Layout>
    );
  }
  
  if (error || !poll) {
    return (
      <Layout title="Poll Details - OpenPoll">
        <AdminHeader onLogout={handleLogout} />
        <PageContainer>
          <div className="text-center py-12">
            <p className="text-red-500">{error || 'Poll not found'}</p>
            <Button 
              variant="secondary" 
              className="mt-4" 
              onClick={() => router.push('/admin/polls')}
            >
              Back to Polls
            </Button>
          </div>
        </PageContainer>
      </Layout>
    );
  }

  return (
    <Layout title={`${poll.question} - OpenPoll Admin`}>
      <AdminHeader onLogout={handleLogout} />
      
      <PageContainer>
        <div className="py-4 mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            icon={<i className='bx bx-arrow-back'></i>}
            onClick={() => router.push('/admin/polls')}
          >
            Back to Polls
          </Button>
        </div>
        
        <PollHeader
          question={poll.question}
          code={poll.code}
          status={poll.status}
          createdAt={new Date(poll.createdAt)}
          closedAt={poll.closedAt ? new Date(poll.closedAt) : undefined}
          responsesCount={poll._count.responses}
          onClose={poll.status === PollStatus.ACTIVE ? handleClosePoll : undefined}
          onReopen={poll.status === PollStatus.CLOSED ? handleReopenPoll : undefined}
          onExport={poll.status === PollStatus.CLOSED ? () => {} : undefined}
          isAdmin={true}
          isClosingPoll={isClosingPoll}
          isReopeningPoll={isReopeningPoll}
        />
        
        <TabNavigation tabs={tabs} />
        
        <div className="p-4 sm:p-6 md:p-8">
          {activeTab === 'responses' ? (
            <div className="space-y-4">
              {poll.responses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-black">No responses yet.</p>
                </div>
              ) : (
                poll.responses.map((response) => (
                  <ResponseCard
                    key={response.id}
                    text={response.text}
                    createdAt={new Date(response.createdAt)}
                  />
                ))
              )}
            </div>
          ) : (
            <div className="bg-gray-50">
              {poll.wordCloud ? (
                <SummaryCard 
                  wordFrequencies={wordFrequencies}
                  responses={poll.responses}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-black">Results are being generated...</p>
                </div>
              )}
            </div>
          )}
        </div>
      </PageContainer>
    </Layout>
  );
} 
import { useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/layout/Layout';
import PageContainer from '../../../components/layout/PageContainer';
import AdminHeader from '../../../components/layout/AdminHeader';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Table from '../../../components/ui/Table';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import PollForm from '../../../components/polls/PollForm';
import { Poll, PollStatus } from '@prisma/client';

type PollWithResponseCount = Poll & { _count: { responses: number } };

type TableColumn<T> = {
  header: string;
  accessor: keyof T | ((data: T) => ReactNode);
  className?: string;
};

export default function AdminPolls() {
  const router = useRouter();
  const [polls, setPolls] = useState<PollWithResponseCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreatingPoll, setIsCreatingPoll] = useState(false);

  const fetchPolls = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/polls');
      
      if (!response.ok) {
        if (response.status === 401) {
          // Redirect to login if unauthorized
          router.push('/');
          return;
        }
        throw new Error('Failed to fetch polls');
      }
      
      const data = await response.json();
      setPolls(data);
    } catch (err) {
      setError('Failed to load polls. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    // Fetch polls when component mounts
    fetchPolls();
  }, [fetchPolls]);

  const handleCreatePoll = async (question: string) => {
    setIsCreatingPoll(true);
    try {
      const response = await fetch('/api/admin/polls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create poll');
      }
      
      // Close modal and refresh polls list
      setIsCreateModalOpen(false);
      fetchPolls();
    } catch (err) {
      setError('Failed to create poll. Please try again.');
      console.error(err);
    } finally {
      setIsCreatingPoll(false);
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

  // Table columns definition
  const columns: TableColumn<PollWithResponseCount>[] = [
    {
      header: 'Poll Question',
      accessor: (poll: PollWithResponseCount) => poll.question,
      className: 'text-black font-medium',
    },
    {
      header: 'Code',
      accessor: (poll: PollWithResponseCount) => (
        <span className="px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-gray-100 text-gray-800">
          {poll.code}
        </span>
      ),
      className: 'whitespace-nowrap',
    },
    {
      header: 'Status',
      accessor: (poll: PollWithResponseCount) => (
        <Badge variant={poll.status === PollStatus.ACTIVE ? 'active' : 'closed'}>
          {poll.status === PollStatus.ACTIVE ? 'Active' : 'Closed'}
        </Badge>
      ),
      className: 'whitespace-nowrap',
    },
    {
      header: 'Responses',
      accessor: (poll: PollWithResponseCount) => poll._count.responses,
      className: 'whitespace-nowrap text-black',
    },
    {
      header: 'Actions',
      accessor: (poll: PollWithResponseCount) => (
        <div className="flex space-x-3">
          <button 
            className="p-1.5 rounded-lg hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/admin/polls/${poll.id}`);
            }}
          >
            <i className='bx bx-edit text-black'></i>
          </button>
          <button 
            className="p-1.5 rounded-lg hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/admin/polls/${poll.id}`);
            }}
          >
            <i className='bx bx-bar-chart text-black'></i>
          </button>
          <button 
            className="p-1.5 rounded-lg hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              // Handle delete (implement later)
            }}
          >
            <i className='bx bx-trash text-black'></i>
          </button>
        </div>
      ),
      className: 'whitespace-nowrap',
    },
  ];

  return (
    <Layout title="Admin Dashboard - OpenPoll">
      <AdminHeader onLogout={handleLogout} />
      
      <PageContainer>
        <div className="py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-black text-2xl font-bold">My Polls</h1>
            
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              icon={<i className='bx bx-plus'></i>}
            >
              Create New Poll
            </Button>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-black">Loading polls...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
              <Button 
                variant="secondary" 
                className="mt-4" 
                onClick={fetchPolls}
              >
                Try Again
              </Button>
            </div>
          ) : polls.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-black mb-6">You haven&apos;t created any polls yet.</p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                Create Your First Poll
              </Button>
            </Card>
          ) : (
            <Table 
              columns={columns} 
              data={polls}
              onRowClick={(poll) => router.push(`/admin/polls/${poll.id}`)}
            />
          )}
        </div>
      </PageContainer>
      
      <Modal 
        isOpen={isCreateModalOpen} 
        onClose={() => !isCreatingPoll && setIsCreateModalOpen(false)}
        title="Create New Poll"
      >
        <PollForm 
          onSubmit={handleCreatePoll}
          onCancel={() => !isCreatingPoll && setIsCreateModalOpen(false)}
          isLoading={isCreatingPoll}
        />
      </Modal>
    </Layout>
  );
} 
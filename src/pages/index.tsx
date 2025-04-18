import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'poll' | 'admin'>('poll');
  const [pollCode, setPollCode] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePollAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pollCode.trim()) {
      setError('Please enter a poll code');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Fetch the poll to verify it exists
      const response = await fetch(`/api/polls/${pollCode}`);
      
      if (response.ok) {
        router.push(`/poll/${pollCode}`);
      } else {
        setError('Invalid poll code. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!adminPassword.trim()) {
      setError('Please enter the admin password');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: adminPassword }),
      });
      
      if (response.ok) {
        router.push('/admin/polls');
      } else {
        setError('Invalid password. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <PageContainer maxWidth="md">
        <div className="py-6 sm:py-8 md:py-12">
          <Card>
            <div className={`${activeTab === 'admin' ? 'gradient-bg-secondary' : 'gradient-bg'} p-4 sm:p-6 md:p-8 text-center`}>
              <i className='bx bx-poll text-white text-3xl sm:text-4xl md:text-5xl mb-2'></i>
              <h2 className="text-white text-xl sm:text-2xl font-bold">OpenPoll</h2>
              <p className="text-white opacity-90 mt-1 text-sm sm:text-base">Where opinions matter</p>
            </div>
            
            <div className="p-4 sm:p-6 md:p-8">
              <div className="flex justify-center mb-6 sm:mb-8">
                <div className="flex w-full sm:w-auto">
                  <button 
                    className={`flex-1 sm:flex-initial px-4 sm:px-6 py-2 rounded-l-full ${activeTab === 'poll' ? 'bg-gray-100 text-black' : 'bg-white text-black'} font-medium`}
                    onClick={() => setActiveTab('poll')}
                  >
                    Take Poll
                  </button>
                  <button 
                    className={`flex-1 sm:flex-initial px-4 sm:px-6 py-2 rounded-r-full ${activeTab === 'admin' ? 'bg-gray-100 text-black' : 'bg-white text-black'} font-medium`}
                    onClick={() => setActiveTab('admin')}
                  >
                    Admin
                  </button>
                </div>
              </div>
              
              {activeTab === 'poll' ? (
                <>
                  <form onSubmit={handlePollAccess}>
                    <Input
                      id="pollcode"
                      label="Poll Code"
                      value={pollCode}
                      onChange={(e) => {
                        setPollCode(e.target.value.toUpperCase());
                        setError('');
                      }}
                      placeholder="Enter poll code"
                      icon={<i className='bx bx-hash'></i>}
                      error={error}
                      disabled={isLoading}
                    />
                    
                    <Button 
                      type="submit" 
                      fullWidth 
                      disabled={isLoading}
                    >
                      {isLoading ? 'Accessing...' : 'Access Poll'}
                    </Button>
                  </form>
                  
                  <div className="mt-6 sm:mt-8 text-center">
                    <p className="text-black text-sm">
                      Are you an admin? <button 
                        onClick={() => setActiveTab('admin')} 
                        className="text-secondary-500 font-medium"
                      >
                        Access admin panel
                      </button>
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <form onSubmit={handleAdminLogin}>
                    <Input
                      id="adminpassword"
                      label="Admin Password"
                      type="password"
                      value={adminPassword}
                      onChange={(e) => {
                        setAdminPassword(e.target.value);
                        setError('');
                      }}
                      placeholder="Enter admin password"
                      icon={<i className='bx bx-lock-alt'></i>}
                      error={error}
                      disabled={isLoading}
                    />
                    
                    <Button 
                      type="submit" 
                      className="gradient-bg-secondary text-white"
                      fullWidth 
                      disabled={isLoading}
                    >
                      {isLoading ? 'Accessing...' : 'Access Admin Panel'}
                    </Button>
                  </form>
                  
                  <div className="mt-6 sm:mt-8 text-center">
                    <p className="text-black text-sm">
                      Want to take a poll instead? <button 
                        onClick={() => setActiveTab('poll')} 
                        className="text-primary-500 font-medium"
                      >
                        Enter poll code
                      </button>
                    </p>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      </PageContainer>
    </Layout>
  );
}

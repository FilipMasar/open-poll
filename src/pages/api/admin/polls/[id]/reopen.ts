import { NextApiRequest, NextApiResponse } from 'next';
import { withAdminAuth } from '../../../../../lib/auth';
import { prisma } from '@/lib/prisma';
import { PollStatus } from '@prisma/client';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  const { id } = req.query;
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid poll ID' });
  }
  
  try {
    const poll = await prisma.poll.findUnique({
      where: { id },
    });
    
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }
    
    if (poll.status === PollStatus.ACTIVE) {
      return res.status(400).json({ message: 'Poll is already active' });
    }
    
    // Update the poll to active status
    const updatedPoll = await prisma.poll.update({
      where: { id },
      data: {
        status: PollStatus.ACTIVE,
        closedAt: null,
        // We'll keep the wordCloud and aiSummary for historical reasons
      },
    });
    
    return res.status(200).json(updatedPoll);
  } catch (error) {
    console.error('Error reopening poll:', error);
    return res.status(500).json({ message: 'Failed to reopen poll' });
  }
}

export default withAdminAuth(handler); 
import { NextApiRequest, NextApiResponse } from 'next';
import { withAdminAuth } from '../../../../../lib/auth';
import { prisma } from '@/lib/prisma';
import { PollStatus } from '@prisma/client';
import { generateWordFrequencies, generateAISummary } from '../../../../../lib/utils';

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
    // First, get all responses for this poll
    const poll = await prisma.poll.findUnique({
      where: { id },
      include: {
        responses: true,
      },
    });
    
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }
    
    if (poll.status === PollStatus.CLOSED) {
      return res.status(400).json({ message: 'Poll is already closed' });
    }
    
    // Generate word cloud data from responses
    const responseTexts = poll.responses.map(response => response.text);
    const wordCloudData = generateWordFrequencies(responseTexts);
    
    // Generate AI summary (simplified version for now)
    const aiSummary = generateAISummary(responseTexts);
    
    // Update the poll to closed status and add the word cloud and AI summary
    const updatedPoll = await prisma.poll.update({
      where: { id },
      data: {
        status: PollStatus.CLOSED,
        closedAt: new Date(),
        wordCloud: wordCloudData,
        aiSummary,
      },
    });
    
    return res.status(200).json(updatedPoll);
  } catch (error) {
    console.error('Error closing poll:', error);
    return res.status(500).json({ message: 'Failed to close poll' });
  }
}

export default withAdminAuth(handler); 
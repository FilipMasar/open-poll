import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { PollStatus } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;
  
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ message: 'Invalid poll code' });
  }
  
  // POST: Submit a response to a poll
  if (req.method === 'POST') {
    try {
      // First check if the poll exists and is active
      const poll = await prisma.poll.findUnique({
        where: { code },
      });
      
      if (!poll) {
        return res.status(404).json({ message: 'Poll not found' });
      }
      
      if (poll.status === PollStatus.CLOSED) {
        return res.status(400).json({ message: 'Poll is closed and not accepting responses' });
      }
      
      const { text } = req.body;
      
      if (!text || typeof text !== 'string' || text.trim() === '') {
        return res.status(400).json({ message: 'Response text is required' });
      }
      
      // Create the response
      const response = await prisma.response.create({
        data: {
          text: text.trim(),
          pollId: poll.id,
        },
      });
      
      return res.status(201).json(response);
    } catch (error) {
      console.error('Error submitting response:', error);
      return res.status(500).json({ message: 'Failed to submit response' });
    }
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
} 
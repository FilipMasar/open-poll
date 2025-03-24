import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;
  
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ message: 'Invalid poll code' });
  }
  
  // GET: Get a poll by its code
  if (req.method === 'GET') {
    try {
      const poll = await prisma.poll.findUnique({
        where: { code },
        include: {
          _count: {
            select: { responses: true }
          }
        }
      });
      
      if (!poll) {
        return res.status(404).json({ message: 'Poll not found' });
      }
      
      return res.status(200).json(poll);
    } catch (error) {
      console.error('Error fetching poll:', error);
      return res.status(500).json({ message: 'Failed to fetch poll' });
    }
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
} 
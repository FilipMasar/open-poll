import { NextApiRequest, NextApiResponse } from 'next';
import { withAdminAuth } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';
import { generateUniqueCode } from '../../../../lib/utils';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET: Get all polls
  if (req.method === 'GET') {
    try {
      const polls = await prisma.poll.findMany({
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          _count: {
            select: { responses: true }
          }
        }
      });
      
      return res.status(200).json(polls);
    } catch (error) {
      console.error('Error fetching polls:', error);
      return res.status(500).json({ message: 'Failed to fetch polls' });
    }
  }
  
  // POST: Create a new poll
  if (req.method === 'POST') {
    try {
      const { question } = req.body;
      
      if (!question || typeof question !== 'string' || question.trim() === '') {
        return res.status(400).json({ message: 'Question is required' });
      }
      
      // Generate a unique code for the poll
      const code = await generateUniqueCode();
      
      const poll = await prisma.poll.create({
        data: {
          question: question.trim(),
          code,
        },
      });
      
      return res.status(201).json(poll);
    } catch (error) {
      console.error('Error creating poll:', error);
      return res.status(500).json({ message: 'Failed to create poll' });
    }
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
}

export default withAdminAuth(handler); 
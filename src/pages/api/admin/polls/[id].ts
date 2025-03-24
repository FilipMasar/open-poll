import { NextApiRequest, NextApiResponse } from 'next';
import { withAdminAuth } from '../../../../lib/auth';
import { prisma } from '@/lib/prisma';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid poll ID' });
  }
  
  // GET: Get a specific poll with its responses
  if (req.method === 'GET') {
    try {
      const poll = await prisma.poll.findUnique({
        where: { id },
        include: {
          responses: {
            orderBy: {
              createdAt: 'desc'
            }
          },
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
  
  // PUT: Update a poll
  if (req.method === 'PUT') {
    try {
      const { question } = req.body;
      
      if (!question || typeof question !== 'string' || question.trim() === '') {
        return res.status(400).json({ message: 'Question is required' });
      }
      
      const poll = await prisma.poll.update({
        where: { id },
        data: {
          question: question.trim(),
        },
      });
      
      return res.status(200).json(poll);
    } catch (error) {
      console.error('Error updating poll:', error);
      return res.status(500).json({ message: 'Failed to update poll' });
    }
  }
  
  // DELETE: Delete a poll
  if (req.method === 'DELETE') {
    try {
      await prisma.response.deleteMany({
        where: { pollId: id },
      });
      
      await prisma.poll.delete({
        where: { id },
      });
      
      return res.status(200).json({ message: 'Poll deleted successfully' });
    } catch (error) {
      console.error('Error deleting poll:', error);
      return res.status(500).json({ message: 'Failed to delete poll' });
    }
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
}

export default withAdminAuth(handler); 
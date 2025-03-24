import { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';

// Middleware to verify admin authentication
export function isAdmin(req: NextApiRequest) {
  const cookies = parse(req.headers.cookie || '');
  return cookies.admin_token === 'authenticated';
}

// Wrapper for API handlers that require admin authentication
export function withAdminAuth(handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (!isAdmin(req)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    return handler(req, res);
  };
} 
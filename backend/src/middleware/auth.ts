import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  userId?: string;
  username?: string;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Authorization token required' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key') as {
      userId: string;
      username: string;
    };

    req.userId = decoded.userId;
    req.username = decoded.username;
    next();
    return;
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
};

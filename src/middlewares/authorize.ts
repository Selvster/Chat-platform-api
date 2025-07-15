import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Request interface to include a userId property
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const authorize = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is not defined in environment variables.');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const decoded = jwt.verify(token, jwtSecret) as { id: string }; 

    req.userId = decoded.id;

    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.clearCookie('token');
    res.status(401).json({ message: 'Token is not valid or expired' });
  }
};

export default authorize;

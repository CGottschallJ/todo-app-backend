import { Request, Response, NextFunction } from 'express';
import { supabase } from '../supabase';

// Extend Express Request type to include userId and token
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userToken?: string;
    }
  }
}

export async function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // 1. Get the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    // 2. Extract the token
    const token = authHeader.replace('Bearer ', '');

    // 3. Verify the JWT using Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // 4. Add verified user ID AND TOKEN to request object
    req.userId = user.id;
    req.userToken = token;

    // 5. Continue to the route handler
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Authentication error' });
  }
}

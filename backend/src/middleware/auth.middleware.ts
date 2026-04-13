import { Request, Response, NextFunction } from 'express';
import { verifyFirebaseToken, admin } from '../config/firebase';
import { User } from '../models/User';

export interface AuthRequest extends Request {
  user?: admin.auth.DecodedIdToken & { userId?: string };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const token = authHeader.substring(7);
    const decodedToken = await verifyFirebaseToken(token);

    req.user = decodedToken;

    // Find or create user in database
    let user = await User.findOne({ firebaseUid: decodedToken.uid });

    if (!user) {
      user = await User.create({
        name: decodedToken.name || decodedToken.email?.split('@')[0] || 'Anonymous',
        email: decodedToken.email || '',
        firebaseUid: decodedToken.uid,
      });
    }

    req.user.userId = user._id.toString();
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decodedToken = await verifyFirebaseToken(token);
      req.user = decodedToken;

      const user = await User.findOne({ firebaseUid: decodedToken.uid });
      if (user) {
        req.user.userId = user._id.toString();
      }
    }

    next();
  } catch (error) {
    // Continue without auth
    next();
  }
};

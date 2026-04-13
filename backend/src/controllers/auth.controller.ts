import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { User } from '../models/User';
import { verifyFirebaseToken } from '../config/firebase';
import { AuthRequest } from '../middleware/auth.middleware';

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { firebaseToken } = req.body;
    const decodedToken = await verifyFirebaseToken(firebaseToken);

    // Check if user already exists
    const existingUser = await User.findOne({ firebaseUid: decodedToken.uid });
    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    // Create new user
    const user = await User.create({
      name: decodedToken.name || decodedToken.email?.split('@')[0] || 'Anonymous',
      email: decodedToken.email || '',
      firebaseUid: decodedToken.uid,
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

/**
 * Login user
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { firebaseToken } = req.body;
    const decodedToken = await verifyFirebaseToken(firebaseToken);

    // Find or create user
    let user = await User.findOne({ firebaseUid: decodedToken.uid });

    if (!user) {
      user = await User.create({
        name: decodedToken.name || decodedToken.email?.split('@')[0] || 'Anonymous',
        email: decodedToken.email || '',
        firebaseUid: decodedToken.uid,
      });
    }

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        stats: user.stats,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
};

/**
 * Verify Firebase token
 */
export const verifyToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { token } = req.body;
    const decodedToken = await verifyFirebaseToken(token);

    res.json({
      valid: true,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name,
      },
    });
  } catch (error) {
    res.status(401).json({ valid: false, error: 'Invalid token' });
  }
};

/**
 * Get current user profile
 */
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    const user = await User.findById(userId).select('-firebaseUid');

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

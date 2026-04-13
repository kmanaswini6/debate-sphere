import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, verifyToken, getProfile } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (Firebase token required)
 * @access  Public
 */
router.post(
  '/register',
  [body('firebaseToken').notEmpty().withMessage('Firebase token is required')],
  register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user (Firebase token required)
 * @access  Public
 */
router.post(
  '/login',
  [body('firebaseToken').notEmpty().withMessage('Firebase token is required')],
  login
);

/**
 * @route   POST /api/auth/verify
 * @desc    Verify Firebase token
 * @access  Public
 */
router.post(
  '/verify',
  [body('token').notEmpty().withMessage('Token is required')],
  verifyToken
);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authenticate, getProfile);

export default router;

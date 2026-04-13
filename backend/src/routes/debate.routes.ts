import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  createDebate,
  getDebateHistory,
  getDebateById,
  addArgument,
  getAIResponse,
  updateDebateStatus,
  getNextRound,
} from '../controllers/debate.controller';
import { authenticate } from '../middleware/auth.middleware';
import { aiRateLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

/**
 * @route   POST /api/debate
 * @desc    Create a new debate
 * @access  Private
 */
router.post(
  '/',
  authenticate,
  [
    body('topic').notEmpty().withMessage('Topic is required'),
    body('mode').isIn(['user-vs-ai', 'ai-vs-ai', 'user-vs-user']).withMessage('Invalid mode'),
  ],
  createDebate
);

/**
 * @route   GET /api/debate/history
 * @desc    Get user's debate history
 * @access  Private
 */
router.get('/history', authenticate, getDebateHistory);

/**
 * @route   GET /api/debate/:id
 * @desc    Get a specific debate by ID
 * @access  Private
 */
router.get(
  '/:id',
  authenticate,
  [param('id').isMongoId().withMessage('Invalid debate ID')],
  getDebateById
);

/**
 * @route   POST /api/debate/:id/argument
 * @desc    Add an argument to a debate
 * @access  Private
 */
router.post(
  '/:id/argument',
  authenticate,
  [
    param('id').isMongoId().withMessage('Invalid debate ID'),
    body('content').notEmpty().withMessage('Content is required'),
    body('speaker').isIn(['pro', 'con']).withMessage('Invalid speaker'),
    body('round').isIn(['opening', 'rebuttal', 'crossfire', 'closing']).withMessage('Invalid round'),
  ],
  addArgument
);

/**
 * @route   POST /api/debate/:id/respond
 * @desc    Get AI response for a debate
 * @access  Private
 */
router.post(
  '/:id/respond',
  authenticate,
  aiRateLimiter,
  [
    param('id').isMongoId().withMessage('Invalid debate ID'),
    body('side').isIn(['pro', 'con']).withMessage('Invalid side'),
    body('personality').optional().isIn(['logical', 'emotional', 'diplomatic', 'aggressive']),
  ],
  getAIResponse
);

/**
 * @route   POST /api/debate/:id/status
 * @desc    Update debate status (complete, abandon)
 * @access  Private
 */
router.post(
  '/:id/status',
  authenticate,
  [
    param('id').isMongoId().withMessage('Invalid debate ID'),
    body('status').isIn(['active', 'completed', 'abandoned']).withMessage('Invalid status'),
    body('winner').optional().isIn(['pro', 'con', 'draw']),
  ],
  updateDebateStatus
);

/**
 * @route   POST /api/debate/:id/next-round
 * @desc    Advance to the next round
 * @access  Private
 */
router.post(
  '/:id/next-round',
  authenticate,
  [param('id').isMongoId().withMessage('Invalid debate ID')],
  getNextRound
);

export default router;

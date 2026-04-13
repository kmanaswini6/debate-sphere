import { Router } from 'express';
import { body, param } from 'express-validator';
import { submitVote, getDebateVotes } from '../controllers/vote.controller';
import { authenticate } from '../middleware/auth.middleware';
import { voteRateLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

/**
 * @route   POST /api/vote
 * @desc    Submit a vote for a debate
 * @access  Private
 */
router.post(
  '/',
  authenticate,
  voteRateLimiter,
  [
    body('debateId').isMongoId().withMessage('Invalid debate ID'),
    body('selectedSide').isIn(['pro', 'con']).withMessage('Invalid side selection'),
  ],
  submitVote
);

/**
 * @route   GET /api/vote/:debateId
 * @desc    Get current vote counts for a debate
 * @access  Public
 */
router.get(
  '/:debateId',
  [param('debateId').isMongoId().withMessage('Invalid debate ID')],
  getDebateVotes
);

export default router;

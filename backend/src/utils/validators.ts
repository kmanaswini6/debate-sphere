import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Validation error handler
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

// Common validators
export const validators = {
  mongoId: param('id').isMongoId().withMessage('Invalid ID format'),

  topic: body('topic')
    .trim()
    .notEmpty().withMessage('Topic is required')
    .isLength({ min: 5, max: 200 }).withMessage('Topic must be between 5 and 200 characters'),

  mode: body('mode')
    .isIn(['user-vs-ai', 'ai-vs-ai', 'user-vs-user'])
    .withMessage('Invalid debate mode'),

  content: body('content')
    .trim()
    .notEmpty().withMessage('Content is required')
    .isLength({ min: 10, max: 2000 }).withMessage('Content must be between 10 and 2000 characters'),

  speaker: body('speaker')
    .isIn(['pro', 'con', 'moderator'])
    .withMessage('Invalid speaker'),

  round: body('round')
    .isIn(['opening', 'rebuttal', 'crossfire', 'closing'])
    .withMessage('Invalid round'),

  side: body('side')
    .isIn(['pro', 'con'])
    .withMessage('Invalid side'),

  personality: body('personality')
    .optional()
    .isIn(['logical', 'emotional', 'diplomatic', 'aggressive'])
    .withMessage('Invalid personality'),

  status: body('status')
    .optional()
    .isIn(['active', 'completed', 'abandoned'])
    .withMessage('Invalid status'),

  winner: body('winner')
    .optional()
    .isIn(['pro', 'con', 'draw'])
    .withMessage('Invalid winner'),

  debateId: body('debateId')
    .isMongoId().withMessage('Invalid debate ID'),

  selectedSide: body('selectedSide')
    .isIn(['pro', 'con'])
    .withMessage('Invalid side selection'),

  firebaseToken: body('firebaseToken')
    .notEmpty().withMessage('Firebase token is required'),

  token: body('token')
    .notEmpty().withMessage('Token is required'),
};

import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Vote } from '../models/Vote';
import { Debate } from '../models/Debate';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth.middleware';

/**
 * Submit a vote for a debate
 */
export const submitVote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { debateId, selectedSide } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    // Check if debate exists
    const debate = await Debate.findById(debateId);
    if (!debate) {
      res.status(404).json({ error: 'Debate not found' });
      return;
    }

    // Check if user already voted
    const existingVote = await Vote.findOne({ userId, debateId });
    if (existingVote) {
      // Update existing vote
      existingVote.selectedSide = selectedSide;
      await existingVote.save();

      // Update vote counts
      await updateVoteCounts(debateId);

      res.json({
        message: 'Vote updated successfully',
        vote: existingVote,
      });
      return;
    }

    // Create new vote
    const vote = await Vote.create({
      userId,
      debateId,
      selectedSide,
    });

    // Update user stats
    await User.findByIdAndUpdate(userId, {
      $inc: { 'stats.totalVotes': 1 },
    });

    // Update vote counts
    await updateVoteCounts(debateId);

    res.status(201).json({
      message: 'Vote submitted successfully',
      vote,
    });
  } catch (error) {
    console.error('Submit vote error:', error);
    res.status(500).json({ error: 'Failed to submit vote' });
  }
};

/**
 * Get current vote counts for a debate
 */
export const getDebateVotes = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { debateId } = req.params;

    const proVotes = await Vote.countDocuments({ debateId, selectedSide: 'pro' });
    const conVotes = await Vote.countDocuments({ debateId, selectedSide: 'con' });
    const totalVotes = proVotes + conVotes;

    res.json({
      debateId,
      votes: {
        pro: proVotes,
        con: conVotes,
        total: totalVotes,
      },
      percentages: {
        pro: totalVotes > 0 ? Math.round((proVotes / totalVotes) * 100) : 50,
        con: totalVotes > 0 ? Math.round((conVotes / totalVotes) * 100) : 50,
      },
    });
  } catch (error) {
    console.error('Get votes error:', error);
    res.status(500).json({ error: 'Failed to get vote counts' });
  }
};

/**
 * Update vote counts in debate document
 */
const updateVoteCounts = async (debateId: string): Promise<void> => {
  const proVotes = await Vote.countDocuments({ debateId, selectedSide: 'pro' });
  const conVotes = await Vote.countDocuments({ debateId, selectedSide: 'con' });

  await Debate.findByIdAndUpdate(debateId, {
    'votes.pro': proVotes,
    'votes.con': conVotes,
  });
};

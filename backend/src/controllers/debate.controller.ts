import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Debate, IDebate, DebateRound } from '../models/Debate';
import { User } from '../models/User';
import { groqService, AIPersonality } from '../services/groq.service';
import { getRoomStats } from '../services/socket.service';
import { AuthRequest } from '../middleware/auth.middleware';

const ROUND_ORDER: DebateRound[] = ['opening', 'rebuttal', 'crossfire', 'closing'];

/**
 * Create a new debate
 */
export const createDebate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { topic, mode, proSideUserIds, conSideUserIds, aiPersonality } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const participants = [userId];

    // Add other user participants if provided
    if (proSideUserIds && Array.isArray(proSideUserIds)) {
      participants.push(...proSideUserIds.filter((id: string) => id !== userId));
    }
    if (conSideUserIds && Array.isArray(conSideUserIds)) {
      participants.push(...conSideUserIds.filter((id: string) => id !== userId));
    }

    const debate = await Debate.create({
      topic,
      mode,
      participants,
      proSide: proSideUserIds || (mode === 'ai-vs-ai' ? [] : [userId]),
      conSide: conSideUserIds || (mode === 'ai-vs-ai' ? [] : []),
      currentRound: 'opening',
      roundStartTime: new Date(),
      votes: { pro: 0, con: 0 },
    });

    // Update user stats
    await User.findByIdAndUpdate(userId, {
      $inc: { 'stats.debatesJoined': 1 },
    });

    const populatedDebate = await Debate.findById(debate._id)
      .populate('participants', 'name email')
      .populate('proSide', 'name email')
      .populate('conSide', 'name email');

    res.status(201).json({
      message: 'Debate created successfully',
      debate: populatedDebate,
      aiPersonality: aiPersonality || 'logical',
    });
  } catch (error) {
    console.error('Create debate error:', error);
    res.status(500).json({ error: 'Failed to create debate' });
  }
};

/**
 * Get user's debate history
 */
export const getDebateHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { page = 1, limit = 10, status, search } = req.query;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const query: any = { participants: userId };

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$text = { $search: search as string };
    }

    const debates = await Debate.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate('participants', 'name email')
      .populate('winner');

    const total = await Debate.countDocuments(query);

    res.json({
      debates,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Failed to get debate history' });
  }
};

/**
 * Get a specific debate by ID
 */
export const getDebateById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { id } = req.params;
    const debate = await Debate.findById(id)
      .populate('participants', 'name email')
      .populate('proSide', 'name email')
      .populate('conSide', 'name email');

    if (!debate) {
      res.status(404).json({ error: 'Debate not found' });
      return;
    }

    const roomStats = getRoomStats(id);

    res.json({
      debate,
      roomStats,
    });
  } catch (error) {
    console.error('Get debate error:', error);
    res.status(500).json({ error: 'Failed to get debate' });
  }
};

/**
 * Add an argument to a debate
 */
export const addArgument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { id } = req.params;
    const { content, speaker, round } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const debate = await Debate.findById(id);
    if (!debate) {
      res.status(404).json({ error: 'Debate not found' });
      return;
    }

    if (debate.status !== 'active') {
      res.status(400).json({ error: 'Debate is not active' });
      return;
    }

    // Add message
    debate.messages.push({
      speaker,
      content,
      round,
      timestamp: new Date(),
      isAI: false,
    });

    await debate.save();

    const updatedDebate = await Debate.findById(id)
      .populate('participants', 'name email')
      .populate('proSide', 'name email')
      .populate('conSide', 'name email');

    res.json({
      message: 'Argument added successfully',
      debate: updatedDebate,
    });
  } catch (error) {
    console.error('Add argument error:', error);
    res.status(500).json({ error: 'Failed to add argument' });
  }
};

/**
 * Get AI response for a debate
 */
export const getAIResponse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { id } = req.params;
    const { side, personality = 'logical' } = req.body;

    const debate = await Debate.findById(id);
    if (!debate) {
      res.status(404).json({ error: 'Debate not found' });
      return;
    }

    // Build conversation history
    const conversationHistory = debate.messages.map(msg => ({
      role: msg.speaker === 'pro' ? 'assistant' : msg.speaker === 'con' ? 'user' : 'system',
      content: `${msg.speaker.toUpperCase()} (${msg.round}): ${msg.content}`,
    }));

    // Generate AI response
    const response = await groqService.generateResponse({
      topic: debate.topic,
      side,
      round: debate.currentRound,
      personality: personality as AIPersonality,
      conversationHistory,
    });

    // Add AI message to debate
    debate.messages.push({
      speaker: side,
      content: response,
      round: debate.currentRound,
      timestamp: new Date(),
      isAI: true,
    });

    await debate.save();

    const updatedDebate = await Debate.findById(id)
      .populate('participants', 'name email')
      .populate('proSide', 'name email')
      .populate('conSide', 'name email');

    res.json({
      message: 'AI response generated',
      debate: updatedDebate,
      aiResponse: response,
    });
  } catch (error) {
    console.error('AI response error:', error);
    res.status(500).json({ error: 'Failed to generate AI response' });
  }
};

/**
 * Update debate status
 */
export const updateDebateStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { id } = req.params;
    const { status, winner } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const debate = await Debate.findById(id);
    if (!debate) {
      res.status(404).json({ error: 'Debate not found' });
      return;
    }

    debate.status = status;
    if (winner) {
      debate.winner = winner;
    }

    await debate.save();

    // Update user stats if debate is completed
    if (status === 'completed' && winner && winner !== 'draw') {
      const winningSide = winner === 'pro' ? debate.proSide : debate.conSide;
      const losingSide = winner === 'pro' ? debate.conSide : debate.proSide;

      for (const participantId of winningSide) {
        await User.findByIdAndUpdate(participantId, {
          $inc: { 'stats.debatesWon': 1 },
        });
      }

      for (const participantId of losingSide) {
        await User.findByIdAndUpdate(participantId, {
          $inc: { 'stats.debatesLost': 1 },
        });
      }
    }

    res.json({
      message: 'Debate status updated',
      debate: await Debate.findById(id).populate('participants', 'name email'),
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update debate status' });
  }
};

/**
 * Advance to next round
 */
export const getNextRound = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const debate = await Debate.findById(id);
    if (!debate) {
      res.status(404).json({ error: 'Debate not found' });
      return;
    }

    const currentRoundIndex = ROUND_ORDER.indexOf(debate.currentRound);

    if (currentRoundIndex >= ROUND_ORDER.length - 1) {
      res.status(400).json({ error: 'Debate is already in the final round' });
      return;
    }

    const nextRound = ROUND_ORDER[currentRoundIndex + 1];
    debate.currentRound = nextRound;
    debate.roundStartTime = new Date();

    // Add moderator message
    debate.messages.push({
      speaker: 'moderator',
      content: `Moving to the ${nextRound} round.`,
      round: nextRound,
      timestamp: new Date(),
      isAI: false,
    });

    await debate.save();

    res.json({
      message: 'Round advanced',
      currentRound: nextRound,
      debate: await Debate.findById(id).populate('participants', 'name email'),
    });
  } catch (error) {
    console.error('Next round error:', error);
    res.status(500).json({ error: 'Failed to advance round' });
  }
};

import mongoose, { Document, Schema } from 'mongoose';

export type DebateMode = 'user-vs-ai' | 'ai-vs-ai' | 'user-vs-user';
export type DebateRound = 'opening' | 'rebuttal' | 'crossfire' | 'closing';
export type DebateStatus = 'active' | 'completed' | 'abandoned';

export interface IMessage {
  speaker: 'pro' | 'con' | 'moderator';
  content: string;
  round: DebateRound;
  timestamp: Date;
  isAI: boolean;
  sentiment?: string;
}

export interface IDebate extends Document {
  topic: string;
  mode: DebateMode;
  participants: mongoose.Types.ObjectId[];
  proSide: mongoose.Types.ObjectId[];
  conSide: mongoose.Types.ObjectId[];
  messages: IMessage[];
  status: DebateStatus;
  winner?: 'pro' | 'con' | 'draw';
  votes: {
    pro: number;
    con: number;
  };
  currentRound: DebateRound;
  roundStartTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
  speaker: { type: String, enum: ['pro', 'con', 'moderator'], required: true },
  content: { type: String, required: true },
  round: { type: String, enum: ['opening', 'rebuttal', 'crossfire', 'closing'], required: true },
  timestamp: { type: Date, default: Date.now },
  isAI: { type: Boolean, default: false },
  sentiment: { type: String },
});

const debateSchema = new Schema<IDebate>({
  topic: { type: String, required: true },
  mode: {
    type: String,
    enum: ['user-vs-ai', 'ai-vs-ai', 'user-vs-user'],
    required: true
  },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  proSide: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  conSide: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  messages: [messageSchema],
  status: {
    type: String,
    enum: ['active', 'completed', 'abandoned'],
    default: 'active'
  },
  winner: { type: String, enum: ['pro', 'con', 'draw'] },
  votes: {
    pro: { type: Number, default: 0 },
    con: { type: Number, default: 0 },
  },
  currentRound: {
    type: String,
    enum: ['opening', 'rebuttal', 'crossfire', 'closing'],
    default: 'opening'
  },
  roundStartTime: { type: Date },
}, {
  timestamps: true,
});

// Indexes for faster queries
debateSchema.index({ participants: 1 });
debateSchema.index({ status: 1, createdAt: -1 });
debateSchema.index({ topic: 'text' });

export const Debate = mongoose.model<IDebate>('Debate', debateSchema);

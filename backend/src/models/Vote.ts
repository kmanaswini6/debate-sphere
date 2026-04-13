import mongoose, { Document, Schema } from 'mongoose';

export interface IVote extends Document {
  userId: mongoose.Types.ObjectId;
  debateId: mongoose.Types.ObjectId;
  selectedSide: 'pro' | 'con';
  timestamp: Date;
}

const voteSchema = new Schema<IVote>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  debateId: { type: Schema.Types.ObjectId, ref: 'Debate', required: true },
  selectedSide: { type: String, enum: ['pro', 'con'], required: true },
  timestamp: { type: Date, default: Date.now },
});

// Ensure one vote per user per debate
voteSchema.index({ userId: 1, debateId: 1 }, { unique: true });
voteSchema.index({ debateId: 1 });

export const Vote = mongoose.model<IVote>('Vote', voteSchema);

import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  firebaseUid: string;
  createdAt: Date;
  stats: {
    debatesJoined: number;
    debatesWon: number;
    debatesLost: number;
    totalVotes: number;
  };
  achievements: string[];
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  firebaseUid: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  stats: {
    debatesJoined: { type: Number, default: 0 },
    debatesWon: { type: Number, default: 0 },
    debatesLost: { type: Number, default: 0 },
    totalVotes: { type: Number, default: 0 },
  },
  achievements: [{ type: String }],
});

// Index for faster lookups
userSchema.index({ firebaseUid: 1 });
userSchema.index({ email: 1 });

export const User = mongoose.model<IUser>('User', userSchema);

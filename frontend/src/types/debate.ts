export type DebateMode = 'user-vs-ai' | 'ai-vs-ai' | 'user-vs-user';
export type DebateRound = 'opening' | 'rebuttal' | 'crossfire' | 'closing';
export type DebateStatus = 'active' | 'completed' | 'abandoned';

export interface IMessage {
  _id?: string;
  speaker: 'pro' | 'con' | 'moderator';
  content: string;
  round: DebateRound;
  timestamp: string | Date;
  isAI: boolean;
  sentiment?: string;
}

export interface IParticipant {
  _id: string;
  name: string;
  email: string;
}

export interface IDebate {
  _id: string;
  topic: string;
  mode: DebateMode;
  participants: IParticipant[] | string[];
  proSide: IParticipant[] | string[];
  conSide: IParticipant[] | string[];
  messages: IMessage[];
  status: DebateStatus;
  winner?: 'pro' | 'con' | 'draw';
  votes: {
    pro: number;
    con: number;
  };
  currentRound: DebateRound;
  roundStartTime?: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}

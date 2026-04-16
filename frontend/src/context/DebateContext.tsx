'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { api } from '@/lib/api';
import { Round } from '@/lib/utils';
import { IDebate, IMessage, DebateRound } from '@/types/debate';

interface DebateContextType {
  currentDebate: IDebate | null;
  isConnected: boolean;
  participantCount: number;
  spectatorCount: number;
  joinDebate: (debateId: string) => Promise<void>;
  leaveDebate: () => void;
  sendMessage: (content: string, speaker: 'pro' | 'con') => Promise<void>;
  requestAIResponse: (side: 'pro' | 'con', personality?: string) => Promise<void>;
  advanceRound: () => Promise<void>;
  submitVote: (side: 'pro' | 'con') => Promise<void>;
  votes: { pro: number; con: number };
  refreshDebate: () => Promise<void>;
}

const DebateContext = createContext<DebateContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function DebateProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentDebate, setCurrentDebate] = useState<IDebate | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [spectatorCount, setSpectatorCount] = useState(0);
  const [votes, setVotes] = useState({ pro: 0, con: 0 });

  const initializeSocket = useCallback(() => {
    const newSocket = io(API_URL, {
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('debate:state', (data) => {
      setCurrentDebate(data.debate);
      setParticipantCount(data.participantCount);
      setSpectatorCount(data.spectatorCount);
      setVotes(data.debate.votes);
    });

    newSocket.on('debate:new_argument', (message) => {
      setCurrentDebate((prev) => {
        if (!prev) return prev;
        return { ...prev, messages: [...prev.messages, message] };
      });
    });

    newSocket.on('debate:votes_updated', (newVotes) => {
      setVotes(newVotes);
    });

    newSocket.on('debate:round_changed', ({ round }) => {
      setCurrentDebate((prev) => {
        if (!prev) return prev;
        return { ...prev, currentRound: round as DebateRound };
      });
    });

    newSocket.on('debate:error', ({ message }) => {
      console.error('Debate error:', message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    const cleanup = initializeSocket();
    return cleanup;
  }, [initializeSocket]);

  const joinDebate = async (debateId: string) => {
    if (!socket || !user) return;

    socket.emit('debate:join', { debateId, userId: user.uid });
  };

  const leaveDebate = useCallback(() => {
    setCurrentDebate(null);
    setParticipantCount(0);
    setSpectatorCount(0);
    setVotes({ pro: 0, con: 0 });
  }, []);

  const sendMessage = async (content: string, speaker: 'pro' | 'con') => {
    if (!currentDebate || !socket) return;

    const message = {
      speaker,
      content,
      round: currentDebate.currentRound,
      timestamp: new Date().toISOString(),
      isAI: false,
    };

    await api.post(`/api/debate/${currentDebate._id}/argument`, message);
    socket.emit('debate:argument', { debateId: currentDebate._id, message });
  };

  const requestAIResponse = async (side: 'pro' | 'con', personality?: string) => {
    if (!currentDebate) return;

    const response = await api.post(`/api/debate/${currentDebate._id}/respond`, {
      side,
      personality,
    });

    const newMessage = response.data.debate.messages[response.data.debate.messages.length - 1];

    if (socket) {
      socket.emit('debate:argument', { debateId: currentDebate._id, message: newMessage });
    }

    setCurrentDebate(response.data.debate);
  };

  const advanceRound = async () => {
    if (!currentDebate) return;

    const response = await api.post(`/api/debate/${currentDebate._id}/next-round`);
    setCurrentDebate(response.data.debate);

    if (socket) {
      socket.emit('debate:round_changed', {
        debateId: currentDebate._id,
        round: response.data.currentRound,
      });
    }
  };

  const submitVote = async (side: 'pro' | 'con') => {
    if (!currentDebate) return;

    await api.post('/api/vote', {
      debateId: currentDebate._id,
      selectedSide: side,
    });

    const response = await api.get(`/api/vote/${currentDebate._id}`);
    setVotes(response.data.votes);

    if (socket) {
      socket.emit('debate:vote_update', {
        debateId: currentDebate._id,
        votes: response.data.votes,
      });
    }
  };

  const refreshDebate = async () => {
    if (!currentDebate) return;

    const response = await api.get(`/api/debate/${currentDebate._id}`);
    setCurrentDebate(response.data.debate);
    setVotes(response.data.debate.votes);
  };

  const value: DebateContextType = {
    currentDebate,
    isConnected,
    participantCount,
    spectatorCount,
    joinDebate,
    leaveDebate,
    sendMessage,
    requestAIResponse,
    advanceRound,
    submitVote,
    votes,
    refreshDebate,
  };

  return <DebateContext.Provider value={value}>{children}</DebateContext.Provider>;
}

export function useDebate() {
  const context = useContext(DebateContext);
  if (context === undefined) {
    throw new Error('useDebate must be used within a DebateProvider');
  }
  return context;
}

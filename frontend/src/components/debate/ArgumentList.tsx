'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Message, Round } from '../../../../backend/src/models/Debate';
import { ROUND_LABELS } from '@/lib/utils';

interface ArgumentListProps {
  messages: Message[];
  currentRound: Round;
}

export default function ArgumentList({ messages, currentRound }: ArgumentListProps) {
  if (messages.length === 0) {
    return (
      <div className="glass rounded-2xl p-12 text-center border border-primary/15">
        <div className="text-6xl mb-4">🎙️</div>
        <h3 className="text-xl font-heading font-semibold text-text mb-2">
          The debate begins now
        </h3>
        <p className="text-text-muted">
          Be the first to present an argument in the {ROUND_LABELS[currentRound]} round.
        </p>
      </div>
    );
  }

  const getSpeakerIcon = (speaker: string, isAI?: boolean) => {
    if (speaker === 'moderator') return '⚖️';
    if (isAI) return '🤖';
    if (speaker === 'pro') return '🦁';
    if (speaker === 'con') return '🦅';
    return '👤';
  };

  const getCardClass = (speaker: string) => {
    if (speaker === 'moderator') return 'moderator';
    if (speaker === 'pro') return 'pro';
    if (speaker === 'con') return 'con';
    return '';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-heading font-semibold text-text">
          Arguments ({messages.length})
        </h3>
      </div>

      {messages.map((message, index) => (
        <motion.div
          key={message._id || index}
          initial={{ opacity: 0, x: message.speaker === 'pro' ? -20 : message.speaker === 'con' ? 20 : 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className={`argument-card ${getCardClass(message.speaker)}`}>
            <div className="flex items-start gap-4">
              {/* Speaker Icon */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                  {getSpeakerIcon(message.speaker, message.isAI)}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className={`font-semibold text-sm uppercase tracking-wider ${
                    message.speaker === 'pro' ? 'text-pro' :
                    message.speaker === 'con' ? 'text-con' :
                    message.speaker === 'moderator' ? 'text-primary' :
                    'text-text'
                  }`}>
                    {message.speaker}
                  </span>
                  {message.isAI && (
                    <span className="px-2 py-0.5 bg-primary/20 text-primary rounded text-xs">
                      AI
                    </span>
                  )}
                  <span className="px-2 py-0.5 bg-primary/10 text-text-muted rounded text-xs">
                    {ROUND_LABELS[message.round]}
                  </span>
                  <span className="text-xs text-text-muted">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Argument Text */}
                <p className="text-text leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface VotingPanelProps {
  votes: { pro: number; con: number };
  onVote: (side: 'pro' | 'con') => void;
  disabled?: boolean;
}

export default function VotingPanel({ votes, onVote, disabled = false }: VotingPanelProps) {
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedVote, setSelectedVote] = useState<'pro' | 'con' | null>(null);

  const totalVotes = votes.pro + votes.con;
  const proPercentage = totalVotes > 0 ? Math.round((votes.pro / totalVotes) * 100) : 50;
  const conPercentage = totalVotes > 0 ? Math.round((votes.con / totalVotes) * 100) : 50;

  const handleVote = (side: 'pro' | 'con') => {
    if (disabled || hasVoted) return;

    setSelectedVote(side);
    setHasVoted(true);
    onVote(side);
  };

  return (
    <div className="glass rounded-xl p-5 border border-primary/15">
      <h3 className="text-lg font-heading font-semibold text-text mb-4 flex items-center gap-2">
        <span>🗳️</span>
        Audience Vote
      </h3>

      {/* Vote Bars */}
      <div className="mb-4">
        <div className="vote-bar h-6 rounded-lg overflow-hidden mb-2">
          <motion.div
            initial={{ width: '50%' }}
            animate={{ width: `${proPercentage}%` }}
            transition={{ duration: 0.5 }}
            className="vote-bar-pro h-full flex items-center justify-center"
          >
            {proPercentage > 10 && (
              <span className="text-white text-xs font-bold">{proPercentage}%</span>
            )}
          </motion.div>
          <motion.div
            initial={{ width: '50%' }}
            animate={{ width: `${conPercentage}%` }}
            transition={{ duration: 0.5 }}
            className="vote-bar-con h-full flex items-center justify-center"
          >
            {conPercentage > 10 && (
              <span className="text-text text-xs font-bold">{conPercentage}%</span>
            )}
          </motion.div>
        </div>

        <div className="flex justify-between text-xs text-text-muted">
          <span className="text-pro">PRO ({votes.pro})</span>
          <span className="text-con">CON ({votes.con})</span>
        </div>
      </div>

      {/* Vote Buttons */}
      {!hasVoted ? (
        <div className="space-y-2">
          <p className="text-sm text-text-muted text-center mb-3">
            Cast your vote
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleVote('pro')}
              disabled={disabled}
              className="btn-pro py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-pro/30"
            >
              Vote PRO
            </button>
            <button
              onClick={() => handleVote('con')}
              disabled={disabled}
              className="btn-con py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-con/30"
            >
              Vote CON
            </button>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-3"
        >
          <div className="text-2xl mb-1 text-success">✓</div>
          <p className="text-sm text-text-muted">
            You voted for{' '}
            <span className={selectedVote === 'pro' ? 'text-pro font-semibold' : 'text-con font-semibold'}>
              {selectedVote?.toUpperCase()}
            </span>
          </p>
        </motion.div>
      )}

      {/* Total */}
      <div className="mt-4 pt-4 border-t border-primary/10 text-center">
        <p className="text-xs text-text-muted">
          {totalVotes} total votes
        </p>
      </div>
    </div>
  );
}

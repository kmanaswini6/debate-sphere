'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Round, ROUND_ORDER, ROUND_DURATIONS, formatTime, ROUND_LABELS } from '@/lib/utils';

interface RoundTimerProps {
  currentRound: Round;
  roundStartTime?: string;
  onRoundEnd?: () => void;
}

export default function RoundTimer({ currentRound, roundStartTime, onRoundEnd }: RoundTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(ROUND_DURATIONS[currentRound]);
  const [isWarning, setIsWarning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Reset timer when round changes
    setTimeRemaining(ROUND_DURATIONS[currentRound]);
    setIsWarning(false);

    // Calculate elapsed time if roundStartTime is provided
    if (roundStartTime) {
      const elapsed = Math.floor((Date.now() - new Date(roundStartTime).getTime()) / 1000);
      const remaining = Math.max(0, ROUND_DURATIONS[currentRound] - elapsed);
      setTimeRemaining(remaining);
    }
  }, [currentRound, roundStartTime]);

  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Start new interval
    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Time's up
          clearInterval(intervalRef.current!);
          onRoundEnd?.();
          return 0;
        }

        // Set warning state when under 30 seconds
        if (prev <= 30) {
          setIsWarning(true);
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentRound, roundStartTime, onRoundEnd]);

  const currentRoundIndex = ROUND_ORDER.indexOf(currentRound);

  return (
    <div className="glass rounded-xl p-5 border border-primary/15">
      {/* Round Dots */}
      <div className="round-indicator mb-4">
        {ROUND_ORDER.map((round, index) => (
          <motion.div
            key={round}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className={`round-dot ${
              index === currentRoundIndex ? 'active' :
              index < currentRoundIndex ? 'completed' : ''
            }`}
          />
        ))}
      </div>

      {/* Timer Display */}
      <div className="text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRound}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <div className="text-sm text-text-muted mb-2">
              {ROUND_LABELS[currentRound]}
            </div>
            <div className={`timer ${isWarning ? 'warning' : ''}`}>
              {formatTime(timeRemaining)}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="h-1 bg-primary/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: `${(timeRemaining / ROUND_DURATIONS[currentRound]) * 100}%` }}
            transition={{ duration: 0.1 }}
            className={`h-full ${
              isWarning ? 'bg-error' : 'bg-primary'
            }`}
          />
        </div>
      </div>

      {/* Time Warning Message */}
      <AnimatePresence>
        {isWarning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 text-center"
          >
            <p className="text-xs text-error font-medium">
              ⏰ Time running low! Wrap up your argument.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

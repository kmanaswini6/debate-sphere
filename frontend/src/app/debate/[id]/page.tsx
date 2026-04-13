'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useDebate } from '@/context/DebateContext';
import { debateAPI } from '@/lib/api';
import { ROUND_ORDER, ROUND_LABELS, ROUND_DURATIONS, formatTime } from '@/lib/utils';
import toast from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import DebateStage from '@/components/debate/DebateStage';
import ArgumentList from '@/components/debate/ArgumentList';
import VotingPanel from '@/components/debate/VotingPanel';
import RoundTimer from '@/components/debate/RoundTimer';

export default function DebatePage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { currentDebate, joinDebate, leaveDebate, isConnected, sendMessage, requestAIResponse, advanceRound, submitVote, votes } = useDebate();

  const [loading, setLoading] = useState(true);
  const [argumentText, setArgumentText] = useState('');
  const [submittingArgument, setSubmittingArgument] = useState(false);
  const [requestingAI, setRequestingAI] = useState(false);
  const [selectedSide, setSelectedSide] = useState<'pro' | 'con'>('pro');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (params.id && typeof params.id === 'string') {
      joinDebate(params.id);
    }

    return () => {
      leaveDebate();
    };
  }, [params.id, isAuthenticated, authLoading]);

  useEffect(() => {
    if (currentDebate) {
      setLoading(false);
      scrollToBottom();
    }
  }, [currentDebate]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!argumentText.trim() || !currentDebate) return;

    setSubmittingArgument(true);
    try {
      await sendMessage(argumentText.trim(), selectedSide);
      setArgumentText('');
      toast.success('Argument submitted!');
    } catch (error: any) {
      console.error('Send message error:', error);
      toast.error(error.response?.data?.error || 'Failed to submit argument');
    } finally {
      setSubmittingArgument(false);
    }
  };

  const handleAIResponse = async () => {
    if (!currentDebate) return;

    setRequestingAI(true);
    try {
      await requestAIResponse(selectedSide);
      toast.success('AI response generated!');
    } catch (error: any) {
      console.error('AI response error:', error);
      toast.error(error.response?.data?.error || 'Failed to get AI response');
    } finally {
      setRequestingAI(false);
    }
  };

  const handleAdvanceRound = async () => {
    try {
      await advanceRound();
      toast.success('Round advanced!');
    } catch (error: any) {
      console.error('Advance round error:', error);
      toast.error(error.response?.data?.error || 'Failed to advance round');
    }
  };

  const handleVote = async (side: 'pro' | 'con') => {
    try {
      await submitVote(side);
      toast.success('Vote submitted!');
    } catch (error: any) {
      console.error('Vote error:', error);
      toast.error(error.response?.data?.error || 'Failed to submit vote');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  if (!currentDebate) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-24 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🎤</div>
            <h2 className="text-2xl font-heading font-bold text-white mb-2">
              Loading Debate...
            </h2>
            <p className="text-gray-400">Connecting to the arena</p>
          </div>
        </div>
      </div>
    );
  }

  const currentRoundIndex = ROUND_ORDER.indexOf(currentDebate.currentRound);
  const isDebateActive = currentDebate.status === 'active';
  const isDebateCompleted = currentDebate.status === 'completed';

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-heading font-bold text-white mb-2">
                  {currentDebate.topic}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="capitalize">{currentDebate.mode.replace('-', ' vs ')}</span>
                  <span>•</span>
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-500'}`} />
                    {isConnected ? 'Live' : 'Disconnected'}
                  </span>
                  <span>•</span>
                  <span>{currentDebate.participants.length} participants</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  currentDebate.status === 'active' ? 'bg-pro/20 text-pro' :
                  currentDebate.status === 'completed' ? 'bg-secondary/20 text-secondary' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {currentDebate.status === 'active' ? '🔴 Live' :
                   currentDebate.status === 'completed' ? '✓ Completed' : '⚠ Abandoned'}
                </span>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Main Debate Area */}
            <div className="lg:col-span-3 space-y-6">
              {/* Round Timer & Indicator */}
              {isDebateActive && (
                <RoundTimer
                  currentRound={currentDebate.currentRound}
                  roundStartTime={currentDebate.roundStartTime}
                  onRoundEnd={handleAdvanceRound}
                />
              )}

              {/* Debate Stage */}
              <DebateStage
                debate={currentDebate}
                selectedSide={selectedSide}
                onSideChange={setSelectedSide}
              />

              {/* Arguments */}
              <ArgumentList
                messages={currentDebate.messages}
                currentRound={currentDebate.currentRound}
              />
              <div ref={messagesEndRef} />

              {/* Input Area */}
              {isDebateActive && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-2xl p-6 border border-white/10"
                >
                  <form onSubmit={handleSendMessage} className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-sm text-gray-400">Your side:</span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedSide('pro')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            selectedSide === 'pro'
                              ? 'bg-pro text-white'
                              : 'bg-white/5 text-gray-400 hover:bg-white/10'
                          }`}
                        >
                          Pro
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedSide('con')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            selectedSide === 'con'
                              ? 'bg-con text-white'
                              : 'bg-white/5 text-gray-400 hover:bg-white/10'
                          }`}
                        >
                          Con
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <textarea
                        value={argumentText}
                        onChange={(e) => setArgumentText(e.target.value)}
                        placeholder={`Enter your ${selectedSide} argument...`}
                        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-secondary text-white placeholder-gray-500 resize-none"
                        rows={3}
                        required
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={submittingArgument}
                        className={`btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed ${
                          selectedSide === 'pro' ? 'btn-pro' : 'btn-con'
                        }`}
                      >
                        {submittingArgument ? 'Submitting...' : `Submit ${selectedSide} Argument`}
                      </button>

                      <button
                        type="button"
                        onClick={handleAIResponse}
                        disabled={requestingAI || !isDebateActive}
                        className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {requestingAI ? 'Generating...' : '🤖 Ask AI'}
                      </button>

                      <button
                        type="button"
                        onClick={handleAdvanceRound}
                        disabled={!isDebateActive}
                        className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next Round →
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Completed State */}
              {isDebateCompleted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass rounded-2xl p-8 text-center border border-secondary/30"
                >
                  <div className="text-6xl mb-4">🏆</div>
                  <h2 className="text-3xl font-heading font-bold text-gradient mb-4">
                    Debate Completed!
                  </h2>
                  {currentDebate.winner && (
                    <p className="text-xl text-gray-300 mb-4">
                      Winner: <span className={`font-bold ${
                        currentDebate.winner === 'pro' ? 'text-pro' :
                        currentDebate.winner === 'con' ? 'text-con' : 'text-gray-400'
                      }`}>
                        {currentDebate.winner.toUpperCase()}
                      </span>
                    </p>
                  )}
                  <p className="text-gray-400">
                    Thank you for participating in this debate.
                  </p>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Voting Panel */}
              <VotingPanel
                votes={votes}
                onVote={handleVote}
                disabled={!isDebateActive}
              />

              {/* Round Info */}
              <div className="glass rounded-xl p-5 border border-white/10">
                <h3 className="text-lg font-heading font-semibold text-white mb-4">
                  Current Round
                </h3>
                <div className="text-2xl font-bold text-secondary mb-2">
                  {ROUND_LABELS[currentDebate.currentRound]}
                </div>
                <p className="text-sm text-gray-400">
                  Round {currentRoundIndex + 1} of {ROUND_ORDER.length}
                </p>
              </div>

              {/* Debate Info */}
              <div className="glass rounded-xl p-5 border border-white/10">
                <h3 className="text-lg font-heading font-semibold text-white mb-4">
                  Debate Info
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Mode</span>
                    <span className="text-white capitalize">{currentDebate.mode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Created</span>
                    <span className="text-white">{new Date(currentDebate.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Arguments</span>
                    <span className="text-white">{currentDebate.messages.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Votes</span>
                    <span className="text-white">{votes.pro + votes.con}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

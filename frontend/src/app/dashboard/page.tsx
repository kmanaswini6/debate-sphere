'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { debateAPI } from '@/lib/api';
import { DEBATE_MODES, AI_PERSONALITIES } from '@/lib/utils';
import toast from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, loading, profile } = useAuth();
  const [creatingDebate, setCreatingDebate] = useState(false);
  const [debateForm, setDebateForm] = useState({
    topic: '',
    mode: 'user-vs-ai',
    aiPersonality: 'logical',
  });
  const [recentDebates, setRecentDebates] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchRecentDebates();
    }
  }, [isAuthenticated]);

  const fetchRecentDebates = async () => {
    try {
      const response = await debateAPI.getHistory({ limit: 5 });
      setRecentDebates(response.data.debates);
    } catch (error) {
      console.error('Failed to fetch debates:', error);
    }
  };

  const handleCreateDebate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingDebate(true);

    try {
      const response = await debateAPI.create(debateForm);
      toast.success('Debate created!');
      router.push(`/debate/${response.data.debate._id}`);
    } catch (error: any) {
      console.error('Create debate error:', error);
      toast.error(error.response?.data?.error || 'Failed to create debate');
    } finally {
      setCreatingDebate(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-heading font-bold text-gradient mb-2">
              Welcome, {profile?.name || 'Debater'}
            </h1>
            <p className="text-gray-400">
              Ready to step onto the stage?
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-xl p-6 border border-white/10"
            >
              <div className="text-3xl font-bold text-white mb-1">
                {profile?.stats.debatesJoined || 0}
              </div>
              <div className="text-sm text-gray-400">Debates Joined</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-xl p-6 border border-pro/30"
            >
              <div className="text-3xl font-bold text-pro mb-1">
                {profile?.stats.debatesWon || 0}
              </div>
              <div className="text-sm text-gray-400">Wins</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-xl p-6 border border-con/30"
            >
              <div className="text-3xl font-bold text-con mb-1">
                {profile?.stats.debatesLost || 0}
              </div>
              <div className="text-sm text-gray-400">Losses</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-xl p-6 border border-secondary/30"
            >
              <div className="text-3xl font-bold text-secondary mb-1">
                {profile?.stats.totalVotes || 0}
              </div>
              <div className="text-sm text-gray-400">Votes Cast</div>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Create Debate Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-1"
            >
              <div className="glass rounded-2xl p-6 border border-white/10 sticky top-24">
                <h2 className="text-2xl font-heading font-bold text-white mb-6">
                  Create New Debate
                </h2>

                <form onSubmit={handleCreateDebate} className="space-y-5">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Topic
                    </label>
                    <input
                      type="text"
                      value={debateForm.topic}
                      onChange={(e) => setDebateForm({ ...debateForm, topic: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-primary/20 rounded-lg focus:outline-none focus:border-primary text-text dark:text-white placeholder-gray-500"
                      placeholder="e.g., AI will replace human programmers"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Mode
                    </label>
                    <select
                      value={debateForm.mode}
                      onChange={(e) => setDebateForm({ ...debateForm, mode: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-primary/20 rounded-lg focus:outline-none focus:border-primary text-text dark:text-white"
                    >
                      {DEBATE_MODES.map((mode) => (
                        <option key={mode.id} value={mode.id}>
                          {mode.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {debateForm.mode.includes('ai') && (
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">
                        AI Personality
                      </label>
                      <select
                        value={debateForm.aiPersonality}
                        onChange={(e) => setDebateForm({ ...debateForm, aiPersonality: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-primary/20 rounded-lg focus:outline-none focus:border-primary text-text dark:text-white"
                      >
                        {AI_PERSONALITIES.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} - {p.description}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={creatingDebate}
                    className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creatingDebate ? 'Creating...' : 'Start Debate'}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Recent Debates */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="lg:col-span-2"
            >
              <h2 className="text-2xl font-heading font-bold text-white mb-6">
                Recent Debates
              </h2>

              {recentDebates.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center border border-white/10">
                  <div className="text-6xl mb-4">🎤</div>
                  <h3 className="text-xl font-heading font-semibold text-white mb-2">
                    No debates yet
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Create your first debate and start arguing!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentDebates.map((debate, index) => (
                    <motion.div
                      key={debate._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                    >
                      <Link href={`/debate/${debate._id}`}>
                        <div className="glass rounded-xl p-5 border border-white/10 hover:border-secondary/30 transition-all cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-white mb-1">
                                {debate.topic}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-gray-400">
                                <span className="capitalize">{debate.mode.replace('-', ' vs ')}</span>
                                <span>•</span>
                                <span className="capitalize">{debate.status}</span>
                                <span>•</span>
                                <span>{new Date(debate.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                debate.status === 'active' ? 'bg-pro/20 text-pro' :
                                debate.status === 'completed' ? 'bg-secondary/20 text-secondary' :
                                'bg-gray-500/20 text-gray-400'
                              }`}>
                                {debate.status}
                              </span>
                              {debate.winner && (
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  debate.winner === 'pro' ? 'bg-pro/20 text-pro' :
                                  debate.winner === 'con' ? 'bg-con/20 text-con' :
                                  'bg-gray-500/20 text-gray-400'
                                }`}>
                                  Winner: {debate.winner}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

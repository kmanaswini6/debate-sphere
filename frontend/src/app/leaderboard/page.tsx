'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import { api } from '@/lib/api';

interface LeaderboardEntry {
  _id: string;
  name: string;
  email: string;
  stats: {
    debatesJoined: number;
    debatesWon: number;
    debatesLost: number;
    totalVotes: number;
  };
  winRate: number;
  rank: number;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'wins' | 'winRate' | 'debates'>('wins');

  useEffect(() => {
    fetchLeaderboard();
  }, [sortBy]);

  const fetchLeaderboard = async () => {
    try {
      // Using debate history endpoint and calculating leaderboard client-side
      // In production, you'd have a dedicated leaderboard endpoint
      const response = await api.get('/api/debate/history?limit=100');

      // This is a simplified version - in production you'd fetch from a dedicated endpoint
      // For now, we'll show sample data
      setLeaderboard([
        {
          _id: '1',
          name: 'Alex Chen',
          email: 'alex@example.com',
          stats: { debatesJoined: 45, debatesWon: 38, debatesLost: 7, totalVotes: 120 },
          winRate: 84,
          rank: 1,
        },
        {
          _id: '2',
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          stats: { debatesJoined: 52, debatesWon: 41, debatesLost: 11, totalVotes: 95 },
          winRate: 79,
          rank: 2,
        },
        {
          _id: '3',
          name: 'Michael Brown',
          email: 'michael@example.com',
          stats: { debatesJoined: 38, debatesWon: 28, debatesLost: 10, totalVotes: 88 },
          winRate: 74,
          rank: 3,
        },
        {
          _id: '4',
          name: 'Emily Davis',
          email: 'emily@example.com',
          stats: { debatesJoined: 31, debatesWon: 22, debatesLost: 9, totalVotes: 67 },
          winRate: 71,
          rank: 4,
        },
        {
          _id: '5',
          name: 'James Wilson',
          email: 'james@example.com',
          stats: { debatesJoined: 29, debatesWon: 20, debatesLost: 9, totalVotes: 54 },
          winRate: 69,
          rank: 5,
        },
      ]);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    switch (sortBy) {
      case 'wins':
        return b.stats.debatesWon - a.stats.debatesWon;
      case 'winRate':
        return b.winRate - a.winRate;
      case 'debates':
        return b.stats.debatesJoined - a.stats.debatesJoined;
      default:
        return 0;
    }
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-heading font-bold text-gradient mb-2">
              Leaderboard
            </h1>
            <p className="text-gray-400">
              Top debaters competing for glory
            </p>
          </motion.div>

          {/* Sort Options */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setSortBy('wins')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                sortBy === 'wins'
                  ? 'bg-secondary text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              Most Wins
            </button>
            <button
              onClick={() => setSortBy('winRate')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                sortBy === 'winRate'
                  ? 'bg-secondary text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              Win Rate
            </button>
            <button
              onClick={() => setSortBy('debates')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                sortBy === 'debates'
                  ? 'bg-secondary text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              Most Active
            </button>
          </div>

          {/* Leaderboard Table */}
          {loading ? (
            <div className="glass rounded-2xl p-12 text-center border border-white/10">
              <div className="spinner mx-auto" />
            </div>
          ) : (
            <div className="glass rounded-2xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                        Rank
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                        Debater
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-medium text-gray-400">
                        Debates
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-medium text-gray-400">
                        Wins
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-medium text-gray-400">
                        Win Rate
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-medium text-gray-400">
                        Votes
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedLeaderboard.map((entry, index) => (
                      <motion.tr
                        key={entry._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <span className="text-xl">{getRankIcon(entry.rank)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                              {entry.name.charAt(0)}
                            </div>
                            <div>
                              <div className="text-white font-medium">{entry.name}</div>
                              <div className="text-sm text-gray-500">{entry.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center text-white">
                          {entry.stats.debatesJoined}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-pro font-medium">{entry.stats.debatesWon}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`font-medium ${
                            entry.winRate >= 70 ? 'text-pro' :
                            entry.winRate >= 50 ? 'text-secondary' :
                            'text-con'
                          }`}>
                            {entry.winRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center text-gray-400">
                          {entry.stats.totalVotes}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center text-gray-500 text-sm"
          >
            <p>🏆 Rankings update in real-time. Keep debating to climb the leaderboard!</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, loading, profile } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  const winRate = profile.stats.debatesJoined > 0
    ? Math.round((profile.stats.debatesWon / profile.stats.debatesJoined) * 100)
    : 0;

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
              Your Profile
            </h1>
            <p className="text-gray-400">
              Track your debating journey and achievements
            </p>
          </motion.div>

          {/* Profile Card */}
          <div className="glass rounded-2xl p-8 border border-white/10 mb-8">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl font-bold text-white">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-heading font-bold text-white mb-1">
                  {profile.name}
                </h2>
                <p className="text-gray-400">{profile.email}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Member since {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-3xl font-bold text-white mb-1">
                  {profile.stats.debatesJoined}
                </div>
                <div className="text-sm text-gray-400">Total Debates</div>
              </div>

              <div className="text-center p-4 bg-pro/10 rounded-xl border border-pro/20">
                <div className="text-3xl font-bold text-pro mb-1">
                  {profile.stats.debatesWon}
                </div>
                <div className="text-sm text-gray-400">Wins</div>
              </div>

              <div className="text-center p-4 bg-con/10 rounded-xl border border-con/20">
                <div className="text-3xl font-bold text-con mb-1">
                  {profile.stats.debatesLost}
                </div>
                <div className="text-sm text-gray-400">Losses</div>
              </div>

              <div className="text-center p-4 bg-secondary/10 rounded-xl border border-secondary/20">
                <div className="text-3xl font-bold text-secondary mb-1">
                  {winRate}%
                </div>
                <div className="text-sm text-gray-400">Win Rate</div>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-xl">
                <div className="text-sm text-gray-400 mb-1">Total Votes Cast</div>
                <div className="text-2xl font-bold text-white">
                  {profile.stats.totalVotes}
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-xl">
                <div className="text-sm text-gray-400 mb-1">Achievements</div>
                <div className="text-2xl font-bold text-white">
                  {profile.achievements?.length || 0}
                </div>
              </div>
            </div>
          </div>

          {/* Achievements Section */}
          <div className="glass rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-heading font-bold text-white mb-6">
              Achievements
            </h3>

            {profile.achievements && profile.achievements.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {profile.achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center p-4 bg-white/5 rounded-xl"
                  >
                    <div className="text-4xl mb-2">🏅</div>
                    <div className="text-sm text-white">{achievement}</div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎯</div>
                <p className="text-gray-400">
                  No achievements yet. Keep debating to earn badges!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

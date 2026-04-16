'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { debateAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';

interface Debate {
  _id: string;
  topic: string;
  mode: string;
  status: string;
  winner?: string;
  votes: { pro: number; con: number };
  messages: any[];
  createdAt: string;
}

export default function HistoryPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [debates, setDebates] = useState<Debate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDebates();
    }
  }, [isAuthenticated, page, statusFilter]);

  const fetchDebates = async () => {
    try {
      const response = await debateAPI.getHistory({
        page,
        limit: 10,
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: searchTerm || undefined,
      });
      setDebates(response.data.debates);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Failed to fetch debates:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchDebates();
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-heading font-bold text-gradient mb-2">
              Debate History
            </h1>
            <p className="text-gray-400">
              Browse through your past debates and arguments
            </p>
          </motion.div>

          {/* Search & Filter */}
          <div className="glass rounded-xl p-4 border border-white/10 mb-8">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search debates by topic..."
                  className="w-full px-4 py-3 bg-white/5 border border-primary/20 rounded-lg focus:outline-none focus:border-primary text-text dark:text-white placeholder-gray-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-3 bg-white/5 border border-primary/20 rounded-lg focus:outline-none focus:border-primary text-text dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="abandoned">Abandoned</option>
              </select>
              <button type="submit" className="btn-primary px-6 py-3">
                Search
              </button>
            </form>
          </div>

          {/* Debates List */}
          {debates.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center border border-white/10">
              <div className="text-6xl mb-4">📜</div>
              <h3 className="text-xl font-heading font-semibold text-white mb-2">
                No debates found
              </h3>
              <p className="text-gray-400">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Start your first debate to see it here'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Link href="/dashboard" className="btn-primary mt-6 inline-block">
                  Create Debate
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {debates.map((debate, index) => (
                <motion.div
                  key={debate._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/debate/${debate._id}`}>
                    <div className="glass rounded-xl p-5 border border-white/10 hover:border-secondary/30 transition-all cursor-pointer group">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-white group-hover:text-secondary transition-colors truncate">
                            {debate.topic}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-400 mt-1 flex-wrap">
                            <span className="capitalize">{debate.mode.replace('-', ' vs ')}</span>
                            <span>•</span>
                            <span>{debate.messages.length} arguments</span>
                            <span>•</span>
                            <span>{formatDate(debate.createdAt)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0">
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
                          <svg className="w-5 h-5 text-gray-500 group-hover:text-secondary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 rounded-lg transition-all ${
                      page === pageNum
                        ? 'bg-secondary text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

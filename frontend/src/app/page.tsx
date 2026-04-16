'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const features = [
  {
    title: 'AI-Powered Debates',
    description: 'Engage with advanced AI opponents using the powerful Llama 3.3 70B model via Groq API.',
    icon: '🤖',
  },
  {
    title: 'Multiple Debate Modes',
    description: 'Choose from User vs AI, AI vs AI, or real-time User vs User debates.',
    icon: '🎯',
  },
  {
    title: 'Structured Rounds',
    description: 'Experience formal debate structure with Opening, Rebuttal, Crossfire, and Closing rounds.',
    icon: '📋',
  },
  {
    title: 'Live Audience Voting',
    description: 'Cast your vote and see real-time results as the audience decides the winner.',
    icon: '🗳️',
  },
  {
    title: 'AI Personalities',
    description: 'Face off against Logical, Emotional, Diplomatic, or Aggressive AI opponents.',
    icon: '🎭',
  },
  {
    title: 'Debate Analytics',
    description: 'Track your performance with detailed statistics and win/loss records.',
    icon: '📊',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const HomePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleStartDebate = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-text">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden debate-stage">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6"
          >
            <span className="text-6xl">🎤</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 text-gradient">
            DebateSphere
          </h1>

          <p className="text-xl md:text-2xl text-text-muted mb-8 max-w-3xl mx-auto">
            The AI-powered debating platform where ideas clash, arguments flourish,
            and minds meet on a professional stage.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleStartDebate}
              className="btn-primary text-lg px-8 py-4"
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Start Debating'}
            </button>
            <button
              onClick={() => router.push(isAuthenticated ? '/history' : '/login')}
              className="btn-primary text-lg px-8 py-4 glass"
            >
              {isAuthenticated ? 'View History' : 'Sign In'}
            </button>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-text-muted rounded-full flex justify-center">
            <div className="w-1 h-3 bg-text-muted rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-gradient mb-4">
              Why DebateSphere?
            </h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto">
              Experience debating like never before with cutting-edge AI and a stunning interface.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                className="glass rounded-2xl p-8 border border-primary/15 hover:border-primary/30 transition-all"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-heading font-semibold text-text mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-muted leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="glass rounded-3xl p-12 border border-primary/20">
            <h2 className="text-4xl font-heading font-bold text-gradient mb-4">
              Ready to Take the Stage?
            </h2>
            <p className="text-text-muted text-lg mb-8 max-w-xl mx-auto">
              Join thousands of debaters honing their skills and engaging in thought-provoking discussions.
            </p>
            <button
              onClick={handleStartDebate}
              className="btn-primary text-lg px-10 py-4 inline-block"
            >
              Create Free Account
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-primary/15">
        <div className="max-w-7xl mx-auto text-center text-text-muted">
          <p>&copy; 2026 DebateSphere. Built for passionate debaters.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
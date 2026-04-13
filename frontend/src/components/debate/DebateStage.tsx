import React from 'react';
import { motion } from 'framer-motion';
import { IDebate } from '../../../../backend/src/models/Debate';

interface DebateStageProps {
  debate: IDebate;
  selectedSide: 'pro' | 'con';
  onSideChange: (side: 'pro' | 'con') => void;
}

export default function DebateStage({ debate, selectedSide, onSideChange }: DebateStageProps) {
  return (
    <div className="debate-stage glass rounded-2xl p-8 border border-primary/20 relative overflow-hidden">
      {/* Spotlight effect */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2/3 h-32 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

      {/* Moderator Section */}
      <div className="text-center mb-8 relative z-10">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="inline-block"
        >
          <div className="text-5xl mb-2">⚖️</div>
          <div className="text-sm text-primary font-medium tracking-wider uppercase">
            Moderator
          </div>
          <div className="text-text font-heading text-lg">
            {debate.topic}
          </div>
        </motion.div>
      </div>

      {/* Debate Podiums */}
      <div className="grid grid-cols-2 gap-4 md:gap-8 relative z-10">
        {/* Pro Side */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={() => onSideChange('pro')}
          className={`podium pro rounded-xl p-6 cursor-pointer transition-all ${
            selectedSide === 'pro' ? 'ring-2 ring-pro' : ''
          }`}
        >
          <div className="text-center">
            <div className="text-4xl mb-3">🦁</div>
            <div className="text-pro font-bold text-lg mb-1">PRO</div>
            <div className="text-sm text-text-muted mb-4">
              In Favor
            </div>
            <div className="flex justify-center gap-2 flex-wrap">
              {debate.proSide.map((participant, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-pro/20 text-pro rounded-full text-xs"
                >
                  {participant?.name || 'AI'}
                </span>
              ))}
              {debate.proSide.length === 0 && debate.mode.includes('ai') && (
                <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs">
                  🤖 AI
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Con Side */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={() => onSideChange('con')}
          className={`podium con rounded-xl p-6 cursor-pointer transition-all ${
            selectedSide === 'con' ? 'ring-2 ring-con' : ''
          }`}
        >
          <div className="text-center">
            <div className="text-4xl mb-3">🦅</div>
            <div className="text-con font-bold text-lg mb-1">CON</div>
            <div className="text-sm text-text-muted mb-4">
              Against
            </div>
            <div className="flex justify-center gap-2 flex-wrap">
              {debate.conSide.map((participant, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-con/20 text-con rounded-full text-xs"
                >
                  {participant?.name || 'AI'}
                </span>
              ))}
              {debate.conSide.length === 0 && debate.mode.includes('ai') && (
                <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs">
                  🤖 AI
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* VS Badge */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-4xl font-black text-primary drop-shadow-lg"
        >
          VS
        </motion.div>
      </div>

      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-pro/50 via-primary/30 to-con/50" />
    </div>
  );
}

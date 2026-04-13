import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return formatDate(date);
}

export const ROUND_ORDER = ['opening', 'rebuttal', 'crossfire', 'closing'] as const;
export type Round = typeof ROUND_ORDER[number];

export const ROUND_LABELS: Record<Round, string> = {
  opening: 'Opening Statement',
  rebuttal: 'Rebuttal',
  crossfire: 'Crossfire',
  closing: 'Closing Statement',
};

export const ROUND_DURATIONS: Record<Round, number> = {
  opening: 180, // 3 minutes
  rebuttal: 120, // 2 minutes
  crossfire: 180, // 3 minutes
  closing: 120, // 2 minutes
};

export const DEBATE_MODES = [
  { id: 'user-vs-ai', label: 'You vs AI', description: 'Debate against an AI opponent' },
  { id: 'ai-vs-ai', label: 'AI vs AI', description: 'Watch two AIs debate' },
  { id: 'user-vs-user', label: 'You vs Player', description: 'Real-time debate with another user' },
] as const;

export const AI_PERSONALITIES = [
  { id: 'logical', name: 'Logical', description: 'Analytical and fact-based' },
  { id: 'emotional', name: 'Emotional', description: 'Passionate and values-driven' },
  { id: 'diplomatic', name: 'Diplomatic', description: 'Balanced and respectful' },
  { id: 'aggressive', name: 'Aggressive', description: 'Assertive and confrontational' },
] as const;

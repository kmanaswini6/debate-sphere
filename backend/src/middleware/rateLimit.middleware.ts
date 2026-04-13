import rateLimit from 'express-rate-limit';

// General API rate limiter
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for AI endpoints
export const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 AI requests per minute
  message: { error: 'AI rate limit exceeded. Please wait before sending more requests.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limiter for vote endpoints
export const voteRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 votes per minute
  message: { error: 'Too many votes. Please wait before voting again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

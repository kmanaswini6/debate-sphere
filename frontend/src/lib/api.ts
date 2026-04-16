import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const { getAuthToken } = await import('./auth');
    const token = getAuthToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      const { clearAuthToken } = require('./auth');
      clearAuthToken();
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API functions
export const debateAPI = {
  create: (data: { topic: string; mode: string; aiPersonality?: string }) =>
    api.post('/api/debate', data),

  getHistory: (params?: { page?: number; limit?: number; status?: string; search?: string }) =>
    api.get('/api/debate/history', { params }),

  getById: (id: string) =>
    api.get(`/api/debate/${id}`),

  addArgument: (id: string, data: { content: string; speaker: string; round: string }) =>
    api.post(`/api/debate/${id}/argument`, data),

  getAIResponse: (id: string, data: { side: string; personality?: string }) =>
    api.post(`/api/debate/${id}/respond`, data),

  updateStatus: (id: string, data: { status: string; winner?: string }) =>
    api.post(`/api/debate/${id}/status`, data),

  nextRound: (id: string) =>
    api.post(`/api/debate/${id}/next-round`),
};

export const voteAPI = {
  submit: (data: { debateId: string; selectedSide: string }) =>
    api.post('/api/vote', data),

  getVotes: (debateId: string) =>
    api.get(`/api/vote/${debateId}`),
};

export const authAPI = {
  verify: (token: string) =>
    api.post('/api/auth/verify', { token }),

  getProfile: () =>
    api.get('/api/auth/profile'),
};

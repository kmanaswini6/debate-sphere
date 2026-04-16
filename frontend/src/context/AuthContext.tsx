'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getToken, clearAuthToken } from '@/lib/auth';
import { api } from '@/lib/api';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  stats: {
    debatesJoined: number;
    debatesWon: number;
    debatesLost: number;
    totalVotes: number;
  };
  achievements: string[];
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    try {
      const response = await api.get('/api/auth/profile');
      setProfile(response.data.user);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      clearAuthToken();
      setProfile(null);
    }
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Update token
        await getToken();
        // Fetch profile
        try {
          const response = await api.get('/api/auth/profile');
          setProfile(response.data.user);
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        }
      } else {
        setProfile(null);
        clearAuthToken();
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

'use client';

import { create } from 'zustand';
import type { AuthUser } from '@/types/auth';

interface AuthStoreState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setSession: (user: AuthUser | null) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  user: null,
  isAuthenticated: false,
  setSession: (user) => set({ user, isAuthenticated: Boolean(user) }),
  clearSession: () => set({ user: null, isAuthenticated: false }),
}));
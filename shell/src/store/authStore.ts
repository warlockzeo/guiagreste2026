import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Brand } from '../types';

interface AuthStore {
  user: User | Brand | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User | Brand, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

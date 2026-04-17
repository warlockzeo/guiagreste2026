import { describe, it, expect } from 'vitest';
import { useAuthStore } from '../store/authStore';
import type { User } from '../types';

describe('authStore', () => {
  it('should have initial state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('should login user', () => {
    const mockUser: User = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      type: 'user',
    };

    useAuthStore.getState().login(mockUser, 'mock-token');

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe('mock-token');
    expect(state.isAuthenticated).toBe(true);
  });

  it('should logout user', () => {
    const mockUser: User = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      type: 'user',
    };

    useAuthStore.getState().login(mockUser, 'mock-token');
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});

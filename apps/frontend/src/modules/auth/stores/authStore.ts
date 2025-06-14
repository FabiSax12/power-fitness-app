import type { Person } from "@/core/entities/User";
import { create } from "zustand";
import { persist } from 'zustand/middleware';

export interface AuthState {
  user: Person | null;
  token: string | null;
  isAuthenticated: boolean;
  rememberMe: boolean;
  setAuth: (user: Person, token: string) => void;
  setRememberMe: (remember: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      rememberMe: false,
      setAuth: (user: Person, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },
      setRememberMe: (remember: boolean) => {
        set({ rememberMe: remember });
      },
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'power-fitness-auth',
      partialize: (state) =>
        state.rememberMe
          ? { user: state.user, token: state.token, isAuthenticated: state.isAuthenticated, rememberMe: state.rememberMe }
          : { rememberMe: state.rememberMe },
    }
  )
);



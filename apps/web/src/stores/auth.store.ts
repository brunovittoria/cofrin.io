import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  // User preferences that persist across sessions
  rememberMe: boolean;
  lastLoginEmail?: string;
  
  // Actions
  setRememberMe: (remember: boolean) => void;
  setLastLoginEmail: (email: string) => void;
  clearAuthPreferences: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      rememberMe: false,
      lastLoginEmail: undefined,
      
      setRememberMe: (remember) => set({ rememberMe: remember }),
      setLastLoginEmail: (email) => set({ lastLoginEmail: email }),
      clearAuthPreferences: () => set({ rememberMe: false, lastLoginEmail: undefined }),
    }),
    {
      name: "cofrin-auth-storage",
    }
  )
);

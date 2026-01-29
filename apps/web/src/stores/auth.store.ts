import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthState {
  // Auth state
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  
  // User preferences that persist across sessions
  rememberMe: boolean;
  lastLoginEmail?: string;
  
  // Actions
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => Promise<void>;
  signOut: () => Promise<void>;
  setRememberMe: (remember: boolean) => void;
  setLastLoginEmail: (email: string) => void;
  clearAuthPreferences: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Auth state
      user: null,
      session: null,
      loading: true,
      initialized: false,
      
      // User preferences
      rememberMe: false,
      lastLoginEmail: undefined,
      
      // Auth actions
      setUser: (user) => set({ user }),
      setSession: (session) => set({ session, user: session?.user ?? null }),
      setLoading: (loading) => set({ loading }),
      
      initializeAuth: async () => {
        // Prevent multiple initializations
        if (get().initialized) {
          return;
        }
        
        set({ loading: true });
        
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        set({ session, user: session?.user ?? null, loading: false, initialized: true });
        
        // Listen for auth changes
        // Note: The subscription will be active for the app lifetime, which is fine for SPA
        supabase.auth.onAuthStateChange((_event, session) => {
          set({ session, user: session?.user ?? null, loading: false });
        });
      },
      
      signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
          throw error;
        }
        set({ user: null, session: null });
      },
      
      // User preferences actions
      setRememberMe: (remember) => set({ rememberMe: remember }),
      setLastLoginEmail: (email) => set({ lastLoginEmail: email }),
      clearAuthPreferences: () => set({ rememberMe: false, lastLoginEmail: undefined }),
    }),
    {
      name: "cofrin-auth-storage",
      partialize: (state) => ({
        // Only persist user preferences, not auth state
        rememberMe: state.rememberMe,
        lastLoginEmail: state.lastLoginEmail,
      }),
    }
  )
);

// Hook for backward compatibility with useAuth
export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const session = useAuthStore((state) => state.session);
  const loading = useAuthStore((state) => state.loading);
  const signOut = useAuthStore((state) => state.signOut);
  
  return { user, session, loading, signOut };
};

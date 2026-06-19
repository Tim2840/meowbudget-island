import { create } from "zustand";
import type { User } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAnonymous: boolean;
  initialize: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAnonymous: false,

  initialize: async () => {
    if (!isSupabaseConfigured()) {
      set({ isLoading: false });
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      set({
        user: session.user,
        isAnonymous: session.user.is_anonymous ?? false,
        isLoading: false,
      });
    } else {
      // Auto sign in anonymously
      const { data, error } = await supabase.auth.signInAnonymously();
      if (!error && data.user) {
        set({ user: data.user, isAnonymous: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      set({
        user: session?.user ?? null,
        isAnonymous: session?.user?.is_anonymous ?? false,
      });
    });
  },

  signInWithGoogle: async () => {
    if (!isSupabaseConfigured()) return;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  },

  signInWithEmail: async (email: string) => {
    if (!isSupabaseConfigured()) return { error: null };
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    return { error: error?.message ?? null };
  },

  signOut: async () => {
    if (isSupabaseConfigured()) await supabase.auth.signOut();
    set({ user: null, isAnonymous: false });
  },
}));

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfile } from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const DEFAULT_PROFILE: Omit<UserProfile, "id" | "createdAt"> = {
  level: 1,
  exp: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastRecordDate: null,
  language: "zh-TW",
  onboardingCompleted: false,
};

interface ProfileState {
  profile: UserProfile | null;
  loadProfile: (userId: string) => Promise<void>;
  updateProfile: (userId: string, updates: Partial<UserProfile>) => Promise<void>;
  addExpAndLevel: (userId: string, expGained: number) => Promise<{ levelUp: boolean; newLevel: number }>;
  updateStreak: (userId: string, params: { newStreak: number; newLongest: number; lastDate: string }) => Promise<void>;
  markOnboardingComplete: (userId: string) => Promise<void>;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profile: null,

      loadProfile: async (userId: string) => {
        if (!isSupabaseConfigured()) {
          set({ profile: { id: userId, ...DEFAULT_PROFILE, createdAt: new Date().toISOString() } });
          return;
        }
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();
        if (data) {
          set({
            profile: {
              id: data.id,
              level: data.level,
              exp: data.exp,
              currentStreak: data.current_streak,
              longestStreak: data.longest_streak,
              lastRecordDate: data.last_record_date,
              language: data.language,
              onboardingCompleted: data.onboarding_completed,
              createdAt: data.created_at,
            },
          });
        } else {
          // Create profile
          const newProfile = { id: userId, ...DEFAULT_PROFILE, createdAt: new Date().toISOString() };
          await supabase.from("profiles").upsert({
            id: userId,
            level: 1,
            exp: 0,
            current_streak: 0,
            longest_streak: 0,
            last_record_date: null,
            language: "zh-TW",
            onboarding_completed: false,
          });
          set({ profile: newProfile });
        }
      },

      updateProfile: async (userId: string, updates: Partial<UserProfile>) => {
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...updates } : null,
        }));
        if (!isSupabaseConfigured()) return;
        await supabase.from("profiles").update(updates).eq("id", userId);
      },

      addExpAndLevel: async (userId: string, expGained: number) => {
        const { LEVEL_THRESHOLDS } = await import("@/lib/constants");
        const profile = get().profile;
        if (!profile) return { levelUp: false, newLevel: 1 };

        const newExp = profile.exp + expGained;
        let newLevel = profile.level;
        while (newLevel < LEVEL_THRESHOLDS.length && newExp >= LEVEL_THRESHOLDS[newLevel]) {
          newLevel++;
        }
        const levelUp = newLevel > profile.level;

        const updates = { exp: newExp, level: newLevel };
        set((state) => ({ profile: state.profile ? { ...state.profile, ...updates } : null }));

        if (isSupabaseConfigured()) {
          await supabase.from("profiles").update({ exp: newExp, level: newLevel }).eq("id", userId);
        }
        return { levelUp, newLevel };
      },

      updateStreak: async (userId: string, { newStreak, newLongest, lastDate }) => {
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, currentStreak: newStreak, longestStreak: newLongest, lastRecordDate: lastDate }
            : null,
        }));
        if (isSupabaseConfigured()) {
          await supabase.from("profiles").update({
            current_streak: newStreak,
            longest_streak: newLongest,
            last_record_date: lastDate,
          }).eq("id", userId);
        }
      },

      markOnboardingComplete: async (userId: string) => {
        set((state) => ({
          profile: state.profile ? { ...state.profile, onboardingCompleted: true } : null,
        }));
        if (isSupabaseConfigured()) {
          await supabase.from("profiles").update({ onboarding_completed: true }).eq("id", userId);
        }
      },
    }),
    { name: "meow_profile" }
  )
);

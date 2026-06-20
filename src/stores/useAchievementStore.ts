import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ACHIEVEMENTS } from "@/lib/constants";
import type { Achievement } from "@/types";
import type { AchievementProgress } from "@/lib/progressEngine";

interface AchievementState {
  /** key -> ISO earnedAt */
  earned: Record<string, string>;
  /** keys whose earn toast has been shown */
  seen: string[];
  /** Mark newly-earned achievements; returns the ones that flipped this call. */
  sync: (evaluated: Record<string, AchievementProgress>) => Achievement[];
  markSeen: (keys: string[]) => void;
  earnedKeys: () => Set<string>;
}

export const useAchievementStore = create<AchievementState>()(
  persist(
    (set, get) => ({
      earned: {},
      seen: [],

      sync: (evaluated) => {
        const { earned } = get();
        const newly: Achievement[] = [];
        for (const a of ACHIEVEMENTS) {
          if (evaluated[a.key]?.earned && !earned[a.key]) {
            newly.push(a);
          }
        }
        if (newly.length > 0) {
          const now = new Date().toISOString();
          set((state) => ({
            earned: {
              ...state.earned,
              ...Object.fromEntries(newly.map((a) => [a.key, now])),
            },
          }));
        }
        return newly;
      },

      markSeen: (keys) => {
        set((state) => ({ seen: Array.from(new Set([...state.seen, ...keys])) }));
      },

      earnedKeys: () => new Set(Object.keys(get().earned)),
    }),
    { name: "meow_achievements" }
  )
);

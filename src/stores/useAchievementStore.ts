import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AchievementState {
  earned: string[];  // all-time earned achievement keys
  unseen: string[];  // earned but not yet shown in UI

  grantAchievements: (keys: string[]) => void;
  markAllSeen: () => void;
  isEarned: (key: string) => boolean;
}

export const useAchievementStore = create<AchievementState>()(
  persist(
    (set, get) => ({
      earned: [],
      unseen: [],

      grantAchievements: (keys) => {
        if (keys.length === 0) return;
        set((state) => ({
          earned: [...new Set([...state.earned, ...keys])],
          unseen: [...new Set([...state.unseen, ...keys])],
        }));
      },

      markAllSeen: () => set({ unseen: [] }),

      isEarned: (key) => get().earned.includes(key),
    }),
    { name: "meow_achievements" }
  )
);

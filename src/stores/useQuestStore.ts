import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getWeekRange } from "@/lib/streakUtils";

function todayKey(): string {
  return new Date().toISOString().split("T")[0];
}

function weekStartKey(date = new Date()): string {
  const { start } = getWeekRange(date);
  return start.toISOString().split("T")[0];
}

interface QuestState {
  // questKey -> YYYY-MM-DD when it was last claimed
  claimedMap: Record<string, string>;
  // Monday YYYY-MM-DD of the week when user last viewed weekly report
  reportViewedWeek: string | null;

  isClaimed: (questKey: string, type: "daily" | "weekly" | "one_time") => boolean;
  markClaimed: (questKey: string) => void;
  markReportViewed: () => void;
  isReportViewedThisWeek: () => boolean;
}

export const useQuestStore = create<QuestState>()(
  persist(
    (set, get) => ({
      claimedMap: {},
      reportViewedWeek: null,

      isClaimed: (questKey, type) => {
        const claimedDate = get().claimedMap[questKey];
        if (!claimedDate) return false;
        if (type === "daily") return claimedDate === todayKey();
        if (type === "weekly") {
          // noon on claimedDate to avoid DST edge cases
          const claimedWeek = weekStartKey(new Date(claimedDate + "T12:00:00"));
          return claimedWeek === weekStartKey();
        }
        return true;
      },

      markClaimed: (questKey) => {
        set((state) => ({
          claimedMap: { ...state.claimedMap, [questKey]: todayKey() },
        }));
      },

      markReportViewed: () => {
        set({ reportViewedWeek: weekStartKey() });
      },

      isReportViewedThisWeek: () => get().reportViewedWeek === weekStartKey(),
    }),
    { name: "meow_quests" }
  )
);

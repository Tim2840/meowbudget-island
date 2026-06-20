import { create } from "zustand";
import { persist } from "zustand/middleware";

interface QuestState {
  /** questKey -> period id it was claimed for (today's date for daily, week-start for weekly) */
  claimed: Record<string, string>;
  /** date string (YYYY-MM-DD) a report was last viewed */
  reportViewedDay: string | null;
  /** week-start date string a report was last viewed */
  reportViewedWeek: string | null;

  isClaimed: (questKey: string, periodId: string) => boolean;
  claim: (questKey: string, periodId: string) => void;
  markReportViewed: (day: string, weekStart: string) => void;
}

export const useQuestStore = create<QuestState>()(
  persist(
    (set, get) => ({
      claimed: {},
      reportViewedDay: null,
      reportViewedWeek: null,

      isClaimed: (questKey, periodId) => get().claimed[questKey] === periodId,

      claim: (questKey, periodId) => {
        set((state) => ({ claimed: { ...state.claimed, [questKey]: periodId } }));
      },

      markReportViewed: (day, weekStart) => {
        set({ reportViewedDay: day, reportViewedWeek: weekStart });
      },
    }),
    { name: "meow_quests" }
  )
);

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Budget } from "@/types";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

interface BudgetState {
  budgets: Budget[];

  getBudgets: (yearMonth: string) => Budget[];
  getTotalBudget: (yearMonth: string) => Budget | null;
  getGroupBudget: (yearMonth: string, groupKey: string) => Budget | null;

  setBudget: (
    userId: string,
    yearMonth: string,
    categoryId: string | null,
    amount: number
  ) => void;
  removeBudget: (yearMonth: string, categoryId: string | null) => void;
}

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set, get) => ({
      budgets: [],

      getBudgets: (yearMonth) =>
        get().budgets.filter((b) => b.yearMonth === yearMonth),

      getTotalBudget: (yearMonth) =>
        get().budgets.find(
          (b) => b.yearMonth === yearMonth && b.categoryId === null
        ) ?? null,

      getGroupBudget: (yearMonth, groupKey) =>
        get().budgets.find(
          (b) => b.yearMonth === yearMonth && b.categoryId === groupKey
        ) ?? null,

      setBudget: (userId, yearMonth, categoryId, amount) => {
        if (amount <= 0) {
          get().removeBudget(yearMonth, categoryId);
          return;
        }
        set((state) => {
          const existing = state.budgets.find(
            (b) => b.yearMonth === yearMonth && b.categoryId === categoryId
          );
          if (existing) {
            return {
              budgets: state.budgets.map((b) =>
                b.id === existing.id ? { ...b, amount } : b
              ),
            };
          }
          const newBudget: Budget = {
            id: `budget_${yearMonth}_${categoryId ?? "total"}_${Date.now()}`,
            userId,
            categoryId,
            amount,
            yearMonth,
          };
          return { budgets: [...state.budgets, newBudget] };
        });

        if (isSupabaseConfigured()) {
          const saved = get().budgets.find(
            (b) => b.yearMonth === yearMonth && b.categoryId === categoryId
          );
          if (saved) {
            supabase
              .from("budgets")
              .upsert(saved, { onConflict: "id" })
              .then(() => {});
          }
        }
      },

      removeBudget: (yearMonth, categoryId) => {
        set((state) => ({
          budgets: state.budgets.filter(
            (b) =>
              !(b.yearMonth === yearMonth && b.categoryId === categoryId)
          ),
        }));
      },
    }),
    { name: "meow_budget" }
  )
);

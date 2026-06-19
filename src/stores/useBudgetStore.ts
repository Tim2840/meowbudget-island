import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Budget } from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

/** Stable local id for a budget row: one per (month, category|total). */
function budgetId(yearMonth: string, categoryId: string | null): string {
  return `${yearMonth}__${categoryId ?? "TOTAL"}`;
}

function mapRow(row: Record<string, unknown>): Budget {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    categoryId: (row.category_id as string | null) ?? null,
    amount: row.amount as number,
    yearMonth: row.year_month as string,
  };
}

interface BudgetState {
  budgets: Budget[];
  loadBudgets: (userId: string) => Promise<void>;
  /** Set (or replace) a budget. amount <= 0 removes it. categoryId null = monthly total. */
  setBudget: (userId: string, categoryId: string | null, amount: number, yearMonth: string) => Promise<void>;
  getBudget: (categoryId: string | null, yearMonth: string) => Budget | undefined;
  getMonthBudgets: (yearMonth: string) => Budget[];
}

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set, get) => ({
      budgets: [],

      loadBudgets: async (userId: string) => {
        if (!isSupabaseConfigured()) return;
        const { data } = await supabase
          .from("budgets")
          .select("*")
          .eq("user_id", userId);
        if (data) set({ budgets: data.map(mapRow) });
      },

      setBudget: async (userId, categoryId, amount, yearMonth) => {
        const id = budgetId(yearMonth, categoryId);
        const rounded = Math.max(0, Math.round(amount));

        set((state) => {
          const without = state.budgets.filter((b) => b.id !== id);
          if (rounded <= 0) return { budgets: without };
          const next: Budget = { id, userId, categoryId, amount: rounded, yearMonth };
          return { budgets: [...without, next] };
        });

        if (isSupabaseConfigured()) {
          if (rounded <= 0) {
            await supabase.from("budgets").delete().eq("id", id).eq("user_id", userId);
          } else {
            await supabase.from("budgets").upsert({
              id,
              user_id: userId,
              category_id: categoryId,
              amount: rounded,
              year_month: yearMonth,
            });
          }
        }
      },

      getBudget: (categoryId, yearMonth) => {
        const id = budgetId(yearMonth, categoryId);
        return get().budgets.find((b) => b.id === id);
      },

      getMonthBudgets: (yearMonth) => {
        return get().budgets.filter((b) => b.yearMonth === yearMonth);
      },
    }),
    { name: "meow_budgets" }
  )
);

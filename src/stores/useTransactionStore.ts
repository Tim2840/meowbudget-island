import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Transaction } from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { todayString } from "@/lib/streakUtils";

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  loadTransactions: (userId: string) => Promise<void>;
  addTransaction: (userId: string, t: Omit<Transaction, "id" | "userId" | "createdAt">) => Promise<Transaction>;
  deleteTransaction: (userId: string, id: string) => Promise<void>;
  getByDateRange: (start: string, end: string) => Transaction[];
  getTodayTransactions: () => Transaction[];
}

function mapRow(row: Record<string, unknown>): Transaction {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    type: row.type as "income" | "expense",
    amount: row.amount as number,
    categoryId: row.category_id as string,
    categorySnapshot: row.category_snapshot as Transaction["categorySnapshot"],
    date: row.date as string,
    note: row.note as string | undefined,
    rewardCoins: row.reward_coins as number,
    rewardResourceType: row.reward_resource_type as Transaction["rewardResourceType"],
    rewardResourceAmount: row.reward_resource_amount as number,
    createdAt: row.created_at as string,
  };
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: [],
      isLoading: false,

      loadTransactions: async (userId: string) => {
        set({ isLoading: true });
        if (!isSupabaseConfigured()) {
          set({ isLoading: false });
          return;
        }
        const { data } = await supabase
          .from("transactions")
          .select("*")
          .eq("user_id", userId)
          .order("date", { ascending: false })
          .order("created_at", { ascending: false });
        if (data) {
          set({ transactions: data.map(mapRow) });
        }
        set({ isLoading: false });
      },

      addTransaction: async (userId, t) => {
        const newTransaction: Transaction = {
          ...t,
          id: crypto.randomUUID(),
          userId,
          createdAt: new Date().toISOString(),
        };

        // Optimistic update
        set((state) => ({ transactions: [newTransaction, ...state.transactions] }));

        if (isSupabaseConfigured()) {
          const { data } = await supabase.from("transactions").insert({
            id: newTransaction.id,
            user_id: userId,
            type: t.type,
            amount: t.amount,
            category_id: t.categoryId,
            category_snapshot: t.categorySnapshot,
            date: t.date,
            note: t.note,
            reward_coins: t.rewardCoins,
            reward_resource_type: t.rewardResourceType,
            reward_resource_amount: t.rewardResourceAmount,
          }).select().single();
          if (data) {
            const synced = mapRow(data);
            set((state) => ({
              transactions: state.transactions.map((tx) => tx.id === newTransaction.id ? synced : tx),
            }));
            return synced;
          }
        }
        return newTransaction;
      },

      deleteTransaction: async (userId: string, id: string) => {
        set((state) => ({ transactions: state.transactions.filter((t) => t.id !== id) }));
        if (isSupabaseConfigured()) {
          await supabase.from("transactions").delete().eq("id", id).eq("user_id", userId);
        }
      },

      getByDateRange: (start: string, end: string) => {
        return get().transactions.filter((t) => t.date >= start && t.date <= end);
      },

      getTodayTransactions: () => {
        const today = todayString();
        return get().transactions.filter((t) => t.date === today);
      },
    }),
    { name: "meow_transactions" }
  )
);

"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useProfileStore } from "@/stores/useProfileStore";
import { useWalletStore } from "@/stores/useWalletStore";
import { useTransactionStore } from "@/stores/useTransactionStore";
import { useBudgetStore } from "@/stores/useBudgetStore";

export default function AppInitializer() {
  const { initialize, user } = useAuthStore();
  const { loadProfile } = useProfileStore();
  const { loadWallet } = useWalletStore();
  const { loadTransactions } = useTransactionStore();
  const { loadBudgets } = useBudgetStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (user) {
      loadProfile(user.id);
      loadWallet(user.id);
      loadTransactions(user.id);
      loadBudgets(user.id);
    }
  }, [user, loadProfile, loadWallet, loadTransactions, loadBudgets]);

  return null;
}

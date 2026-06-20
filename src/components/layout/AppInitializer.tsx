"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useProfileStore } from "@/stores/useProfileStore";
import { useWalletStore } from "@/stores/useWalletStore";
import { useTransactionStore } from "@/stores/useTransactionStore";
import { useBudgetStore } from "@/stores/useBudgetStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { useBuildingStore } from "@/stores/useBuildingStore";

export default function AppInitializer() {
  const { initialize, user } = useAuthStore();
  const { loadProfile } = useProfileStore();
  const { loadWallet } = useWalletStore();
  const { loadTransactions } = useTransactionStore();
  const { loadBudgets } = useBudgetStore();
  const { loadSettings, animationsEnabled } = useSettingsStore();
  const { loadBuildings } = useBuildingStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (user) {
      loadProfile(user.id);
      loadWallet(user.id);
      loadTransactions(user.id);
      loadBudgets(user.id);
      loadSettings(user.id);
      loadBuildings(user.id);
    }
  }, [user, loadProfile, loadWallet, loadTransactions, loadBudgets, loadSettings, loadBuildings]);

  // Reflect the animations preference globally.
  useEffect(() => {
    document.documentElement.classList.toggle("no-animations", !animationsEnabled);
  }, [animationsEnabled]);

  return null;
}

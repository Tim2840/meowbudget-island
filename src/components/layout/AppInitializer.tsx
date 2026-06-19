"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useProfileStore } from "@/stores/useProfileStore";
import { useWalletStore } from "@/stores/useWalletStore";
import { useTransactionStore } from "@/stores/useTransactionStore";

export default function AppInitializer() {
  const { initialize, user } = useAuthStore();
  const { loadProfile } = useProfileStore();
  const { loadWallet } = useWalletStore();
  const { loadTransactions } = useTransactionStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (user) {
      loadProfile(user.id);
      loadWallet(user.id);
      loadTransactions(user.id);
    }
  }, [user, loadProfile, loadWallet, loadTransactions]);

  return null;
}

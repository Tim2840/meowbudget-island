"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useProfileStore } from "@/stores/useProfileStore";
import { useWalletStore } from "@/stores/useWalletStore";
import { useTransactionStore } from "@/stores/useTransactionStore";
import { calculateReward } from "@/lib/rewardEngine";
import { updateStreak, todayString } from "@/lib/streakUtils";
import { DEFAULT_CATEGORIES } from "@/lib/constants";
import WalletBar from "./WalletBar";
import RecordForm from "./RecordForm";
import RewardPopup from "./RewardPopup";
import TransactionList from "./TransactionList";
import type { Category, RewardResult } from "@/types";

export default function RecordPage() {
  const t = useTranslations("record");
  const { user } = useAuthStore();
  const { profile, updateStreak: saveStreak, addExpAndLevel } = useProfileStore();
  const { wallet, addResources } = useWalletStore();
  const { addTransaction, getTodayTransactions } = useTransactionStore();

  const [showForm, setShowForm] = useState(false);
  const [reward, setReward] = useState<RewardResult | null>(null);

  const handleRecord = async (
    amount: number,
    category: Category,
    date: string,
    note?: string
  ) => {
    if (!user || !profile) return;

    const rewardResult = calculateReward(category, profile.currentStreak, profile.level, profile.exp);

    const streakUpdate = updateStreak(
      profile.lastRecordDate,
      profile.currentStreak,
      profile.longestStreak,
    );

    await addTransaction(user.id, {
      type: category.isIncome ? "income" : "expense",
      amount,
      categoryId: category.id,
      categorySnapshot: {
        nameKey: category.nameKey,
        emoji: category.emoji,
        color: category.color,
        isCustom: category.isCustom,
      },
      date,
      note,
      rewardCoins: rewardResult.coins,
      rewardResourceType: rewardResult.resourceType,
      rewardResourceAmount: rewardResult.resourceAmount,
    });

    await addResources(user.id, rewardResult.coins, rewardResult.resourceType, rewardResult.resourceAmount);
    await saveStreak(user.id, {
      newStreak: streakUpdate.newStreak,
      newLongest: streakUpdate.newLongest,
      lastDate: date === todayString() ? date : profile.lastRecordDate ?? date,
    });
    const { levelUp, newLevel } = await addExpAndLevel(user.id, rewardResult.expGained);
    setReward({ ...rewardResult, levelUp, newLevel: levelUp ? newLevel : undefined });
    setShowForm(false);
  };

  const todayTransactions = getTodayTransactions();

  return (
    <div className="flex flex-col h-full">
      {/* Wallet bar */}
      <WalletBar wallet={wallet} streak={profile?.currentStreak ?? 0} />

      {/* Today's records */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2">
        <TransactionList transactions={todayTransactions} date={todayString()} />
      </div>

      {/* Add record FAB */}
      <div className="px-4 pb-4">
        <button
          data-tutorial="add-record-btn"
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold text-base rounded-2xl py-3.5 shadow-lg transition-colors"
        >
          <Plus size={20} strokeWidth={2.5} />
          {t("add")}
        </button>
      </div>

      {/* Record form modal */}
      {showForm && (
        <RecordForm
          categories={DEFAULT_CATEGORIES.map((c, i) => ({ ...c, id: `default-${i}`, userId: null, isCustom: false }))}
          onSave={handleRecord}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Reward popup */}
      {reward && (
        <RewardPopup reward={reward} onClose={() => setReward(null)} />
      )}
    </div>
  );
}

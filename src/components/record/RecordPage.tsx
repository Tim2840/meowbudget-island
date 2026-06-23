"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Scroll, Trophy } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useProfileStore } from "@/stores/useProfileStore";
import { useWalletStore } from "@/stores/useWalletStore";
import { useTransactionStore } from "@/stores/useTransactionStore";
import { useBudgetStore } from "@/stores/useBudgetStore";
import { useAchievementStore } from "@/stores/useAchievementStore";
import { calculateReward } from "@/lib/rewardEngine";
import { checkAchievements } from "@/lib/achievementEngine";
import { updateStreak, todayString } from "@/lib/streakUtils";
import WalletBar from "./WalletBar";
import RecordForm from "./RecordForm";
import RewardPopup from "./RewardPopup";
import TransactionList from "./TransactionList";
import AchievementSheet from "./AchievementSheet";
import QuestSheet from "@/components/island/QuestSheet";
import type { Category, CategoryGroup, RewardResult } from "@/types";

export default function RecordPage() {
  const t = useTranslations("record");
  const tq = useTranslations("quest");
  const ta = useTranslations("achievement");
  const { user } = useAuthStore();
  const { profile, updateStreak: saveStreak, addExpAndLevel } = useProfileStore();
  const { wallet, addResources } = useWalletStore();
  const { addTransaction, getTodayTransactions } = useTransactionStore();
  const { grantAchievements } = useAchievementStore();

  const [showForm, setShowForm] = useState(false);
  const [reward, setReward] = useState<RewardResult | null>(null);
  const [showQuests, setShowQuests] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  const handleRecord = async (
    amount: number,
    subcategory: Category,
    group: CategoryGroup,
    date: string,
    note?: string
  ) => {
    if (!user || !profile) return;

    const rewardResult = calculateReward(subcategory, profile.currentStreak, profile.level, profile.exp);

    const streakUpdate = updateStreak(
      profile.lastRecordDate,
      profile.currentStreak,
      profile.longestStreak,
    );

    await addTransaction(user.id, {
      type: subcategory.isIncome ? "income" : "expense",
      amount,
      categoryId: subcategory.key,
      categorySnapshot: {
        key: subcategory.key,
        groupKey: group.key,
        nameKey: subcategory.nameKey,
        groupNameKey: group.nameKey,
        emoji: subcategory.emoji,
        color: subcategory.color,
        isCustom: subcategory.isCustom,
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

    // Check achievements with updated state
    const { transactions } = useTransactionStore.getState();
    const { budgets } = useBudgetStore.getState();
    const { earned } = useAchievementStore.getState();
    const updatedProfile = useProfileStore.getState().profile;
    const newlyEarned = checkAchievements(
      {
        totalRecords: transactions.length,
        streak: updatedProfile?.currentStreak ?? streakUpdate.newStreak,
        level: updatedProfile?.level ?? profile.level,
        budgetCount: budgets.length,
      },
      earned,
    );
    if (newlyEarned.length > 0) grantAchievements(newlyEarned);

    setReward({
      ...rewardResult,
      levelUp,
      newLevel: levelUp ? newLevel : undefined,
      newAchievements: newlyEarned,
    });
    setShowForm(false);
  };

  const todayTransactions = getTodayTransactions();

  return (
    <div className="flex flex-col h-full">
      {/* Wallet bar */}
      <WalletBar wallet={wallet} streak={profile?.currentStreak ?? 0} />

      {/* Quick-access row */}
      <div className="px-4 pt-2.5 pb-1 flex gap-2">
        <button
          onClick={() => setShowQuests(true)}
          className="flex items-center gap-1.5 bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full active:scale-95 transition-transform"
        >
          <Scroll size={13} />
          {tq("title")}
        </button>
        <button
          onClick={() => setShowAchievements(true)}
          className="flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1.5 rounded-full active:scale-95 transition-transform"
        >
          <Trophy size={13} />
          {ta("title")}
        </button>
      </div>

      {/* Today's records */}
      <div className="flex-1 overflow-y-auto px-4 pt-2 pb-2">
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

      {/* Sheets */}
      {showQuests && <QuestSheet onClose={() => setShowQuests(false)} />}
      {showAchievements && <AchievementSheet onClose={() => setShowAchievements(false)} />}

      {/* Record form modal */}
      {showForm && (
        <RecordForm onSave={handleRecord} onCancel={() => setShowForm(false)} />
      )}

      {/* Reward popup */}
      {reward && (
        <RewardPopup reward={reward} onClose={() => setReward(null)} />
      )}
    </div>
  );
}

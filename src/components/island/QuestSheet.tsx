"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { QUESTS } from "@/lib/constants";
import { useQuestStore } from "@/stores/useQuestStore";
import { useWalletStore } from "@/stores/useWalletStore";
import { useProfileStore } from "@/stores/useProfileStore";
import { useTransactionStore } from "@/stores/useTransactionStore";
import { useBudgetStore } from "@/stores/useBudgetStore";
import { getWeekRange, todayString, formatYearMonth } from "@/lib/streakUtils";
import type { Quest } from "@/types";

function computeProgress(
  quest: Quest,
  todayCount: number,
  weekCount: number,
  reportViewed: boolean,
  budgetKept: boolean,
): number {
  switch (quest.conditionType) {
    case "record_count":
      return quest.type === "daily" ? todayCount : weekCount;
    case "view_report":
      return reportViewed ? 1 : 0;
    case "category_budget_kept":
      return budgetKept ? 1 : 0;
    default:
      return 0;
  }
}

interface Props {
  onClose: () => void;
}

export default function QuestSheet({ onClose }: Props) {
  const t = useTranslations("quest");
  const { isClaimed, markClaimed } = useQuestStore();
  const { isReportViewedThisWeek } = useQuestStore();
  const { addResources } = useWalletStore();
  const { addExpAndLevel, profile } = useProfileStore();
  const { transactions } = useTransactionStore();
  const { budgets } = useBudgetStore();

  const today = todayString();
  const { start: weekStart, end: weekEnd } = getWeekRange();
  const toStr = (d: Date) => d.toISOString().split("T")[0];
  const weekStartStr = toStr(weekStart);
  const weekEndStr = toStr(weekEnd);
  const yearMonth = formatYearMonth();

  const todayCount = transactions.filter(
    (tx) => tx.type === "expense" && tx.date === today,
  ).length;

  const weekCount = transactions.filter(
    (tx) =>
      tx.type === "expense" && tx.date >= weekStartStr && tx.date <= weekEndStr,
  ).length;

  // budget_kept: any group budget for this month that has expenses <= budget amount
  const monthExpenseByGroup: Record<string, number> = {};
  const monthStart = `${yearMonth}-01`;
  const monthEnd = `${yearMonth}-31`;
  transactions
    .filter((tx) => tx.type === "expense" && tx.date >= monthStart && tx.date <= monthEnd)
    .forEach((tx) => {
      const g = tx.categorySnapshot.groupKey ?? tx.categoryId;
      monthExpenseByGroup[g] = (monthExpenseByGroup[g] ?? 0) + tx.amount;
    });

  const groupBudgets = budgets.filter(
    (b) => b.yearMonth === yearMonth && b.categoryId !== null,
  );
  const budgetKept =
    groupBudgets.length > 0 &&
    groupBudgets.some((b) => {
      const spent = monthExpenseByGroup[b.categoryId!] ?? 0;
      return spent <= b.amount;
    });

  const reportViewed = isReportViewedThisWeek();

  const handleClaim = async (quest: Quest) => {
    if (!profile) return;
    markClaimed(quest.key);
    await addResources(profile.id, quest.rewardCoins, null, 0);
    await addExpAndLevel(profile.id, quest.rewardExp);
  };

  const daily = QUESTS.filter((q) => q.type === "daily");
  const weekly = QUESTS.filter((q) => q.type === "weekly");

  function QuestRow({ quest }: { quest: Quest }) {
    const progress = computeProgress(quest, todayCount, weekCount, reportViewed, budgetKept);
    const claimed = isClaimed(quest.key, quest.type);
    const done = progress >= quest.conditionValue;
    const pct = Math.min(100, Math.round((progress / quest.conditionValue) * 100));

    return (
      <div className="bg-white rounded-2xl p-3.5 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 leading-snug">
              {t(quest.key as Parameters<typeof t>[0])}
            </p>
            <p className="text-xs text-gray-400 mt-0.5 leading-snug">
              {t(`${quest.key}_desc` as Parameters<typeof t>[0])}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: done ? "#22c55e" : "#f59e0b",
                  }}
                />
              </div>
              <span className="text-[10px] text-gray-400 font-mono shrink-0">
                {progress}/{quest.conditionValue}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <div className="text-[10px] text-amber-600 font-semibold leading-none">
              +{quest.rewardCoins}💰 +{quest.rewardExp}EXP
            </div>
            {claimed ? (
              <span className="text-[11px] text-gray-400 font-semibold bg-gray-100 rounded-full px-2.5 py-1">
                {t("claimed")}
              </span>
            ) : done ? (
              <button
                onClick={() => handleClaim(quest)}
                className="text-[11px] font-bold bg-amber-500 text-white rounded-full px-2.5 py-1 active:scale-95 transition-transform"
              >
                {t("claim")}
              </button>
            ) : (
              <span className="text-[11px] text-gray-300 font-semibold bg-gray-50 rounded-full px-2.5 py-1">
                {t("claim")}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end" onClick={onClose}>
      <div
        className="w-full max-h-[88vh] flex flex-col bg-amber-50 rounded-t-3xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 shrink-0">
          <h2 className="text-base font-bold text-gray-800">
            📜 {t("title")}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-6 space-y-4">
          {/* Daily */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              {t("daily")}
            </p>
            <div className="space-y-2">
              {daily.map((q) => <QuestRow key={q.key} quest={q} />)}
            </div>
          </div>

          {/* Weekly */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              {t("weekly")}
            </p>
            <div className="space-y-2">
              {weekly.map((q) => <QuestRow key={q.key} quest={q} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

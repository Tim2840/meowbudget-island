"use client";

import { X, Scroll } from "lucide-react";
import { GameResourceIcon } from "@/components/ui/GameResourceIcon";
import { useTranslations } from "next-intl";
import { useQuestStore } from "@/stores/useQuestStore";
import { useWalletStore } from "@/stores/useWalletStore";
import { useProfileStore } from "@/stores/useProfileStore";
import { useTransactionStore } from "@/stores/useTransactionStore";
import { useBudgetStore } from "@/stores/useBudgetStore";
import { selectQuests } from "@/lib/questSelection";
import { getWeekRange, todayString, formatYearMonth } from "@/lib/streakUtils";
import type { Quest, QuestRarity, Transaction } from "@/types";

const RARITY_STYLE: Record<QuestRarity, { bg: string; text: string; border: string }> = {
  common: { bg: "#F3F4F6", text: "#6B7280", border: "#E5E7EB" },
  rare:   { bg: "#DBEAFE", text: "#2563EB", border: "#BFDBFE" },
  epic:   { bg: "#EDE9FE", text: "#7C3AED", border: "#DDD6FE" },
};

interface ProgressCtx {
  todayTxs: Transaction[];
  weekTxs: Transaction[];
  reportViewedToday: boolean;
  reportViewedWeek: boolean;
  budgetKept: boolean;
  streak: number;
}

function distinctGroups(txs: Transaction[]): number {
  const set = new Set(txs.map((tx) => tx.categorySnapshot.groupKey ?? tx.categoryId));
  return set.size;
}

function computeProgress(quest: Quest, ctx: ProgressCtx): number {
  const txs = quest.type === "daily" ? ctx.todayTxs : ctx.weekTxs;
  switch (quest.conditionType) {
    case "record_count":
      return txs.length;
    case "record_income":
      return txs.filter((tx) => tx.type === "income").length;
    case "record_note":
      return txs.filter((tx) => (tx.note ?? "").trim().length > 0).length;
    case "record_groups":
      return distinctGroups(txs);
    case "record_days":
      return new Set(txs.map((tx) => tx.date)).size;
    case "view_report":
      return (quest.type === "daily" ? ctx.reportViewedToday : ctx.reportViewedWeek) ? 1 : 0;
    case "category_budget_kept":
      return ctx.budgetKept ? 1 : 0;
    case "streak_days":
      return ctx.streak;
    default:
      return 0;
  }
}

interface Props {
  onClose: () => void;
}

export default function QuestSheet({ onClose }: Props) {
  const t = useTranslations("quest");
  const { isClaimed, markClaimed, isReportViewedToday, isReportViewedThisWeek } = useQuestStore();
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

  const todayTxs = transactions.filter((tx) => tx.date === today);
  const weekTxs = transactions.filter(
    (tx) => tx.date >= weekStartStr && tx.date <= weekEndStr,
  );

  // budget_kept: at least one group budget this month is within its limit
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
    groupBudgets.some((b) => (monthExpenseByGroup[b.categoryId!] ?? 0) <= b.amount);

  const ctx: ProgressCtx = {
    todayTxs,
    weekTxs,
    reportViewedToday: isReportViewedToday(),
    reportViewedWeek: isReportViewedThisWeek(),
    budgetKept,
    streak: profile?.currentStreak ?? 0,
  };

  // Deterministic daily/weekly draws (2 each), stable across restarts.
  const daily = selectQuests("daily", today, 2);
  const weekly = selectQuests("weekly", weekStartStr, 2);

  const handleClaim = async (quest: Quest) => {
    if (!profile) return;
    markClaimed(quest.key);
    await addResources(profile.id, quest.rewardCoins, null, 0);
    await addExpAndLevel(profile.id, quest.rewardExp);
  };

  function QuestRow({ quest }: { quest: Quest }) {
    const progress = computeProgress(quest, ctx);
    const claimed = isClaimed(quest.key, quest.type);
    const done = progress >= quest.conditionValue;
    const pct = Math.min(100, Math.round((progress / quest.conditionValue) * 100));
    const rs = RARITY_STYLE[quest.rarity];

    return (
      <div
        className="bg-white rounded-2xl p-3.5 shadow-sm border-l-4"
        style={{ borderLeftColor: rs.text }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span
                className="text-[9px] font-bold rounded-full px-1.5 py-0.5 leading-none shrink-0"
                style={{ backgroundColor: rs.bg, color: rs.text }}
              >
                {t(`rarity_${quest.rarity}` as Parameters<typeof t>[0])}
              </span>
              <p className="text-sm font-semibold text-gray-800 leading-snug truncate">
                {t(quest.key as Parameters<typeof t>[0])}
              </p>
            </div>
            <p className="text-xs text-gray-400 mt-0.5 leading-snug">
              {t(`${quest.key}_desc` as Parameters<typeof t>[0])}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: done ? "#22c55e" : "#f59e0b" }}
                />
              </div>
              <span className="text-[10px] text-gray-400 font-mono shrink-0">
                {progress}/{quest.conditionValue}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <div className="flex items-center gap-0.5 text-[10px] text-amber-600 font-semibold leading-none">
              +{quest.rewardCoins}<GameResourceIcon type="coins" size={9} />
              <span className="ml-0.5">+{quest.rewardExp}EXP</span>
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
          <h2 className="text-base font-bold text-gray-800 flex items-center gap-1.5">
            <Scroll size={16} className="text-amber-600 shrink-0" />
            {t("title")}
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
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              {t("daily")}
            </p>
            <div className="space-y-2">
              {daily.map((q) => <QuestRow key={q.key} quest={q} />)}
            </div>
          </div>

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

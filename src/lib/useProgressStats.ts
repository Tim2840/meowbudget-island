"use client";

import { useMemo } from "react";
import { useTransactionStore } from "@/stores/useTransactionStore";
import { useProfileStore } from "@/stores/useProfileStore";
import { useBudgetStore } from "@/stores/useBudgetStore";
import { useQuestStore } from "@/stores/useQuestStore";
import { useAchievementStore } from "@/stores/useAchievementStore";
import { getWeekRange, getMonthRange, todayString, formatYearMonth } from "@/lib/streakUtils";
import { countCatsOwned, countZonesUnlocked, type ProgressStats } from "@/lib/progressEngine";

const toDateStr = (d: Date) => d.toISOString().split("T")[0];

/** Aggregates live stats from all stores for achievement/quest evaluation. */
export function useProgressStats(): ProgressStats {
  const { transactions } = useTransactionStore();
  const { profile } = useProfileStore();
  const { budgets } = useBudgetStore();
  const { reportViewedDay, reportViewedWeek } = useQuestStore();
  const earned = useAchievementStore((s) => s.earned);

  return useMemo(() => {
    const level = profile?.level ?? 1;
    const today = todayString();
    const week = getWeekRange();
    const weekStartStr = toDateStr(week.start);
    const weekEndStr = toDateStr(week.end);
    const now = new Date();
    const month = getMonthRange(now.getFullYear(), now.getMonth() + 1);
    const yearMonth = formatYearMonth(now);

    const todayRecords = transactions.filter((t) => t.date === today).length;
    const weekRecords = transactions.filter(
      (t) => t.date >= weekStartStr && t.date <= weekEndStr
    ).length;

    // Budgets set this month
    const monthBudgets = budgets.filter((b) => b.yearMonth === yearMonth && b.amount > 0);
    const categoryBudgets = monthBudgets.filter((b) => b.categoryId !== null);

    // Spend per category this month
    const monthStart = toDateStr(month.start);
    const monthEnd = toDateStr(month.end);
    const spendByCat = new Map<string, number>();
    transactions.forEach((t) => {
      if (t.type !== "expense") return;
      if (t.date < monthStart || t.date > monthEnd) return;
      spendByCat.set(t.categoryId, (spendByCat.get(t.categoryId) ?? 0) + t.amount);
    });
    const budgetsKept = categoryBudgets.filter(
      (b) => (spendByCat.get(b.categoryId!) ?? 0) <= b.amount
    ).length;

    const earnedSet = new Set(Object.keys(earned));

    return {
      totalRecords: transactions.length,
      todayRecords,
      weekRecords,
      currentStreak: profile?.currentStreak ?? 0,
      longestStreak: profile?.longestStreak ?? 0,
      level,
      zonesUnlocked: countZonesUnlocked(level),
      catsOwned: countCatsOwned(level, earnedSet),
      budgetsSet: monthBudgets.length,
      budgetsKept,
      reportsViewedEver: reportViewedDay !== null,
      reportViewedThisWeek: reportViewedWeek === weekStartStr,
    };
  }, [transactions, profile, budgets, reportViewedDay, reportViewedWeek, earned]);
}

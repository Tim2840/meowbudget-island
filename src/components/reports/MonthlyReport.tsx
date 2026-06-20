"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Wallet } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import type { Transaction } from "@/types";
import { useBudgetStore } from "@/stores/useBudgetStore";
import { useCategoryName } from "@/components/record/CategoryName";
import BudgetSheet from "./BudgetSheet";

interface MonthlyReportProps {
  transactions: Transaction[];
  yearMonth: string; // 'YYYY-MM'
}

const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#FFB347"];

interface CatAgg {
  categoryId: string;
  emoji: string;
  nameKey: string;
  isCustom: boolean;
  total: number;
}

export default function MonthlyReport({ transactions, yearMonth }: MonthlyReportProps) {
  const t = useTranslations("reports");
  const catName = useCategoryName();
  const { getBudget, getMonthBudgets } = useBudgetStore();
  const [showBudget, setShowBudget] = useState(false);

  const expenses = transactions.filter((tx) => tx.type === "expense");
  const totalExpense = expenses.reduce((sum, tx) => sum + tx.amount, 0);
  const totalIncome = transactions.filter((tx) => tx.type === "income").reduce((sum, tx) => sum + tx.amount, 0);
  const balance = totalIncome - totalExpense;

  // Category ranking
  const catMap = new Map<string, CatAgg>();
  expenses.forEach((tx) => {
    const key = tx.categoryId;
    const e = catMap.get(key);
    if (e) {
      e.total += tx.amount;
    } else {
      catMap.set(key, {
        categoryId: key,
        emoji: tx.categorySnapshot.emoji,
        nameKey: tx.categorySnapshot.nameKey,
        isCustom: tx.categorySnapshot.isCustom,
        total: tx.amount,
      });
    }
  });
  const topCategories = Array.from(catMap.values()).sort((a, b) => b.total - a.total);
  const pieData = topCategories.slice(0, 7).map((c) => ({
    name: catName(c.nameKey, c.isCustom),
    value: c.total,
    emoji: c.emoji,
  }));

  // Budgets
  const totalBudget = getBudget(null, yearMonth)?.amount ?? 0;
  const categoryBudgets = getMonthBudgets(yearMonth).filter((b) => b.categoryId !== null && b.amount > 0);
  const hasAnyBudget = totalBudget > 0 || categoryBudgets.length > 0;

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-400">{yearMonth}</p>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-green-50 rounded-2xl p-3">
          <p className="text-[10px] text-green-500 font-medium mb-1">{t("income")}</p>
          <p className="text-lg font-bold text-green-600">{totalIncome.toLocaleString()}</p>
        </div>
        <div className="bg-red-50 rounded-2xl p-3">
          <p className="text-[10px] text-red-400 font-medium mb-1">{t("expense")}</p>
          <p className="text-lg font-bold text-red-600">{totalExpense.toLocaleString()}</p>
        </div>
        <div className={`rounded-2xl p-3 ${balance >= 0 ? "bg-blue-50" : "bg-orange-50"}`}>
          <p className="text-[10px] font-medium mb-1 text-gray-400">{t("balance")}</p>
          <p className={`text-lg font-bold ${balance >= 0 ? "text-blue-600" : "text-orange-600"}`}>
            {balance >= 0 ? "+" : ""}{balance.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Budget progress */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-600">{t("budget_progress")}</p>
          <button
            onClick={() => setShowBudget(true)}
            className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full hover:bg-amber-100 transition-colors"
          >
            <Wallet size={13} />
            {hasAnyBudget ? t("edit_budget") : t("set_budget")}
          </button>
        </div>

        {!hasAnyBudget ? (
          <p className="text-sm text-gray-400 py-2">{t("no_budget_hint")}</p>
        ) : (
          <div className="space-y-3">
            {totalBudget > 0 && (
              <BudgetBar
                label={t("monthly_total")}
                spent={totalExpense}
                budget={totalBudget}
                remainingLabel={t("budget_remaining")}
                overLabel={t("budget_over")}
                emphasize
              />
            )}
            {categoryBudgets.map((b) => {
              const agg = catMap.get(b.categoryId!);
              const emoji = agg?.emoji ?? "📦";
              const label = agg
                ? `${emoji} ${catName(agg.nameKey, agg.isCustom)}`
                : `${emoji} ${b.categoryId}`;
              return (
                <BudgetBar
                  key={b.id}
                  label={label}
                  spent={agg?.total ?? 0}
                  budget={b.amount}
                  remainingLabel={t("budget_remaining")}
                  overLabel={t("budget_over")}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Pie chart */}
      {pieData.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-sm font-semibold text-gray-600 mb-3">{t("top_categories")}</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                {pieData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => (typeof v === "number" ? v.toLocaleString() : v)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {topCategories.slice(0, 5).map((cat, idx) => (
              <div key={cat.categoryId} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="text-sm text-gray-600">{cat.emoji}</span>
                <span className="text-sm text-gray-600 flex-1 truncate">{catName(cat.nameKey, cat.isCustom)}</span>
                <span className="text-sm font-semibold">{cat.total.toLocaleString()}</span>
                <span className="text-xs text-gray-400 w-10 text-right">
                  {totalExpense > 0 ? `${Math.round((cat.total / totalExpense) * 100)}%` : "0%"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {showBudget && (
          <BudgetSheet key="budget-sheet" yearMonth={yearMonth} onClose={() => setShowBudget(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

interface BudgetBarProps {
  label: string;
  spent: number;
  budget: number;
  remainingLabel: string;
  overLabel: string;
  emphasize?: boolean;
}

function BudgetBar({ label, spent, budget, remainingLabel, overLabel, emphasize }: BudgetBarProps) {
  const pct = budget > 0 ? (spent / budget) * 100 : 0;
  const over = spent > budget;
  const remaining = budget - spent;
  const barColor = over ? "bg-red-500" : pct >= 80 ? "bg-amber-500" : "bg-emerald-500";

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className={`text-gray-600 ${emphasize ? "text-sm font-semibold" : "text-xs"}`}>{label}</span>
        <span className="text-xs text-gray-500">
          {spent.toLocaleString()} / {budget.toLocaleString()}
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>
      <p className={`text-[11px] mt-0.5 text-right ${over ? "text-red-500" : "text-gray-400"}`}>
        {over
          ? `${overLabel} ${Math.abs(remaining).toLocaleString()}`
          : `${remaining.toLocaleString()} ${remainingLabel}`}
      </p>
    </div>
  );
}

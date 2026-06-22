"use client";

import { useTranslations } from "next-intl";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { Transaction } from "@/types";
import { LEGACY_NAMEKEY_TO_GROUP, DEFAULT_GROUPS } from "@/lib/constants";
import { useCategoryName } from "../record/CategoryName";

interface MonthlyReportProps {
  transactions: Transaction[];
  yearMonth: string;
}

function resolveGroupKey(tx: Transaction): string {
  if (tx.categorySnapshot.groupKey) return tx.categorySnapshot.groupKey;
  return LEGACY_NAMEKEY_TO_GROUP[tx.categorySnapshot.nameKey] ?? tx.categorySnapshot.nameKey;
}

function resolveGroupNameKey(tx: Transaction): string {
  if (tx.categorySnapshot.groupNameKey) return tx.categorySnapshot.groupNameKey;
  const groupKey = resolveGroupKey(tx);
  return DEFAULT_GROUPS.find((g) => g.key === groupKey)?.nameKey ?? tx.categorySnapshot.nameKey;
}

export default function MonthlyReport({ transactions, yearMonth }: MonthlyReportProps) {
  const t = useTranslations("reports");
  const getCategoryName = useCategoryName();

  const expenses = transactions.filter((tx) => tx.type === "expense");
  const totalExpense = expenses.reduce((sum, tx) => sum + tx.amount, 0);
  const totalIncome = transactions.filter((tx) => tx.type === "income").reduce((sum, tx) => sum + tx.amount, 0);
  const balance = totalIncome - totalExpense;

  // 依大類彙總支出
  const expenseGroupMap = new Map<string, { emoji: string; name: string; color: string; total: number }>();
  expenses.forEach((tx) => {
    const gKey = resolveGroupKey(tx);
    const gNameKey = resolveGroupNameKey(tx);
    const e = expenseGroupMap.get(gKey);
    if (e) {
      e.total += tx.amount;
    } else {
      const group = DEFAULT_GROUPS.find((g) => g.key === gKey);
      expenseGroupMap.set(gKey, {
        emoji: group?.emoji ?? tx.categorySnapshot.emoji,
        name: getCategoryName(gNameKey, false),
        color: group?.color ?? tx.categorySnapshot.color,
        total: tx.amount,
      });
    }
  });
  const topExpense = Array.from(expenseGroupMap.values()).sort((a, b) => b.total - a.total);

  // 依大類彙總收入
  const incomeGroupMap = new Map<string, { emoji: string; name: string; color: string; total: number }>();
  transactions.filter((tx) => tx.type === "income").forEach((tx) => {
    const gKey = resolveGroupKey(tx);
    const gNameKey = resolveGroupNameKey(tx);
    const e = incomeGroupMap.get(gKey);
    if (e) {
      e.total += tx.amount;
    } else {
      const group = DEFAULT_GROUPS.find((g) => g.key === gKey);
      incomeGroupMap.set(gKey, {
        emoji: group?.emoji ?? tx.categorySnapshot.emoji,
        name: getCategoryName(gNameKey, false),
        color: group?.color ?? tx.categorySnapshot.color,
        total: tx.amount,
      });
    }
  });
  const topIncome = Array.from(incomeGroupMap.values()).sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-4 select-none">
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

      {/* 支出圓餅 */}
      {topExpense.length > 0 && (
        <DonutCard title={t("top_categories")} data={topExpense} total={totalExpense} />
      )}

      {/* 收入分析圓餅 */}
      {topIncome.length > 0 && (
        <DonutCard title={t("income_categories")} data={topIncome} total={totalIncome} />
      )}

      {transactions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <span className="text-4xl mb-3">📊</span>
          <p>{t("no_data")}</p>
        </div>
      )}
    </div>
  );
}

interface GroupItem { emoji: string; name: string; color: string; total: number }

function DonutCard({ title, data, total }: { title: string; data: GroupItem[]; total: number }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <p className="text-sm font-semibold text-gray-600 mb-3">{title}</p>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data.map((d) => ({ name: d.name, value: d.total }))}
            cx="50%" cy="50%"
            innerRadius={50} outerRadius={75}
            dataKey="value"
          >
            {data.map((item, idx) => <Cell key={idx} fill={item.color} />)}
          </Pie>
          <Tooltip formatter={(v) => (typeof v === "number" ? v.toLocaleString() : v)} />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2 mt-2">
        {data.slice(0, 6).map((cat, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
            <span className="text-sm text-gray-600">{cat.emoji}</span>
            <span className="text-sm text-gray-600 flex-1 truncate">{cat.name}</span>
            <span className="text-sm font-semibold">{cat.total.toLocaleString()}</span>
            <span className="text-xs text-gray-400 w-10 text-right">
              {total > 0 ? `${Math.round((cat.total / total) * 100)}%` : "0%"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

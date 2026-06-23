"use client";

import { useTranslations } from "next-intl";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { Transaction } from "@/types";
import { LEGACY_NAMEKEY_TO_GROUP, DEFAULT_GROUPS } from "@/lib/constants";
import { useCategoryName } from "../record/CategoryName";
import { EmojiIcon } from "@/components/ui/EmojiIcon";

interface DailyReportProps {
  transactions: Transaction[];
  date: string;
}

/** 取得交易對應的大類 key（相容舊格式） */
function resolveGroupKey(tx: Transaction): string {
  if (tx.categorySnapshot.groupKey) return tx.categorySnapshot.groupKey;
  return LEGACY_NAMEKEY_TO_GROUP[tx.categorySnapshot.nameKey] ?? tx.categorySnapshot.nameKey;
}

/** 取得大類 nameKey（相容舊格式） */
function resolveGroupNameKey(tx: Transaction): string {
  if (tx.categorySnapshot.groupNameKey) return tx.categorySnapshot.groupNameKey;
  const groupKey = resolveGroupKey(tx);
  return DEFAULT_GROUPS.find((g) => g.key === groupKey)?.nameKey ?? tx.categorySnapshot.nameKey;
}

export default function DailyReport({ transactions, date }: DailyReportProps) {
  const t = useTranslations("reports");
  const getCategoryName = useCategoryName();

  const expenses = transactions.filter((tx) => tx.type === "expense");
  const income = transactions.filter((tx) => tx.type === "income");

  const totalExpense = expenses.reduce((sum, tx) => sum + tx.amount, 0);
  const totalIncome = income.reduce((sum, tx) => sum + tx.amount, 0);

  // 依大類彙總支出
  const expenseGroupMap = new Map<string, { name: string; emoji: string; color: string; total: number }>();
  expenses.forEach((tx) => {
    const gKey = resolveGroupKey(tx);
    const gNameKey = resolveGroupNameKey(tx);
    const existing = expenseGroupMap.get(gKey);
    if (existing) {
      existing.total += tx.amount;
    } else {
      const group = DEFAULT_GROUPS.find((g) => g.key === gKey);
      expenseGroupMap.set(gKey, {
        name: getCategoryName(gNameKey, false),
        emoji: group?.emoji ?? tx.categorySnapshot.emoji,
        color: group?.color ?? tx.categorySnapshot.color,
        total: tx.amount,
      });
    }
  });
  const expensePieData = Array.from(expenseGroupMap.values()).sort((a, b) => b.total - a.total);

  // 依大類彙總收入
  const incomeGroupMap = new Map<string, { name: string; emoji: string; color: string; total: number }>();
  income.forEach((tx) => {
    const gKey = resolveGroupKey(tx);
    const gNameKey = resolveGroupNameKey(tx);
    const existing = incomeGroupMap.get(gKey);
    if (existing) {
      existing.total += tx.amount;
    } else {
      const group = DEFAULT_GROUPS.find((g) => g.key === gKey);
      incomeGroupMap.set(gKey, {
        name: getCategoryName(gNameKey, false),
        emoji: group?.emoji ?? tx.categorySnapshot.emoji,
        color: group?.color ?? tx.categorySnapshot.color,
        total: tx.amount,
      });
    }
  });
  const incomePieData = Array.from(incomeGroupMap.values()).sort((a, b) => b.total - a.total);

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <span className="text-5xl mb-3">📊</span>
        <p>{t("no_data")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 select-none">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-red-50 rounded-2xl p-4">
          <p className="text-xs text-red-400 font-medium mb-1">{t("expense")}</p>
          <p className="text-2xl font-bold text-red-600">{totalExpense.toLocaleString()}</p>
        </div>
        <div className="bg-green-50 rounded-2xl p-4">
          <p className="text-xs text-green-500 font-medium mb-1">{t("income")}</p>
          <p className="text-2xl font-bold text-green-600">{totalIncome.toLocaleString()}</p>
        </div>
      </div>

      {/* 支出圓餅 */}
      {expensePieData.length > 0 && (
        <PieCard title={t("top_categories")} data={expensePieData} total={totalExpense} />
      )}

      {/* 收入分析圓餅 */}
      {incomePieData.length > 0 && (
        <PieCard title={t("income_categories")} data={incomePieData} total={totalIncome} />
      )}
    </div>
  );
}

interface PieItem { name: string; emoji: string; color: string; total: number }

function PieCard({ title, data, total }: { title: string; data: PieItem[]; total: number }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <p className="text-sm font-semibold text-gray-600 mb-3">{title}</p>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie data={data.map((d) => ({ name: d.name, value: d.total }))} cx="50%" cy="50%" outerRadius={75} dataKey="value">
            {data.map((item, idx) => (
              <Cell key={idx} fill={item.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => (typeof value === "number" ? value.toLocaleString() : value)} />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2 mt-2">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <span className="flex items-center gap-1 text-sm text-gray-600">
              <EmojiIcon emoji={item.emoji} size={14} />
              {item.name}
            </span>
            <span className="ml-auto text-sm font-semibold">{item.total.toLocaleString()}</span>
            <span className="text-xs text-gray-400 w-10 text-right">
              {total > 0 ? `${Math.round((item.total / total) * 100)}%` : "0%"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

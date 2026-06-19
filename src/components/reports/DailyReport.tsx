"use client";

import { useTranslations } from "next-intl";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { Transaction } from "@/types";

interface DailyReportProps {
  transactions: Transaction[];
  date: string;
}

const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"];

export default function DailyReport({ transactions, date }: DailyReportProps) {
  const t = useTranslations("reports");

  const expenses = transactions.filter((tx) => tx.type === "expense");
  const income = transactions.filter((tx) => tx.type === "income");

  const totalExpense = expenses.reduce((sum, tx) => sum + tx.amount, 0);
  const totalIncome = income.reduce((sum, tx) => sum + tx.amount, 0);

  // Group by category for pie chart
  const categoryMap = new Map<string, { name: string; emoji: string; total: number }>();
  expenses.forEach((tx) => {
    const key = tx.categoryId;
    const existing = categoryMap.get(key);
    if (existing) {
      existing.total += tx.amount;
    } else {
      categoryMap.set(key, {
        name: tx.categorySnapshot.nameKey,
        emoji: tx.categorySnapshot.emoji,
        total: tx.amount,
      });
    }
  });

  const pieData = Array.from(categoryMap.values()).map((v) => ({ name: v.name, value: v.total, emoji: v.emoji }));

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <span className="text-5xl mb-3">📊</span>
        <p>{t("no_data")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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

      {/* Pie chart */}
      {pieData.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-sm font-semibold text-gray-600 mb-3">{t("top_categories")}</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                {pieData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => (typeof value === "number" ? value.toLocaleString() : value)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {pieData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="text-sm text-gray-600">{item.emoji} {item.name}</span>
                <span className="ml-auto text-sm font-semibold">{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

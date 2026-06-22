"use client";

import { useTranslations } from "next-intl";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { Transaction } from "@/types";
import { useCategoryName } from "../record/CategoryName";

interface MonthlyReportProps {
  transactions: Transaction[];
  yearMonth: string;
}

const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#FFB347"];

export default function MonthlyReport({ transactions, yearMonth }: MonthlyReportProps) {
  const t = useTranslations("reports");
  const getCategoryName = useCategoryName();

  const expenses = transactions.filter((tx) => tx.type === "expense");
  const totalExpense = expenses.reduce((sum, tx) => sum + tx.amount, 0);
  const totalIncome = transactions.filter((tx) => tx.type === "income").reduce((sum, tx) => sum + tx.amount, 0);
  const balance = totalIncome - totalExpense;

  // Category ranking
  const catMap = new Map<string, { emoji: string; name: string; total: number }>();
  expenses.forEach((tx) => {
    const key = tx.categoryId;
    const e = catMap.get(key);
    if (e) { e.total += tx.amount; }
    else { catMap.set(key, { emoji: tx.categorySnapshot.emoji, name: getCategoryName(tx.categorySnapshot.nameKey, tx.categorySnapshot.isCustom), total: tx.amount }); }
  });
  const topCategories = Array.from(catMap.values()).sort((a, b) => b.total - a.total);
  const pieData = topCategories.slice(0, 7).map((c) => ({ name: c.name, value: c.total, emoji: c.emoji }));

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
              <div key={idx} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="text-sm text-gray-600">{cat.emoji}</span>
                <span className="text-sm text-gray-600 flex-1 truncate">{cat.name}</span>
                <span className="text-sm font-semibold">{cat.total.toLocaleString()}</span>
                <span className="text-xs text-gray-400 w-10 text-right">
                  {totalExpense > 0 ? `${Math.round((cat.total / totalExpense) * 100)}%` : "0%"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

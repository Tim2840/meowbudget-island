"use client";

import { useTranslations } from "next-intl";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useProfileStore } from "@/stores/useProfileStore";
import { Flame } from "lucide-react";
import type { Transaction } from "@/types";

interface WeeklyReportProps {
  transactions: Transaction[];
  weekStart: Date;
  weekEnd: Date;
}

const DAY_KEYS_ZH = ["一", "二", "三", "四", "五", "六", "日"];
const DAY_KEYS_EN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function WeeklyReport({ transactions, weekStart }: WeeklyReportProps) {
  const t = useTranslations("reports");
  const { profile } = useProfileStore();

  // Build 7-day data (Monday to Sunday)
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d.toISOString().split("T")[0];
  });

  const dailyData = days.map((date, idx) => {
    const dayTxs = transactions.filter((tx) => tx.date === date);
    const expense = dayTxs.filter((tx) => tx.type === "expense").reduce((s, tx) => s + tx.amount, 0);
    return { day: DAY_KEYS_ZH[idx], expense };
  });

  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((s, tx) => s + tx.amount, 0);
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, tx) => s + tx.amount, 0);

  return (
    <div className="space-y-4">
      {/* Streak status */}
      <div className="bg-orange-50 rounded-2xl p-4 flex items-center gap-3">
        <Flame size={28} className="text-orange-500" />
        <div>
          <p className="text-sm text-orange-400 font-medium">{t("streak_status")}</p>
          <p className="text-2xl font-bold text-orange-600">{profile?.currentStreak ?? 0} {t("day_unit")}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs text-gray-400">{t("longest")}</p>
          <p className="text-lg font-bold text-gray-500">{profile?.longestStreak ?? 0}</p>
        </div>
      </div>

      {/* Weekly summary */}
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

      {/* Bar chart */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <p className="text-sm font-semibold text-gray-600 mb-3">{t("daily_trend")}</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={dailyData} barSize={28}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <YAxis hide />
            <Tooltip formatter={(v) => (typeof v === "number" ? v.toLocaleString() : v)} />
            <Bar dataKey="expense" fill="#FF6B6B" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

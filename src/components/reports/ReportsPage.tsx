"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useTransactionStore } from "@/stores/useTransactionStore";
import { useQuestStore } from "@/stores/useQuestStore";
import { getWeekRange, getMonthRange, todayString, formatYearMonth } from "@/lib/streakUtils";
import DailyReport from "./DailyReport";
import WeeklyReport from "./WeeklyReport";
import MonthlyReport from "./MonthlyReport";

type ReportTab = "daily" | "weekly" | "monthly";

export default function ReportsPage() {
  const t = useTranslations("reports");
  const [activeTab, setActiveTab] = useState<ReportTab>("daily");
  const { getByDateRange } = useTransactionStore();

  const markReportViewed = useQuestStore((s) => s.markReportViewed);

  const today = todayString();
  const weekRange = getWeekRange();
  const now = new Date();
  const monthRange = getMonthRange(now.getFullYear(), now.getMonth() + 1);

  const toDateStr = (d: Date) => d.toISOString().split("T")[0];

  // Track report views for the analyst achievement & weekly view-report quest.
  useEffect(() => {
    markReportViewed(today, toDateStr(weekRange.start));
  }, [markReportViewed, today]); // eslint-disable-line react-hooks/exhaustive-deps

  const dailyTxs = getByDateRange(today, today);
  const weeklyTxs = getByDateRange(toDateStr(weekRange.start), toDateStr(weekRange.end));
  const monthlyTxs = getByDateRange(toDateStr(monthRange.start), toDateStr(monthRange.end));

  const tabs: ReportTab[] = ["daily", "weekly", "monthly"];

  return (
    <div className="flex flex-col min-h-full">
      {/* Tab bar */}
      <div className="bg-white border-b border-gray-100 px-4 pt-4 pb-0">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">{t("title")}</h1>
        <div className="flex gap-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-amber-500 text-amber-600"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {t(tab)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4 overflow-y-auto">
        {activeTab === "daily" && <DailyReport transactions={dailyTxs} date={today} />}
        {activeTab === "weekly" && <WeeklyReport transactions={weeklyTxs} weekStart={weekRange.start} weekEnd={weekRange.end} />}
        {activeTab === "monthly" && <MonthlyReport transactions={monthlyTxs} yearMonth={formatYearMonth(now)} />}
      </div>
    </div>
  );
}

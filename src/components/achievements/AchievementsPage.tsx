"use client";

import { useTranslations } from "next-intl";
import { Lock, Trophy } from "lucide-react";
import { ACHIEVEMENTS } from "@/lib/constants";
import { evaluateAchievements } from "@/lib/progressEngine";
import { useProgressStats } from "@/lib/useProgressStats";
import { useAchievementStore } from "@/stores/useAchievementStore";
import type { Achievement } from "@/types";

const CATEGORY_ORDER: Achievement["category"][] = [
  "recording", "streak", "island", "cats", "finance", "social",
];

const CATEGORY_LABEL: Record<Achievement["category"], string> = {
  recording: "記帳", streak: "連續", island: "島嶼",
  cats: "貓咪", finance: "理財", social: "社群",
};

export default function AchievementsPage() {
  const t = useTranslations("achievement");
  const stats = useProgressStats();
  const evaluated = evaluateAchievements(stats);
  const earned = useAchievementStore((s) => s.earned);

  const earnedCount = Object.keys(earned).length;
  const visible = ACHIEVEMENTS.filter((a) => !a.isHidden || earned[a.key]);

  const byCategory = CATEGORY_ORDER.map((cat) => ({
    cat,
    items: visible.filter((a) => a.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="flex flex-col min-h-full bg-amber-50">
      {/* Header */}
      <div className="px-4 pt-5 pb-4 bg-gradient-to-b from-amber-400 to-amber-300">
        <div className="flex items-center gap-2">
          <Trophy className="text-white" size={24} />
          <h1 className="text-2xl font-bold text-white drop-shadow">成就</h1>
        </div>
        <p className="text-sm text-amber-50 mt-1">
          已解鎖 {earnedCount} / {ACHIEVEMENTS.length}
        </p>
      </div>

      <div className="flex-1 px-4 py-4 space-y-5">
        {byCategory.map(({ cat, items }) => (
          <div key={cat}>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              {CATEGORY_LABEL[cat]}
            </p>
            <div className="space-y-2">
              {items.map((a) => {
                const prog = evaluated[a.key];
                const isEarned = !!earned[a.key];
                const pct = prog.target > 0 ? (prog.progress / prog.target) * 100 : 0;
                return (
                  <div
                    key={a.key}
                    className={`bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 ${
                      isEarned ? "" : "opacity-80"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-2xl ${
                        isEarned ? "bg-amber-100" : "bg-gray-100"
                      }`}
                    >
                      {isEarned ? "🏆" : <Lock size={18} className="text-gray-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold ${isEarned ? "text-gray-800" : "text-gray-500"}`}>
                        {t(a.nameKey.replace("achievement.", "") as Parameters<typeof t>[0])}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {t(a.descriptionKey.replace("achievement.", "") as Parameters<typeof t>[0])}
                      </p>
                      {!isEarned && (
                        <div className="mt-1.5 flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-400 rounded-full transition-all"
                              style={{ width: `${Math.min(100, pct)}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-gray-400 shrink-0">
                            {prog.progress}/{prog.target}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-amber-500">+{a.rewardCoins}🪙</p>
                      <p className="text-[10px] text-gray-400">+{a.rewardExp} EXP</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

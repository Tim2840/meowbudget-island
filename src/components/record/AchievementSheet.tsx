"use client";

import { X, PenLine, Flame, Compass, Cat, Coins, Lock, Trophy, Clock } from "lucide-react";
import type { LucideProps } from "lucide-react";
import { useTranslations } from "next-intl";
import { ACHIEVEMENTS } from "@/lib/constants";
import { computeProgress } from "@/lib/achievementEngine";
import { useAchievementStore } from "@/stores/useAchievementStore";
import { useProfileStore } from "@/stores/useProfileStore";
import { useTransactionStore } from "@/stores/useTransactionStore";
import { useBudgetStore } from "@/stores/useBudgetStore";
import type { Achievement } from "@/types";

const CATEGORY_ICONS: Record<string, { Icon: React.ComponentType<LucideProps>; color: string }> = {
  recording: { Icon: PenLine, color: "#3B82F6" },
  streak:    { Icon: Flame,   color: "#F97316" },
  island:    { Icon: Compass, color: "#0891B2" },
  cats:      { Icon: Cat,     color: "#A855F7" },
  finance:   { Icon: Coins,   color: "#F59E0B" },
};

interface Props {
  onClose: () => void;
}

export default function AchievementSheet({ onClose }: Props) {
  const t = useTranslations("achievement");
  const { isEarned } = useAchievementStore();
  const profile = useProfileStore((s) => s.profile);
  const transactions = useTransactionStore((s) => s.transactions);
  const budgets = useBudgetStore((s) => s.budgets);

  const params = {
    totalRecords: transactions.length,
    streak: profile?.currentStreak ?? 0,
    level: profile?.level ?? 1,
    budgetCount: budgets.length,
  };

  const categories = ["recording", "streak", "island", "cats", "finance"] as const;

  function AchievementRow({ ach }: { ach: Achievement }) {
    const earned = isEarned(ach.key);
    const hidden = ach.isHidden && !earned;
    const progress = computeProgress(ach, params);
    const pct = Math.min(100, Math.round((progress / ach.conditionValue) * 100));

    return (
      <div className={`flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0 ${!earned ? "opacity-60" : ""}`}>
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: earned ? "#FEF3C7" : "#F3F4F6" }}
        >
          {hidden
            ? <Lock size={18} className="text-gray-400" />
            : earned
            ? <Trophy size={18} className="text-amber-500" />
            : <Clock size={18} className="text-gray-400" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 leading-snug">
            {hidden ? "???" : t(ach.nameKey.replace("achievement.", "") as Parameters<typeof t>[0])}
          </p>
          {!hidden && (
            <p className="text-[11px] text-gray-400 leading-snug mt-0.5">
              {t(ach.descriptionKey.replace("achievement.", "") as Parameters<typeof t>[0])}
            </p>
          )}
          {!earned && !hidden && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-400 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-[10px] text-gray-400 font-mono">{progress}/{ach.conditionValue}</span>
            </div>
          )}
        </div>
        {earned && (
          <div className="text-[10px] text-amber-600 font-bold shrink-0 bg-amber-100 rounded-full px-2 py-0.5">
            {t("earned_badge")}
          </div>
        )}
        {!earned && !hidden && (
          <div className="text-[10px] text-gray-400 shrink-0 text-right">
            <div className="flex items-center gap-0.5">+{ach.rewardCoins}<Coins size={9} className="text-amber-500" /></div>
            <div>+{ach.rewardExp}EXP</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end" onClick={onClose}>
      <div
        className="w-full max-h-[88vh] flex flex-col bg-white rounded-t-3xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 shrink-0">
          <h2 className="text-base font-bold text-gray-800 flex items-center gap-1.5">
            <Trophy size={16} className="text-amber-500 shrink-0" />
            {t("title")}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable list grouped by category */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-6 space-y-4">
          {categories.map((cat) => {
            const items = ACHIEVEMENTS.filter((a) => a.category === cat);
            if (items.length === 0) return null;
            return (
              <div key={cat}>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  {(() => {
                    const cfg = CATEGORY_ICONS[cat];
                    return cfg ? <cfg.Icon size={12} color={cfg.color} /> : null;
                  })()}
                  {t(`cat_${cat}` as Parameters<typeof t>[0])}
                </p>
                <div className="bg-gray-50 rounded-2xl px-3">
                  {items.map((ach) => (
                    <AchievementRow key={ach.key} ach={ach} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

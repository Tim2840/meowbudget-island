"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Trophy } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { evaluateAchievements } from "@/lib/progressEngine";
import { useProgressStats } from "@/lib/useProgressStats";
import { useAchievementStore } from "@/stores/useAchievementStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useWalletStore } from "@/stores/useWalletStore";
import { useProfileStore } from "@/stores/useProfileStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import type { Achievement } from "@/types";

export default function ProgressTracker() {
  const t = useTranslations("achievement");
  const stats = useProgressStats();
  const { user } = useAuthStore();
  const sync = useAchievementStore((s) => s.sync);
  const markSeen = useAchievementStore((s) => s.markSeen);
  const { addResources } = useWalletStore();
  const { addExpAndLevel } = useProfileStore();
  const { animationsEnabled } = useSettingsStore();
  const [toasts, setToasts] = useState<Achievement[]>([]);

  const sig = [
    stats.totalRecords, stats.longestStreak, stats.zonesUnlocked,
    stats.catsOwned, stats.budgetsSet, stats.budgetsKept,
    stats.reportsViewedEver, user?.id,
  ].join("|");

  const run = useCallback(() => {
    if (!user) return;
    const evaluated = evaluateAchievements(stats);
    const newly = sync(evaluated);
    if (newly.length === 0) return;
    newly.forEach((a) => {
      addResources(user.id, a.rewardCoins, null, 0);
      addExpAndLevel(user.id, a.rewardExp);
    });
    setToasts((prev) => [...prev, ...newly]);
    markSeen(newly.map((a) => a.key));
    newly.forEach((a) => {
      setTimeout(() => setToasts((prev) => prev.filter((x) => x.key !== a.key)), 4000);
    });
  }, [sig]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { run(); }, [run]);

  const slideTransition = animationsEnabled
    ? { type: "spring" as const, damping: 28, stiffness: 300 }
    : { duration: 0 };

  return (
    <div className="fixed bottom-24 right-4 z-[100] flex flex-col items-end gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((a) => (
          <motion.div
            key={a.key}
            initial={{ x: "110%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "110%", opacity: 0 }}
            transition={slideTransition}
            className="bg-white rounded-2xl shadow-lg border border-amber-200 px-4 py-3 flex items-center gap-3 max-w-[280px] w-full"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl shrink-0">
              🏆
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-amber-500">{t("toast_title")}</p>
              <p className="font-bold text-gray-800 truncate">
                {t(a.nameKey.replace("achievement.", "") as Parameters<typeof t>[0])}
              </p>
            </div>
            <Trophy className="text-amber-400 ml-auto shrink-0" size={20} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

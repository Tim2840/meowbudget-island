"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Target, Check } from "lucide-react";
import { QUESTS } from "@/lib/constants";
import { evaluateQuests } from "@/lib/progressEngine";
import { useProgressStats } from "@/lib/useProgressStats";
import { useQuestStore } from "@/stores/useQuestStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useWalletStore } from "@/stores/useWalletStore";
import { useProfileStore } from "@/stores/useProfileStore";
import { getWeekRange, todayString } from "@/lib/streakUtils";
import type { Quest } from "@/types";

const toDateStr = (d: Date) => d.toISOString().split("T")[0];

export default function QuestsPage() {
  const t = useTranslations("quest");
  const stats = useProgressStats();
  const evaluated = evaluateQuests(stats);
  const { isClaimed, claim } = useQuestStore();
  const { user } = useAuthStore();
  const { addResources } = useWalletStore();
  const { addExpAndLevel } = useProfileStore();
  const [claiming, setClaiming] = useState<string | null>(null);

  const today = todayString();
  const weekStart = toDateStr(getWeekRange().start);
  const periodId = (q: Quest) => (q.type === "daily" ? today : weekStart);

  const handleClaim = async (q: Quest) => {
    if (!user) return;
    setClaiming(q.key);
    await addResources(user.id, q.rewardCoins, q.rewardResource?.type ?? null, q.rewardResource?.amount ?? 0);
    await addExpAndLevel(user.id, q.rewardExp);
    claim(q.key, periodId(q));
    setClaiming(null);
  };

  const groups: { type: Quest["type"]; labelKey: "group_daily" | "group_weekly" }[] = [
    { type: "daily", labelKey: "group_daily" },
    { type: "weekly", labelKey: "group_weekly" },
  ];

  return (
    <div className="flex flex-col min-h-full bg-amber-50">
      {/* Header */}
      <div className="px-4 pt-5 pb-4 bg-gradient-to-b from-emerald-400 to-emerald-300">
        <div className="flex items-center gap-2">
          <Target className="text-white" size={24} />
          <h1 className="text-2xl font-bold text-white drop-shadow">{t("page_title")}</h1>
        </div>
        <p className="text-sm text-emerald-50 mt-1">{t("page_subtitle")}</p>
      </div>

      <div className="flex-1 px-4 py-4 space-y-5">
        {groups.map(({ type, labelKey }) => {
          const items = QUESTS.filter((q) => q.type === type);
          if (items.length === 0) return null;
          return (
            <div key={type}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {t(labelKey)}
              </p>
              <div className="space-y-2">
                {items.map((q) => {
                  const prog = evaluated[q.key];
                  const claimed = isClaimed(q.key, periodId(q));
                  const pct = prog.target > 0 ? (prog.progress / prog.target) * 100 : 0;
                  return (
                    <div key={q.key} className="bg-white rounded-2xl p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800">
                            {t(q.titleKey.replace("quest.", "") as Parameters<typeof t>[0])}
                          </p>
                          <p className="text-xs text-gray-400">
                            {t(q.descriptionKey.replace("quest.", "") as Parameters<typeof t>[0])}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-bold text-amber-500">+{q.rewardCoins}🪙</p>
                          <p className="text-[10px] text-gray-400">+{q.rewardExp} EXP</p>
                        </div>
                      </div>

                      <div className="mt-2.5 flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${prog.complete ? "bg-emerald-500" : "bg-amber-400"}`}
                            style={{ width: `${Math.min(100, pct)}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-gray-400 shrink-0 w-10 text-right">
                          {prog.progress}/{prog.target}
                        </span>
                        {claimed ? (
                          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full shrink-0">
                            <Check size={13} /> {t("claimed")}
                          </span>
                        ) : (
                          <button
                            disabled={!prog.complete || claiming === q.key}
                            onClick={() => handleClaim(q)}
                            className="text-xs font-bold px-4 py-1.5 rounded-full shrink-0 transition-colors disabled:bg-gray-100 disabled:text-gray-300 bg-amber-500 text-white"
                          >
                            {claiming === q.key ? "..." : t("claim")}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

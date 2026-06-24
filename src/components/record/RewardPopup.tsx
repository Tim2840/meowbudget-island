"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Flame, TrendingUp, Trophy, Sparkles } from "lucide-react";
import { GameResourceIcon } from "@/components/ui/GameResourceIcon";
import { ACHIEVEMENTS } from "@/lib/constants";
import type { RewardResult, ResourceType } from "@/types";

interface RewardPopupProps {
  reward: RewardResult;
  onClose: () => void;
}

export default function RewardPopup({ reward, onClose }: RewardPopupProps) {
  const t = useTranslations("record");
  const ta = useTranslations("achievement");

  useEffect(() => {
    const timer = setTimeout(onClose, 2800);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none"
      onClick={onClose}
    >
      <div className="pointer-events-auto bg-white rounded-3xl shadow-2xl p-6 max-w-xs w-full max-h-[90vh] overflow-y-auto flex flex-col items-center gap-3 animate-bounce-in">
        <Sparkles size={28} className="text-amber-400" />
        <h3 className="text-xl font-bold text-amber-700">{t("reward_title")}</h3>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <GameResourceIcon type="coins" size={26} />
            <span className="text-lg font-bold text-amber-600">+{reward.coins}</span>
          </div>
          {reward.resourceType && reward.resourceAmount > 0 && (
            <div className="flex items-center gap-1.5">
              <GameResourceIcon type={reward.resourceType as ResourceType} size={26} />
              <span className="text-lg font-bold text-green-600">+{reward.resourceAmount}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <TrendingUp size={18} className="text-blue-500" />
            <span className="text-lg font-bold text-blue-500">+{reward.expGained} EXP</span>
          </div>
        </div>

        {reward.streakBonus && (
          <div className="flex items-center gap-1.5 text-orange-500">
            <Flame size={16} />
            <span className="text-sm font-semibold">{t("streak_bonus")}</span>
          </div>
        )}

        {reward.levelUp && (
          <div className="bg-amber-100 text-amber-700 rounded-xl px-4 py-2 text-base font-bold flex items-center gap-2">
            <Sparkles size={18} className="text-amber-500" />
            Level Up! → Lv.{reward.newLevel}
          </div>
        )}

        {reward.newAchievements && reward.newAchievements.length > 0 && (
          <div className="w-full space-y-1.5">
            <p className="text-xs font-semibold text-gray-400 text-center">{t("new_achievement")}</p>
            {reward.newAchievements.map((key) => {
              const ach = ACHIEVEMENTS.find((a) => a.key === key);
              if (!ach) return null;
              return (
                <div key={key} className="flex items-center gap-2 bg-yellow-50 rounded-xl px-3 py-2">
                  <Trophy size={20} className="text-amber-500 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-amber-700">
                      {ta(ach.nameKey.replace("achievement.", "") as Parameters<typeof ta>[0])}
                    </p>
                    <p className="text-[10px] text-gray-500 flex items-center gap-0.5">
                      +{ach.rewardCoins}<GameResourceIcon type="coins" size={9} /> +{ach.rewardExp}EXP
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

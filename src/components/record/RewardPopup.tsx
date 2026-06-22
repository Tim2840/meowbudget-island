"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Flame, TrendingUp } from "lucide-react";
import type { RewardResult } from "@/types";

const RESOURCE_EMOJI: Record<string, string> = {
  coins: "💰",
  wood: "🪵",
  fabric: "🧵",
  fish: "🐟",
};

interface RewardPopupProps {
  reward: RewardResult;
  onClose: () => void;
}

export default function RewardPopup({ reward, onClose }: RewardPopupProps) {
  const t = useTranslations("record");

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
        <p className="text-2xl">✨</p>
        <h3 className="text-xl font-bold text-amber-700">{t("reward_title")}</h3>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-2xl">💰</span>
            <span className="text-lg font-bold text-amber-600">+{reward.coins}</span>
          </div>
          {reward.resourceType && reward.resourceAmount > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-2xl">{RESOURCE_EMOJI[reward.resourceType]}</span>
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
          <div className="bg-amber-100 text-amber-700 rounded-xl px-4 py-2 text-base font-bold">
            🎉 Level Up! → Lv.{reward.newLevel}
          </div>
        )}
      </div>
    </div>
  );
}

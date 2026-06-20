"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Flame, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useSettingsStore } from "@/stores/useSettingsStore";
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
  const { animationsEnabled } = useSettingsStore();

  useEffect(() => {
    const timer = setTimeout(onClose, 2800);
    return () => clearTimeout(timer);
  }, [onClose]);

  const dur = animationsEnabled ? undefined : 0;

  // Reward rows for stagger
  const rows = [
    { id: "coins", el: (
      <div className="flex items-center gap-1.5">
        <span className="text-2xl">💰</span>
        <span className="text-lg font-bold text-amber-600">+{reward.coins}</span>
      </div>
    )},
    ...(reward.resourceType && reward.resourceAmount > 0 ? [{
      id: "resource", el: (
        <div className="flex items-center gap-1.5">
          <span className="text-2xl">{RESOURCE_EMOJI[reward.resourceType!]}</span>
          <span className="text-lg font-bold text-green-600">+{reward.resourceAmount}</span>
        </div>
      ),
    }] : []),
    { id: "exp", el: (
      <div className="flex items-center gap-1.5">
        <TrendingUp size={18} className="text-blue-500" />
        <span className="text-lg font-bold text-blue-500">+{reward.expGained} EXP</span>
      </div>
    )},
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={dur !== undefined
          ? { duration: 0 }
          : { type: "spring", damping: 20, stiffness: 350 }
        }
        className="pointer-events-auto bg-white rounded-3xl shadow-2xl p-6 mx-4 flex flex-col items-center gap-3"
      >
        <p className="text-2xl">✨</p>
        <h3 className="text-xl font-bold text-amber-700">{t("reward_title")}</h3>

        <div className="flex items-center gap-4">
          {rows.map((row, i) => (
            <motion.div
              key={row.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={dur !== undefined
                ? { duration: 0 }
                : { delay: 0.15 + i * 0.08, type: "spring", damping: 20, stiffness: 300 }
              }
            >
              {row.el}
            </motion.div>
          ))}
        </div>

        {reward.streakBonus && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={dur !== undefined ? { duration: 0 } : { delay: 0.35 }}
            className="flex items-center gap-1.5 text-orange-500"
          >
            <Flame size={16} />
            <span className="text-sm font-semibold">{t("streak_bonus")}</span>
          </motion.div>
        )}

        {reward.levelUp && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: [0.9, 1.05, 1], opacity: 1 }}
            transition={dur !== undefined ? { duration: 0 } : { delay: 0.4, duration: 0.4 }}
            className="bg-amber-100 text-amber-700 rounded-xl px-4 py-2 text-base font-bold"
          >
            🎉 Level Up! → Lv.{reward.newLevel}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

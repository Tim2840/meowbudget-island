"use client";

import { getExpForNextLevel, getExpProgress } from "@/lib/rewardEngine";
import { LEVEL_THRESHOLDS } from "@/lib/constants";

interface LevelBarProps {
  level: number;
  exp: number;
}

export default function LevelBar({ level, exp }: LevelBarProps) {
  const progress = getExpProgress(level, exp);
  const nextLevelExp = getExpForNextLevel(level);
  const currentLevelExp = LEVEL_THRESHOLDS[level - 1] ?? 0;

  return (
    <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black text-amber-600">Lv.{level}</span>
        </div>
        <span className="text-xs text-gray-400">{exp - currentLevelExp} / {nextLevelExp - currentLevelExp} EXP</span>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

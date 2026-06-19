import type { Category, ResourceType, RewardResult } from "@/types";
import { EXP_PER_RECORD, EXP_STREAK_BONUS, LEVEL_THRESHOLDS } from "./constants";

export function calculateReward(
  category: Category,
  currentStreak: number,
  currentLevel: number,
  currentExp: number,
): RewardResult {
  const coins = category.bonusCoins + (category.isIncome ? category.resourceAmount : 0);
  const resourceType: ResourceType | null = (!category.isIncome && category.resourceType !== "coins")
    ? category.resourceType
    : category.isIncome ? "coins" : null;
  const resourceAmount = category.isIncome ? category.resourceAmount : category.resourceAmount;

  const streakBonus = currentStreak >= 2;
  const expGained = EXP_PER_RECORD + (streakBonus ? EXP_STREAK_BONUS : 0);

  const newExp = currentExp + expGained;
  const newLevel = getLevelForExp(newExp);
  const levelUp = newLevel > currentLevel;

  return {
    coins: category.isIncome ? category.resourceAmount : category.bonusCoins,
    resourceType,
    resourceAmount: category.isIncome ? 0 : category.resourceAmount,
    expGained,
    streakBonus,
    newAchievements: [], // populated by achievement engine after DB check
    levelUp,
    newLevel: levelUp ? newLevel : undefined,
  };
}

export function getLevelForExp(exp: number): number {
  let level = 1;
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (exp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
    } else {
      break;
    }
  }
  return level;
}

export function getExpForNextLevel(level: number): number {
  return LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
}

export function getExpProgress(level: number, exp: number): number {
  const currentLevelExp = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const nextLevelExp = getExpForNextLevel(level);
  return Math.round(((exp - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100);
}

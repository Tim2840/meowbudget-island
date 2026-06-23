import { ACHIEVEMENTS, ISLAND_ZONES, CAT_DEFINITIONS } from "@/lib/constants";
import type { Achievement } from "@/types";

interface AchievementParams {
  totalRecords: number;
  streak: number;
  level: number;
  budgetCount: number;
}

export function computeProgress(ach: Achievement, p: AchievementParams): number {
  switch (ach.conditionType) {
    case "total_records": return p.totalRecords;
    case "streak_days": return p.streak;
    case "zones_unlocked":
      return ISLAND_ZONES.filter((z) => p.level >= z.unlockLevel).length;
    case "cats_owned":
      return CAT_DEFINITIONS.filter(
        (c) => c.unlockType === "level" && p.level >= parseInt(c.unlockValue)
      ).length;
    case "budgets_set": return p.budgetCount;
    default: return 0;
  }
}

// Returns keys of achievements newly earned (not already in earnedKeys).
// Skips hidden achievements and those with untracked conditionTypes.
const TRACKABLE = new Set([
  "total_records",
  "streak_days",
  "zones_unlocked",
  "cats_owned",
  "budgets_set",
]);

export function checkAchievements(
  params: AchievementParams,
  earnedKeys: string[],
): string[] {
  const newlyEarned: string[] = [];
  for (const ach of ACHIEVEMENTS) {
    if (earnedKeys.includes(ach.key)) continue;
    if (ach.isHidden) continue;
    if (!TRACKABLE.has(ach.conditionType)) continue;
    if (computeProgress(ach, params) >= ach.conditionValue) {
      newlyEarned.push(ach.key);
    }
  }
  return newlyEarned;
}

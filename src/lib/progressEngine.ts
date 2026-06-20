import { ACHIEVEMENTS, QUESTS, ISLAND_ZONES, CAT_DEFINITIONS } from "./constants";
import type { Achievement, Quest } from "@/types";

// ──────────────────────────────────────────
// Aggregated stats used to evaluate progress
// ──────────────────────────────────────────
export interface ProgressStats {
  totalRecords: number;
  todayRecords: number;
  weekRecords: number;
  currentStreak: number;
  longestStreak: number;
  level: number;
  zonesUnlocked: number;
  catsOwned: number;
  budgetsSet: number;
  budgetsKept: number;
  buildingsBuilt: number;
  reportsViewedEver: boolean;
  reportViewedThisWeek: boolean;
}

// ── Derived counts ──────────────────────────
export function countZonesUnlocked(level: number): number {
  return ISLAND_ZONES.filter((z) => level >= z.unlockLevel).length;
}

/** Cats owned = level-unlocked cats + achievement-unlocked cats already earned. */
export function countCatsOwned(level: number, earnedAchievements: Set<string>): number {
  return CAT_DEFINITIONS.filter((cat) => {
    if (cat.unlockType === "level") return level >= parseInt(cat.unlockValue, 10);
    return earnedAchievements.has(cat.unlockValue);
  }).length;
}

// ──────────────────────────────────────────
// Achievement evaluation
// ──────────────────────────────────────────
export interface AchievementProgress {
  earned: boolean;
  progress: number;
  target: number;
}

function statForAchievement(conditionType: string, stats: ProgressStats): number {
  switch (conditionType) {
    case "total_records": return stats.totalRecords;
    case "streak_days": return stats.longestStreak;
    case "zones_unlocked": return stats.zonesUnlocked;
    case "buildings_built": return stats.buildingsBuilt;
    case "cats_owned": return stats.catsOwned;
    case "budgets_set": return stats.budgetsSet;
    case "budgets_kept": return stats.budgetsKept;
    case "reports_viewed": return stats.reportsViewedEver ? 1 : 0;
    default: return 0;
  }
}

export function evaluateAchievements(stats: ProgressStats): Record<string, AchievementProgress> {
  const result: Record<string, AchievementProgress> = {};
  for (const a of ACHIEVEMENTS) {
    const progress = statForAchievement(a.conditionType, stats);
    result[a.key] = {
      earned: progress >= a.conditionValue,
      progress: Math.min(progress, a.conditionValue),
      target: a.conditionValue,
    };
  }
  return result;
}

export function getAchievement(key: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.key === key);
}

// ──────────────────────────────────────────
// Quest evaluation
// ──────────────────────────────────────────
export interface QuestProgress {
  progress: number;
  target: number;
  complete: boolean;
}

function statForQuest(quest: Quest, stats: ProgressStats): number {
  switch (quest.conditionType) {
    case "record_count":
      return quest.type === "daily" ? stats.todayRecords : stats.weekRecords;
    case "view_report":
      return stats.reportViewedThisWeek ? 1 : 0;
    case "category_budget_kept":
      return stats.budgetsKept > 0 ? 1 : 0;
    default:
      return 0;
  }
}

export function evaluateQuests(stats: ProgressStats): Record<string, QuestProgress> {
  const result: Record<string, QuestProgress> = {};
  for (const q of QUESTS) {
    const progress = statForQuest(q, stats);
    result[q.key] = {
      progress: Math.min(progress, q.conditionValue),
      target: q.conditionValue,
      complete: progress >= q.conditionValue,
    };
  }
  return result;
}

export function getQuest(key: string): Quest | undefined {
  return QUESTS.find((q) => q.key === key);
}

import type { Category, ResourceType, IslandZone, Building, Achievement, Quest, CatDefinition, TutorialStep } from "@/types";

// ──────────────────────────────────────────
// Default Categories (system-defined, userId = null)
// ──────────────────────────────────────────
export const DEFAULT_CATEGORIES: Omit<Category, "id" | "userId" | "isCustom">[] = [
  { nameKey: "category.food", emoji: "🍔", color: "#FF6B6B", resourceType: "fish", resourceAmount: 2, bonusCoins: 5, sortOrder: 1, isIncome: false },
  { nameKey: "category.transport", emoji: "🚌", color: "#4ECDC4", resourceType: "wood", resourceAmount: 1, bonusCoins: 5, sortOrder: 2, isIncome: false },
  { nameKey: "category.shopping", emoji: "🛒", color: "#45B7D1", resourceType: "fabric", resourceAmount: 1, bonusCoins: 5, sortOrder: 3, isIncome: false },
  { nameKey: "category.entertainment", emoji: "🎮", color: "#96CEB4", resourceType: "coins", resourceAmount: 0, bonusCoins: 3, sortOrder: 4, isIncome: false },
  { nameKey: "category.home", emoji: "🏠", color: "#FFEAA7", resourceType: "wood", resourceAmount: 1, bonusCoins: 5, sortOrder: 5, isIncome: false },
  { nameKey: "category.clothing", emoji: "👕", color: "#DDA0DD", resourceType: "fabric", resourceAmount: 2, bonusCoins: 5, sortOrder: 6, isIncome: false },
  { nameKey: "category.health", emoji: "💊", color: "#98FB98", resourceType: "coins", resourceAmount: 0, bonusCoins: 8, sortOrder: 7, isIncome: false },
  { nameKey: "category.education", emoji: "📚", color: "#87CEEB", resourceType: "coins", resourceAmount: 0, bonusCoins: 8, sortOrder: 8, isIncome: false },
  { nameKey: "category.work", emoji: "💼", color: "#F0E68C", resourceType: "coins", resourceAmount: 0, bonusCoins: 5, sortOrder: 9, isIncome: false },
  { nameKey: "category.travel", emoji: "✈️", color: "#FFB6C1", resourceType: "wood", resourceAmount: 2, bonusCoins: 5, sortOrder: 10, isIncome: false },
  { nameKey: "category.income", emoji: "💰", color: "#FFD700", resourceType: "coins", resourceAmount: 20, bonusCoins: 0, sortOrder: 11, isIncome: true },
  { nameKey: "category.other", emoji: "📦", color: "#D3D3D3", resourceType: "coins", resourceAmount: 0, bonusCoins: 5, sortOrder: 12, isIncome: false },
];

// ──────────────────────────────────────────
// EXP & Level thresholds
// ──────────────────────────────────────────
export const LEVEL_THRESHOLDS: number[] = [
  0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700, // Levels 1-10
  3250, 3850, 4500, 5200, 5950, 6750, 7600, 8500, 9450, 10450, // Levels 11-20
];

export const EXP_PER_RECORD = 10;
export const EXP_STREAK_BONUS = 5; // extra EXP when recording with active streak

// ──────────────────────────────────────────
// Island Zones
// ──────────────────────────────────────────
export const ISLAND_ZONES: IslandZone[] = [
  {
    key: "harbor",
    nameKey: "zone.harbor",
    descriptionKey: "zone.harbor_desc",
    unlockLevel: 1,
    position: { x: 40, y: 66 },
    slots: [
      { slotId: "harbor-1", position: { x: 10, y: 70 }, buildingKey: null },
      { slotId: "harbor-2", position: { x: 35, y: 55 }, buildingKey: null },
      { slotId: "harbor-3", position: { x: 60, y: 65 }, buildingKey: null },
    ],
  },
  {
    key: "market",
    nameKey: "zone.market",
    descriptionKey: "zone.market_desc",
    unlockLevel: 5,
    position: { x: 60, y: 52 },
    slots: [
      { slotId: "market-1", position: { x: 50, y: 35 }, buildingKey: null },
      { slotId: "market-2", position: { x: 70, y: 45 }, buildingKey: null },
      { slotId: "market-3", position: { x: 85, y: 30 }, buildingKey: null },
      { slotId: "market-4", position: { x: 65, y: 25 }, buildingKey: null },
    ],
  },
  {
    key: "hill",
    nameKey: "zone.hill",
    descriptionKey: "zone.hill_desc",
    unlockLevel: 10,
    position: { x: 45, y: 40 },
    slots: [
      { slotId: "hill-1", position: { x: 30, y: 15 }, buildingKey: null },
      { slotId: "hill-2", position: { x: 50, y: 10 }, buildingKey: null },
      { slotId: "hill-3", position: { x: 45, y: 25 }, buildingKey: null },
    ],
  },
];

// ──────────────────────────────────────────
// Buildings (10: 3 harbor, 4 market, 3 hill)
// imageKey resolves to /assets/buildings/{imageKey}.png
// ──────────────────────────────────────────
export const BUILDINGS: Building[] = [
  // Harbor zone (unlock Lv.1)
  {
    key: "harbor_dock",
    zoneKey: "harbor",
    nameKey: "building.harbor_dock",
    descriptionKey: "building.harbor_dock_desc",
    maxLevel: 3,
    imageKey: "harbor_dock",
    levelCosts: [
      { level: 1, coins: 50, wood: 5, fabric: 0, fish: 2, requiredUserLevel: 1 },
      { level: 2, coins: 150, wood: 12, fabric: 0, fish: 5, requiredUserLevel: 3 },
      { level: 3, coins: 400, wood: 25, fabric: 4, fish: 10, requiredUserLevel: 6 },
    ],
  },
  {
    key: "harbor_lighthouse",
    zoneKey: "harbor",
    nameKey: "building.harbor_lighthouse",
    descriptionKey: "building.harbor_lighthouse_desc",
    maxLevel: 3,
    imageKey: "harbor_lighthouse",
    levelCosts: [
      { level: 1, coins: 80, wood: 8, fabric: 2, fish: 0, requiredUserLevel: 2 },
      { level: 2, coins: 200, wood: 16, fabric: 5, fish: 0, requiredUserLevel: 4 },
      { level: 3, coins: 500, wood: 30, fabric: 10, fish: 0, requiredUserLevel: 7 },
    ],
  },
  {
    key: "harbor_warehouse",
    zoneKey: "harbor",
    nameKey: "building.harbor_warehouse",
    descriptionKey: "building.harbor_warehouse_desc",
    maxLevel: 3,
    imageKey: "harbor_warehouse",
    levelCosts: [
      { level: 1, coins: 60, wood: 10, fabric: 0, fish: 0, requiredUserLevel: 2 },
      { level: 2, coins: 180, wood: 22, fabric: 0, fish: 0, requiredUserLevel: 4 },
      { level: 3, coins: 450, wood: 40, fabric: 6, fish: 0, requiredUserLevel: 7 },
    ],
  },
  // Market zone (unlock Lv.5)
  {
    key: "market_stall",
    zoneKey: "market",
    nameKey: "building.market_stall",
    descriptionKey: "building.market_stall_desc",
    maxLevel: 3,
    imageKey: "market_stall",
    levelCosts: [
      { level: 1, coins: 120, wood: 8, fabric: 4, fish: 0, requiredUserLevel: 5 },
      { level: 2, coins: 300, wood: 18, fabric: 10, fish: 0, requiredUserLevel: 7 },
      { level: 3, coins: 700, wood: 32, fabric: 20, fish: 0, requiredUserLevel: 10 },
    ],
  },
  {
    key: "market_bakery",
    zoneKey: "market",
    nameKey: "building.market_bakery",
    descriptionKey: "building.market_bakery_desc",
    maxLevel: 3,
    imageKey: "market_bakery",
    levelCosts: [
      { level: 1, coins: 140, wood: 6, fabric: 4, fish: 4, requiredUserLevel: 5 },
      { level: 2, coins: 320, wood: 14, fabric: 10, fish: 8, requiredUserLevel: 8 },
      { level: 3, coins: 750, wood: 28, fabric: 18, fish: 16, requiredUserLevel: 11 },
    ],
  },
  {
    key: "market_tailor",
    zoneKey: "market",
    nameKey: "building.market_tailor",
    descriptionKey: "building.market_tailor_desc",
    maxLevel: 3,
    imageKey: "market_tailor",
    levelCosts: [
      { level: 1, coins: 150, wood: 4, fabric: 8, fish: 0, requiredUserLevel: 6 },
      { level: 2, coins: 340, wood: 10, fabric: 18, fish: 0, requiredUserLevel: 8 },
      { level: 3, coins: 800, wood: 20, fabric: 35, fish: 0, requiredUserLevel: 11 },
    ],
  },
  {
    key: "market_blacksmith",
    zoneKey: "market",
    nameKey: "building.market_blacksmith",
    descriptionKey: "building.market_blacksmith_desc",
    maxLevel: 3,
    imageKey: "market_blacksmith",
    levelCosts: [
      { level: 1, coins: 160, wood: 12, fabric: 0, fish: 0, requiredUserLevel: 6 },
      { level: 2, coins: 360, wood: 26, fabric: 4, fish: 0, requiredUserLevel: 9 },
      { level: 3, coins: 850, wood: 48, fabric: 8, fish: 0, requiredUserLevel: 12 },
    ],
  },
  // Hill zone (unlock Lv.10)
  {
    key: "hill_windmill",
    zoneKey: "hill",
    nameKey: "building.hill_windmill",
    descriptionKey: "building.hill_windmill_desc",
    maxLevel: 3,
    imageKey: "hill_windmill",
    levelCosts: [
      { level: 1, coins: 300, wood: 20, fabric: 8, fish: 0, requiredUserLevel: 10 },
      { level: 2, coins: 650, wood: 40, fabric: 18, fish: 0, requiredUserLevel: 13 },
      { level: 3, coins: 1400, wood: 70, fabric: 35, fish: 0, requiredUserLevel: 16 },
    ],
  },
  {
    key: "hill_observatory",
    zoneKey: "hill",
    nameKey: "building.hill_observatory",
    descriptionKey: "building.hill_observatory_desc",
    maxLevel: 3,
    imageKey: "hill_observatory",
    levelCosts: [
      { level: 1, coins: 350, wood: 18, fabric: 10, fish: 0, requiredUserLevel: 11 },
      { level: 2, coins: 700, wood: 36, fabric: 22, fish: 0, requiredUserLevel: 14 },
      { level: 3, coins: 1500, wood: 64, fabric: 44, fish: 0, requiredUserLevel: 17 },
    ],
  },
  {
    key: "hill_temple",
    zoneKey: "hill",
    nameKey: "building.hill_temple",
    descriptionKey: "building.hill_temple_desc",
    maxLevel: 3,
    imageKey: "hill_temple",
    levelCosts: [
      { level: 1, coins: 400, wood: 22, fabric: 12, fish: 4, requiredUserLevel: 12 },
      { level: 2, coins: 800, wood: 44, fabric: 26, fish: 8, requiredUserLevel: 15 },
      { level: 3, coins: 1700, wood: 78, fabric: 50, fish: 16, requiredUserLevel: 18 },
    ],
  },
];

// ──────────────────────────────────────────
// Achievements
// ──────────────────────────────────────────
export const ACHIEVEMENTS: Achievement[] = [
  // Recording achievements
  { key: "first_record", nameKey: "achievement.first_record", descriptionKey: "achievement.first_record_desc", imageKey: "ach_first_record", category: "recording", conditionType: "total_records", conditionValue: 1, rewardCoins: 50, rewardExp: 20, isHidden: false },
  { key: "records_10", nameKey: "achievement.records_10", descriptionKey: "achievement.records_10_desc", imageKey: "ach_records_10", category: "recording", conditionType: "total_records", conditionValue: 10, rewardCoins: 100, rewardExp: 30, isHidden: false },
  { key: "records_50", nameKey: "achievement.records_50", descriptionKey: "achievement.records_50_desc", imageKey: "ach_records_50", category: "recording", conditionType: "total_records", conditionValue: 50, rewardCoins: 200, rewardExp: 50, isHidden: false },
  { key: "records_100", nameKey: "achievement.records_100", descriptionKey: "achievement.records_100_desc", imageKey: "ach_records_100", category: "recording", conditionType: "total_records", conditionValue: 100, rewardCoins: 500, rewardExp: 100, isHidden: false },
  // Streak achievements
  { key: "streak_3", nameKey: "achievement.streak_3", descriptionKey: "achievement.streak_3_desc", imageKey: "ach_streak_3", category: "streak", conditionType: "streak_days", conditionValue: 3, rewardCoins: 80, rewardExp: 25, isHidden: false },
  { key: "streak_7", nameKey: "achievement.streak_7", descriptionKey: "achievement.streak_7_desc", imageKey: "ach_streak_7", category: "streak", conditionType: "streak_days", conditionValue: 7, rewardCoins: 150, rewardExp: 50, isHidden: false },
  { key: "streak_30", nameKey: "achievement.streak_30", descriptionKey: "achievement.streak_30_desc", imageKey: "ach_streak_30", category: "streak", conditionType: "streak_days", conditionValue: 30, rewardCoins: 500, rewardExp: 150, isHidden: false },
  { key: "streak_100", nameKey: "achievement.streak_100", descriptionKey: "achievement.streak_100_desc", imageKey: "ach_streak_100", category: "streak", conditionType: "streak_days", conditionValue: 100, rewardCoins: 2000, rewardExp: 500, isHidden: true },
  // Island achievements
  { key: "first_zone", nameKey: "achievement.first_zone", descriptionKey: "achievement.first_zone_desc", imageKey: "ach_first_zone", category: "island", conditionType: "zones_unlocked", conditionValue: 1, rewardCoins: 200, rewardExp: 50, isHidden: false },
  { key: "all_zones", nameKey: "achievement.all_zones", descriptionKey: "achievement.all_zones_desc", imageKey: "ach_all_zones", category: "island", conditionType: "zones_unlocked", conditionValue: 3, rewardCoins: 1000, rewardExp: 200, isHidden: false },
  { key: "first_building", nameKey: "achievement.first_building", descriptionKey: "achievement.first_building_desc", imageKey: "ach_first_building", category: "island", conditionType: "buildings_built", conditionValue: 1, rewardCoins: 100, rewardExp: 30, isHidden: false },
  // Cat achievements
  { key: "first_cat", nameKey: "achievement.first_cat", descriptionKey: "achievement.first_cat_desc", imageKey: "ach_first_cat", category: "cats", conditionType: "cats_owned", conditionValue: 1, rewardCoins: 100, rewardExp: 30, isHidden: false },
  { key: "cats_3", nameKey: "achievement.cats_3", descriptionKey: "achievement.cats_3_desc", imageKey: "ach_cats_3", category: "cats", conditionType: "cats_owned", conditionValue: 3, rewardCoins: 300, rewardExp: 80, isHidden: false },
  // Finance achievements
  { key: "first_budget", nameKey: "achievement.first_budget", descriptionKey: "achievement.first_budget_desc", imageKey: "ach_first_budget", category: "finance", conditionType: "budgets_set", conditionValue: 1, rewardCoins: 80, rewardExp: 20, isHidden: false },
  { key: "budget_kept", nameKey: "achievement.budget_kept", descriptionKey: "achievement.budget_kept_desc", imageKey: "ach_budget_kept", category: "finance", conditionType: "budgets_kept", conditionValue: 1, rewardCoins: 200, rewardExp: 60, isHidden: false },
  { key: "analyst", nameKey: "achievement.analyst", descriptionKey: "achievement.analyst_desc", imageKey: "ach_analyst", category: "finance", conditionType: "reports_viewed", conditionValue: 1, rewardCoins: 50, rewardExp: 20, isHidden: false },
  // Hidden achievements
  { key: "night_owl", nameKey: "achievement.night_owl", descriptionKey: "achievement.night_owl_desc", imageKey: "ach_night_owl", category: "recording", conditionType: "record_after_midnight", conditionValue: 1, rewardCoins: 100, rewardExp: 30, isHidden: true },
];

// ──────────────────────────────────────────
// Daily / Weekly Quests
// ──────────────────────────────────────────
export const QUESTS: Quest[] = [
  { key: "daily_record_3", type: "daily", titleKey: "quest.daily_record_3", descriptionKey: "quest.daily_record_3.desc", conditionType: "record_count", conditionValue: 3, rewardCoins: 30, rewardExp: 15 },
  { key: "daily_record_5", type: "daily", titleKey: "quest.daily_record_5", descriptionKey: "quest.daily_record_5.desc", conditionType: "record_count", conditionValue: 5, rewardCoins: 60, rewardExp: 25 },
  { key: "weekly_view_report", type: "weekly", titleKey: "quest.weekly_view_report", descriptionKey: "quest.weekly_view_report.desc", conditionType: "view_report", conditionValue: 1, rewardCoins: 100, rewardExp: 40 },
  { key: "weekly_record_20", type: "weekly", titleKey: "quest.weekly_record_20", descriptionKey: "quest.weekly_record_20.desc", conditionType: "record_count", conditionValue: 20, rewardCoins: 200, rewardExp: 80 },
  { key: "weekly_budget_kept", type: "weekly", titleKey: "quest.weekly_budget_kept", descriptionKey: "quest.weekly_budget_kept.desc", conditionType: "category_budget_kept", conditionValue: 1, rewardCoins: 150, rewardExp: 60 },
];

// ──────────────────────────────────────────
// Onboarding Tutorial Steps
// ──────────────────────────────────────────
export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: "welcome",
    titleKey: "tutorial.welcome.title",
    contentKey: "tutorial.welcome.content",
    targetSelector: null, // pure text card
  },
  {
    id: "record_button",
    titleKey: "tutorial.record_button.title",
    contentKey: "tutorial.record_button.content",
    targetSelector: "[data-tutorial='add-record-btn']",
    position: "top",
  },
  {
    id: "resources",
    titleKey: "tutorial.resources.title",
    contentKey: "tutorial.resources.content",
    targetSelector: "[data-tutorial='wallet-bar']",
    position: "bottom",
  },
  {
    id: "island",
    titleKey: "tutorial.island.title",
    contentKey: "tutorial.island.content",
    targetSelector: "[data-tutorial='nav-island']",
    position: "top",
  },
  {
    id: "game_loop",
    titleKey: "tutorial.game_loop.title",
    contentKey: "tutorial.game_loop.content",
    targetSelector: null, // pure text card explaining full loop
  },
];

// ──────────────────────────────────────────
// Cat Definitions (first version: 5 cats)
// ──────────────────────────────────────────
export const CAT_DEFINITIONS: CatDefinition[] = [
  {
    key: "captain",
    nameKey: "cat.captain",
    descriptionKey: "cat.captain.desc",
    imageKey: "cat_captain",
    unlockType: "level",
    unlockValue: "1",
    animations: [
      { type: "idle", durationMs: 2000 },
      { type: "walk", durationMs: 3000 },
      { type: "lick", durationMs: 2500 },
    ],
  },
  {
    key: "merchant",
    nameKey: "cat.merchant",
    descriptionKey: "cat.merchant.desc",
    imageKey: "cat_merchant",
    unlockType: "level",
    unlockValue: "5",
    animations: [
      { type: "idle", durationMs: 2000 },
      { type: "walk", durationMs: 3000 },
      { type: "wave", durationMs: 2000 },
    ],
  },
  {
    key: "scholar",
    nameKey: "cat.scholar",
    descriptionKey: "cat.scholar.desc",
    imageKey: "cat_scholar",
    unlockType: "achievement",
    unlockValue: "analyst",
    animations: [
      { type: "idle", durationMs: 2000 },
      { type: "sleep", durationMs: 4000 },
      { type: "lick", durationMs: 2500 },
    ],
  },
  {
    key: "explorer",
    nameKey: "cat.explorer",
    descriptionKey: "cat.explorer.desc",
    imageKey: "cat_explorer",
    unlockType: "achievement",
    unlockValue: "all_zones",
    animations: [
      { type: "idle", durationMs: 2000 },
      { type: "walk", durationMs: 3000 },
      { type: "roll", durationMs: 3000 },
    ],
  },
  {
    key: "streak_master",
    nameKey: "cat.streak_master",
    descriptionKey: "cat.streak_master.desc",
    imageKey: "cat_streak_master",
    unlockType: "achievement",
    unlockValue: "streak_30",
    animations: [
      { type: "idle", durationMs: 2000 },
      { type: "walk", durationMs: 3000 },
      { type: "wave", durationMs: 2000 },
      { type: "lick", durationMs: 2500 },
    ],
  },
];

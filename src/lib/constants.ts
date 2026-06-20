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
    position: { x: 20, y: 60 },
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
    position: { x: 55, y: 40 },
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
    position: { x: 40, y: 15 },
    slots: [
      { slotId: "hill-1", position: { x: 30, y: 15 }, buildingKey: null },
      { slotId: "hill-2", position: { x: 50, y: 10 }, buildingKey: null },
      { slotId: "hill-3", position: { x: 45, y: 25 }, buildingKey: null },
    ],
  },
];

// ──────────────────────────────────────────
// Buildings (9 buildings across 3 zones, each with 3 levels)
// ──────────────────────────────────────────
export const BUILDINGS: Building[] = [
  // ── Harbor ──
  {
    key: "lighthouse", slotId: "harbor-1", zoneKey: "harbor",
    nameKey: "building.lighthouse", descriptionKey: "building.lighthouse_desc",
    maxLevel: 3, imageKey: "🏮",
    levelCosts: [
      { level: 1, coins: 150, wood: 30,  fabric: 0,  fish: 0,  requiredUserLevel: 1 },
      { level: 2, coins: 400, wood: 80,  fabric: 0,  fish: 0,  requiredUserLevel: 3 },
      { level: 3, coins: 900, wood: 180, fabric: 40, fish: 0,  requiredUserLevel: 6 },
    ],
  },
  {
    key: "fishing_dock", slotId: "harbor-2", zoneKey: "harbor",
    nameKey: "building.fishing_dock", descriptionKey: "building.fishing_dock_desc",
    maxLevel: 3, imageKey: "⚓",
    levelCosts: [
      { level: 1, coins: 120, wood: 0,   fabric: 0,  fish: 20, requiredUserLevel: 1 },
      { level: 2, coins: 350, wood: 0,   fabric: 0,  fish: 50, requiredUserLevel: 3 },
      { level: 3, coins: 800, wood: 60,  fabric: 0,  fish: 100,requiredUserLevel: 6 },
    ],
  },
  {
    key: "warehouse", slotId: "harbor-3", zoneKey: "harbor",
    nameKey: "building.warehouse", descriptionKey: "building.warehouse_desc",
    maxLevel: 3, imageKey: "📦",
    levelCosts: [
      { level: 1, coins: 200, wood: 50,  fabric: 0,  fish: 0,  requiredUserLevel: 2 },
      { level: 2, coins: 500, wood: 120, fabric: 0,  fish: 0,  requiredUserLevel: 4 },
      { level: 3, coins: 1100,wood: 250, fabric: 60, fish: 0,  requiredUserLevel: 7 },
    ],
  },
  // ── Market ──
  {
    key: "market_stall", slotId: "market-1", zoneKey: "market",
    nameKey: "building.market_stall", descriptionKey: "building.market_stall_desc",
    maxLevel: 3, imageKey: "🛒",
    levelCosts: [
      { level: 1, coins: 300, wood: 0,   fabric: 40, fish: 0,  requiredUserLevel: 5 },
      { level: 2, coins: 700, wood: 0,   fabric: 100,fish: 0,  requiredUserLevel: 7 },
      { level: 3, coins: 1500,wood: 80,  fabric: 200,fish: 0,  requiredUserLevel: 10 },
    ],
  },
  {
    key: "bakery", slotId: "market-2", zoneKey: "market",
    nameKey: "building.bakery", descriptionKey: "building.bakery_desc",
    maxLevel: 3, imageKey: "🥐",
    levelCosts: [
      { level: 1, coins: 280, wood: 40,  fabric: 0,  fish: 30, requiredUserLevel: 5 },
      { level: 2, coins: 650, wood: 80,  fabric: 0,  fish: 70, requiredUserLevel: 7 },
      { level: 3, coins: 1400,wood: 160, fabric: 60, fish: 140,requiredUserLevel: 10 },
    ],
  },
  {
    key: "textile_shop", slotId: "market-3", zoneKey: "market",
    nameKey: "building.textile_shop", descriptionKey: "building.textile_shop_desc",
    maxLevel: 3, imageKey: "🧵",
    levelCosts: [
      { level: 1, coins: 320, wood: 0,   fabric: 60, fish: 0,  requiredUserLevel: 6 },
      { level: 2, coins: 750, wood: 0,   fabric: 140,fish: 0,  requiredUserLevel: 8 },
      { level: 3, coins: 1600,wood: 100, fabric: 280,fish: 0,  requiredUserLevel: 11 },
    ],
  },
  {
    key: "trading_post", slotId: "market-4", zoneKey: "market",
    nameKey: "building.trading_post", descriptionKey: "building.trading_post_desc",
    maxLevel: 3, imageKey: "💱",
    levelCosts: [
      { level: 1, coins: 500, wood: 0,   fabric: 0,  fish: 0,  requiredUserLevel: 6 },
      { level: 2, coins: 1200,wood: 0,   fabric: 0,  fish: 0,  requiredUserLevel: 9 },
      { level: 3, coins: 2500,wood: 0,   fabric: 0,  fish: 0,  requiredUserLevel: 12 },
    ],
  },
  // ── Hill ──
  {
    key: "garden", slotId: "hill-1", zoneKey: "hill",
    nameKey: "building.garden", descriptionKey: "building.garden_desc",
    maxLevel: 3, imageKey: "🌸",
    levelCosts: [
      { level: 1, coins: 400, wood: 80,  fabric: 0,  fish: 0,  requiredUserLevel: 10 },
      { level: 2, coins: 900, wood: 180, fabric: 60, fish: 0,  requiredUserLevel: 12 },
      { level: 3, coins: 2000,wood: 360, fabric: 120,fish: 0,  requiredUserLevel: 15 },
    ],
  },
  {
    key: "observatory", slotId: "hill-2", zoneKey: "hill",
    nameKey: "building.observatory", descriptionKey: "building.observatory_desc",
    maxLevel: 3, imageKey: "🔭",
    levelCosts: [
      { level: 1, coins: 600, wood: 100, fabric: 80, fish: 0,  requiredUserLevel: 10 },
      { level: 2, coins: 1400,wood: 220, fabric: 180,fish: 0,  requiredUserLevel: 13 },
      { level: 3, coins: 3000,wood: 440, fabric: 360,fish: 0,  requiredUserLevel: 16 },
    ],
  },
  {
    key: "rest_pavilion", slotId: "hill-3", zoneKey: "hill",
    nameKey: "building.rest_pavilion", descriptionKey: "building.rest_pavilion_desc",
    maxLevel: 3, imageKey: "⛩️",
    levelCosts: [
      { level: 1, coins: 450, wood: 120, fabric: 40, fish: 0,  requiredUserLevel: 10 },
      { level: 2, coins: 1000,wood: 260, fabric: 80, fish: 0,  requiredUserLevel: 13 },
      { level: 3, coins: 2200,wood: 520, fabric: 160,fish: 0,  requiredUserLevel: 16 },
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
  { key: "daily_record_3", type: "daily", titleKey: "quest.daily_record_3", descriptionKey: "quest.daily_record_3_desc", conditionType: "record_count", conditionValue: 3, rewardCoins: 30, rewardExp: 15 },
  { key: "daily_record_5", type: "daily", titleKey: "quest.daily_record_5", descriptionKey: "quest.daily_record_5_desc", conditionType: "record_count", conditionValue: 5, rewardCoins: 60, rewardExp: 25 },
  { key: "weekly_view_report", type: "weekly", titleKey: "quest.weekly_view_report", descriptionKey: "quest.weekly_view_report_desc", conditionType: "view_report", conditionValue: 1, rewardCoins: 100, rewardExp: 40 },
  { key: "weekly_record_20", type: "weekly", titleKey: "quest.weekly_record_20", descriptionKey: "quest.weekly_record_20_desc", conditionType: "record_count", conditionValue: 20, rewardCoins: 200, rewardExp: 80 },
  { key: "weekly_budget_kept", type: "weekly", titleKey: "quest.weekly_budget_kept", descriptionKey: "quest.weekly_budget_kept_desc", conditionType: "category_budget_kept", conditionValue: 1, rewardCoins: 150, rewardExp: 60 },
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

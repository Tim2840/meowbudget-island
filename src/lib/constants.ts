import type { Category, CategoryGroup, ResourceType, IslandZone, Building, Achievement, Quest, CatDefinition, TutorialStep } from "@/types";

// ──────────────────────────────────────────
// 預設大類 (groups)
// ──────────────────────────────────────────
export const DEFAULT_GROUPS: CategoryGroup[] = [
  // ── 支出大類 ──
  { key: "food",             nameKey: "category.food",             emoji: "🍔", color: "#FF6B6B", isIncome: false, sortOrder: 1,  isCustom: false, userId: null },
  { key: "transport",        nameKey: "category.transport",        emoji: "🚌", color: "#4ECDC4", isIncome: false, sortOrder: 2,  isCustom: false, userId: null },
  { key: "shopping",         nameKey: "category.shopping",         emoji: "🛒", color: "#45B7D1", isIncome: false, sortOrder: 3,  isCustom: false, userId: null },
  { key: "entertainment",    nameKey: "category.entertainment",    emoji: "🎮", color: "#96CEB4", isIncome: false, sortOrder: 4,  isCustom: false, userId: null },
  { key: "home",             nameKey: "category.home",             emoji: "🏠", color: "#FFEAA7", isIncome: false, sortOrder: 5,  isCustom: false, userId: null },
  { key: "clothing",         nameKey: "category.clothing",         emoji: "👕", color: "#DDA0DD", isIncome: false, sortOrder: 6,  isCustom: false, userId: null },
  { key: "health",           nameKey: "category.health",           emoji: "💊", color: "#98FB98", isIncome: false, sortOrder: 7,  isCustom: false, userId: null },
  { key: "education",        nameKey: "category.education",        emoji: "📚", color: "#87CEEB", isIncome: false, sortOrder: 8,  isCustom: false, userId: null },
  { key: "social",           nameKey: "category.social",           emoji: "🤝", color: "#F4A460", isIncome: false, sortOrder: 9,  isCustom: false, userId: null },
  { key: "pet",              nameKey: "category.pet",              emoji: "🐱", color: "#FFB6C1", isIncome: false, sortOrder: 10, isCustom: false, userId: null },
  { key: "travel",           nameKey: "category.travel",           emoji: "✈️", color: "#C8A0E8", isIncome: false, sortOrder: 11, isCustom: false, userId: null },
  { key: "other",            nameKey: "category.other",            emoji: "📦", color: "#D3D3D3", isIncome: false, sortOrder: 12, isCustom: false, userId: null },
  // ── 收入大類 ──
  { key: "work_income",      nameKey: "category.work_income",      emoji: "💰", color: "#FFD700", isIncome: true,  sortOrder: 1,  isCustom: false, userId: null },
  { key: "invest_income",    nameKey: "category.invest_income",    emoji: "📈", color: "#90EE90", isIncome: true,  sortOrder: 2,  isCustom: false, userId: null },
  { key: "other_income",     nameKey: "category.other_income",     emoji: "🎁", color: "#FFA07A", isIncome: true,  sortOrder: 3,  isCustom: false, userId: null },
];

// ──────────────────────────────────────────
// Builder helper: 子類繼承大類預設值
// ──────────────────────────────────────────
type GroupBase = { color: string; isIncome: boolean; resourceType: ResourceType; resourceAmount: number; bonusCoins: number };
type SubDef = { key: string; nameKey: string; emoji: string; sortOrder: number; resourceType?: ResourceType; resourceAmount?: number; bonusCoins?: number };

function buildSubs(groupKey: string, base: GroupBase, subs: SubDef[]): Category[] {
  return subs.map((s) => ({
    key: s.key,
    groupKey,
    nameKey: s.nameKey,
    emoji: s.emoji,
    color: base.color,
    resourceType: s.resourceType ?? base.resourceType,
    resourceAmount: s.resourceAmount ?? base.resourceAmount,
    bonusCoins: s.bonusCoins ?? base.bonusCoins,
    isIncome: base.isIncome,
    sortOrder: s.sortOrder,
    isCustom: false as const,
    userId: null,
  }));
}

// ──────────────────────────────────────────
// 預設子類 (subcategories)
// ──────────────────────────────────────────
export const DEFAULT_SUBCATEGORIES: Category[] = [
  // 🍔 飲食
  ...buildSubs("food", { color: "#FF6B6B", isIncome: false, resourceType: "fish", resourceAmount: 2, bonusCoins: 5 }, [
    { key: "food_breakfast",  nameKey: "category.food_breakfast",  emoji: "🥐", sortOrder: 1 },
    { key: "food_lunch",      nameKey: "category.food_lunch",      emoji: "🍱", sortOrder: 2 },
    { key: "food_dinner",     nameKey: "category.food_dinner",     emoji: "🍜", sortOrder: 3 },
    { key: "food_drinks",     nameKey: "category.food_drinks",     emoji: "🧋", sortOrder: 4 },
    { key: "food_snack",      nameKey: "category.food_snack",      emoji: "🍿", sortOrder: 5 },
    { key: "food_grocery",    nameKey: "category.food_grocery",    emoji: "🛒", sortOrder: 6 },
  ]),
  // 🚌 交通
  ...buildSubs("transport", { color: "#4ECDC4", isIncome: false, resourceType: "wood", resourceAmount: 1, bonusCoins: 5 }, [
    { key: "transport_public",  nameKey: "category.transport_public",  emoji: "🚇", sortOrder: 1 },
    { key: "transport_taxi",    nameKey: "category.transport_taxi",    emoji: "🚕", sortOrder: 2 },
    { key: "transport_gas",     nameKey: "category.transport_gas",     emoji: "⛽", sortOrder: 3 },
    { key: "transport_parking", nameKey: "category.transport_parking", emoji: "🅿️", sortOrder: 4 },
    { key: "transport_etc",     nameKey: "category.transport_etc",     emoji: "🛣️", sortOrder: 5 },
    { key: "transport_repair",  nameKey: "category.transport_repair",  emoji: "🔧", sortOrder: 6 },
  ]),
  // 🛒 購物
  ...buildSubs("shopping", { color: "#45B7D1", isIncome: false, resourceType: "fabric", resourceAmount: 1, bonusCoins: 5 }, [
    { key: "shopping_daily",       nameKey: "category.shopping_daily",       emoji: "🧴", sortOrder: 1 },
    { key: "shopping_electronics", nameKey: "category.shopping_electronics", emoji: "📱", sortOrder: 2 },
    { key: "shopping_appliance",   nameKey: "category.shopping_appliance",   emoji: "🏠", sortOrder: 3 },
    { key: "shopping_beauty",      nameKey: "category.shopping_beauty",      emoji: "💄", sortOrder: 4 },
    { key: "shopping_books",       nameKey: "category.shopping_books",       emoji: "📖", sortOrder: 5 },
  ]),
  // 🎮 娛樂
  ...buildSubs("entertainment", { color: "#96CEB4", isIncome: false, resourceType: "coins", resourceAmount: 0, bonusCoins: 4 }, [
    { key: "entertainment_movie",        nameKey: "category.entertainment_movie",        emoji: "🎬", sortOrder: 1 },
    { key: "entertainment_game",         nameKey: "category.entertainment_game",         emoji: "🎮", sortOrder: 2 },
    { key: "entertainment_subscription", nameKey: "category.entertainment_subscription", emoji: "📺", sortOrder: 3 },
    { key: "entertainment_ktv",          nameKey: "category.entertainment_ktv",          emoji: "🎤", sortOrder: 4 },
    { key: "entertainment_sports",       nameKey: "category.entertainment_sports",       emoji: "🏃", sortOrder: 5 },
  ]),
  // 🏠 居家
  ...buildSubs("home", { color: "#FFEAA7", isIncome: false, resourceType: "wood", resourceAmount: 1, bonusCoins: 5 }, [
    { key: "home_rent",        nameKey: "category.home_rent",        emoji: "🏠", sortOrder: 1 },
    { key: "home_utilities",   nameKey: "category.home_utilities",   emoji: "💡", sortOrder: 2 },
    { key: "home_internet",    nameKey: "category.home_internet",    emoji: "📡", sortOrder: 3 },
    { key: "home_furniture",   nameKey: "category.home_furniture",   emoji: "🛋️", sortOrder: 4 },
    { key: "home_maintenance", nameKey: "category.home_maintenance", emoji: "🏢", sortOrder: 5 },
  ]),
  // 👕 服飾
  ...buildSubs("clothing", { color: "#DDA0DD", isIncome: false, resourceType: "fabric", resourceAmount: 2, bonusCoins: 5 }, [
    { key: "clothing_clothes",     nameKey: "category.clothing_clothes",     emoji: "👔", sortOrder: 1 },
    { key: "clothing_shoes",       nameKey: "category.clothing_shoes",       emoji: "👟", sortOrder: 2 },
    { key: "clothing_accessories", nameKey: "category.clothing_accessories", emoji: "👜", sortOrder: 3 },
  ]),
  // 💊 醫療健康
  ...buildSubs("health", { color: "#98FB98", isIncome: false, resourceType: "coins", resourceAmount: 0, bonusCoins: 8 }, [
    { key: "health_medical",    nameKey: "category.health_medical",    emoji: "🏥", sortOrder: 1 },
    { key: "health_medicine",   nameKey: "category.health_medicine",   emoji: "💊", sortOrder: 2 },
    { key: "health_supplement", nameKey: "category.health_supplement", emoji: "💪", sortOrder: 3 },
    { key: "health_insurance",  nameKey: "category.health_insurance",  emoji: "🛡️", sortOrder: 4 },
  ]),
  // 📚 教育
  ...buildSubs("education", { color: "#87CEEB", isIncome: false, resourceType: "coins", resourceAmount: 0, bonusCoins: 8 }, [
    { key: "education_tuition", nameKey: "category.education_tuition", emoji: "🎓", sortOrder: 1 },
    { key: "education_books",   nameKey: "category.education_books",   emoji: "📚", sortOrder: 2 },
    { key: "education_courses", nameKey: "category.education_courses", emoji: "💻", sortOrder: 3 },
  ]),
  // 🤝 人際社交
  ...buildSubs("social", { color: "#F4A460", isIncome: false, resourceType: "fabric", resourceAmount: 1, bonusCoins: 5 }, [
    { key: "social_gift",     nameKey: "category.social_gift",     emoji: "🎁", sortOrder: 1 },
    { key: "social_dining",   nameKey: "category.social_dining",   emoji: "🥂", sortOrder: 2 },
    { key: "social_donation", nameKey: "category.social_donation", emoji: "❤️", sortOrder: 3 },
  ]),
  // 🐱 寵物
  ...buildSubs("pet", { color: "#FFB6C1", isIncome: false, resourceType: "fish", resourceAmount: 2, bonusCoins: 5 }, [
    { key: "pet_food",     nameKey: "category.pet_food",     emoji: "🐾", sortOrder: 1 },
    { key: "pet_medical",  nameKey: "category.pet_medical",  emoji: "🏥", sortOrder: 2 },
    { key: "pet_supplies", nameKey: "category.pet_supplies", emoji: "🧸", sortOrder: 3 },
  ]),
  // ✈️ 旅遊
  ...buildSubs("travel", { color: "#C8A0E8", isIncome: false, resourceType: "wood", resourceAmount: 2, bonusCoins: 5 }, [
    { key: "travel_transport",     nameKey: "category.travel_transport",     emoji: "✈️", sortOrder: 1 },
    { key: "travel_accommodation", nameKey: "category.travel_accommodation", emoji: "🏨", sortOrder: 2 },
    { key: "travel_tickets",       nameKey: "category.travel_tickets",       emoji: "🎫", sortOrder: 3 },
    { key: "travel_souvenir",      nameKey: "category.travel_souvenir",      emoji: "🎁", sortOrder: 4 },
  ]),
  // 📦 其他支出
  ...buildSubs("other", { color: "#D3D3D3", isIncome: false, resourceType: "coins", resourceAmount: 0, bonusCoins: 3 }, [
    { key: "other_misc", nameKey: "category.other_misc", emoji: "📦", sortOrder: 1 },
    { key: "other_fee",  nameKey: "category.other_fee",  emoji: "💳", sortOrder: 2 },
    { key: "other_tax",  nameKey: "category.other_tax",  emoji: "📋", sortOrder: 3 },
  ]),
  // 💰 工作收入
  ...buildSubs("work_income", { color: "#FFD700", isIncome: true, resourceType: "coins", resourceAmount: 12, bonusCoins: 0 }, [
    { key: "work_income_salary",    nameKey: "category.work_income_salary",    emoji: "💼", sortOrder: 1 },
    { key: "work_income_bonus",     nameKey: "category.work_income_bonus",     emoji: "🎉", sortOrder: 2 },
    { key: "work_income_overtime",  nameKey: "category.work_income_overtime",  emoji: "⏰", sortOrder: 3 },
    { key: "work_income_freelance", nameKey: "category.work_income_freelance", emoji: "💻", sortOrder: 4 },
  ]),
  // 📈 理財收入
  ...buildSubs("invest_income", { color: "#90EE90", isIncome: true, resourceType: "coins", resourceAmount: 15, bonusCoins: 0 }, [
    { key: "invest_income_dividend", nameKey: "category.invest_income_dividend", emoji: "📈", sortOrder: 1 },
    { key: "invest_income_interest", nameKey: "category.invest_income_interest", emoji: "🏦", sortOrder: 2 },
    { key: "invest_income_profit",   nameKey: "category.invest_income_profit",   emoji: "💹", sortOrder: 3 },
    { key: "invest_income_rent",     nameKey: "category.invest_income_rent",     emoji: "🏘️", sortOrder: 4 },
  ]),
  // 🎁 其他收入
  ...buildSubs("other_income", { color: "#FFA07A", isIncome: true, resourceType: "coins", resourceAmount: 12, bonusCoins: 0 }, [
    { key: "other_income_gift",    nameKey: "category.other_income_gift",    emoji: "🧧", sortOrder: 1 },
    { key: "other_income_refund",  nameKey: "category.other_income_refund",  emoji: "🔄", sortOrder: 2 },
    { key: "other_income_subsidy", nameKey: "category.other_income_subsidy", emoji: "📋", sortOrder: 3 },
    { key: "other_income_resale",  nameKey: "category.other_income_resale",  emoji: "🏷️", sortOrder: 4 },
    { key: "other_income_prize",   nameKey: "category.other_income_prize",   emoji: "🎰", sortOrder: 5 },
  ]),
];

// 舊交易 (categorySnapshot.nameKey 只有大類層級) 的回退對照表
export const LEGACY_NAMEKEY_TO_GROUP: Record<string, string> = {
  "category.food":          "food",
  "category.transport":     "transport",
  "category.shopping":      "shopping",
  "category.entertainment": "entertainment",
  "category.home":          "home",
  "category.clothing":      "clothing",
  "category.health":        "health",
  "category.education":     "education",
  "category.work":          "work_income",
  "category.travel":        "travel",
  "category.income":        "work_income",
  "category.other":         "other",
};

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
// 每日 / 每週各 10 題的「題庫」，每天 / 每週由 questSelection 依日期種子抽 2 題。
// rarity 影響抽中機率（common 60 / rare 30 / epic 10）與獎勵高低。
export const QUESTS: Quest[] = [
  // ── 每日題庫 (10) ──
  { key: "daily_record_1",  type: "daily", rarity: "common", titleKey: "quest.daily_record_1",  descriptionKey: "quest.daily_record_1_desc",  conditionType: "record_count",  conditionValue: 1, rewardCoins: 30,  rewardExp: 15 },
  { key: "daily_record_3",  type: "daily", rarity: "common", titleKey: "quest.daily_record_3",  descriptionKey: "quest.daily_record_3_desc",  conditionType: "record_count",  conditionValue: 3, rewardCoins: 30,  rewardExp: 15 },
  { key: "daily_record_5",  type: "daily", rarity: "rare",   titleKey: "quest.daily_record_5",  descriptionKey: "quest.daily_record_5_desc",  conditionType: "record_count",  conditionValue: 5, rewardCoins: 70,  rewardExp: 30 },
  { key: "daily_record_8",  type: "daily", rarity: "epic",   titleKey: "quest.daily_record_8",  descriptionKey: "quest.daily_record_8_desc",  conditionType: "record_count",  conditionValue: 8, rewardCoins: 150, rewardExp: 60 },
  { key: "daily_income_1",  type: "daily", rarity: "common", titleKey: "quest.daily_income_1",  descriptionKey: "quest.daily_income_1_desc",  conditionType: "record_income", conditionValue: 1, rewardCoins: 30,  rewardExp: 15 },
  { key: "daily_note_1",    type: "daily", rarity: "common", titleKey: "quest.daily_note_1",    descriptionKey: "quest.daily_note_1_desc",    conditionType: "record_note",   conditionValue: 1, rewardCoins: 30,  rewardExp: 15 },
  { key: "daily_groups_2",  type: "daily", rarity: "common", titleKey: "quest.daily_groups_2",  descriptionKey: "quest.daily_groups_2_desc",  conditionType: "record_groups", conditionValue: 2, rewardCoins: 40,  rewardExp: 18 },
  { key: "daily_groups_3",  type: "daily", rarity: "rare",   titleKey: "quest.daily_groups_3",  descriptionKey: "quest.daily_groups_3_desc",  conditionType: "record_groups", conditionValue: 3, rewardCoins: 70,  rewardExp: 30 },
  { key: "daily_groups_4",  type: "daily", rarity: "epic",   titleKey: "quest.daily_groups_4",  descriptionKey: "quest.daily_groups_4_desc",  conditionType: "record_groups", conditionValue: 4, rewardCoins: 150, rewardExp: 60 },
  { key: "daily_view_report", type: "daily", rarity: "common", titleKey: "quest.daily_view_report", descriptionKey: "quest.daily_view_report_desc", conditionType: "view_report", conditionValue: 1, rewardCoins: 30, rewardExp: 15 },

  // ── 每週題庫 (10) ──
  { key: "weekly_record_10",  type: "weekly", rarity: "common", titleKey: "quest.weekly_record_10",  descriptionKey: "quest.weekly_record_10_desc",  conditionType: "record_count",         conditionValue: 10, rewardCoins: 80,  rewardExp: 35 },
  { key: "weekly_record_20",  type: "weekly", rarity: "rare",   titleKey: "quest.weekly_record_20",  descriptionKey: "quest.weekly_record_20_desc",  conditionType: "record_count",         conditionValue: 20, rewardCoins: 180, rewardExp: 70 },
  { key: "weekly_record_30",  type: "weekly", rarity: "epic",   titleKey: "quest.weekly_record_30",  descriptionKey: "quest.weekly_record_30_desc",  conditionType: "record_count",         conditionValue: 30, rewardCoins: 350, rewardExp: 140 },
  { key: "weekly_view_report",type: "weekly", rarity: "common", titleKey: "quest.weekly_view_report",descriptionKey: "quest.weekly_view_report_desc",conditionType: "view_report",          conditionValue: 1,  rewardCoins: 80,  rewardExp: 35 },
  { key: "weekly_budget_kept",type: "weekly", rarity: "rare",   titleKey: "quest.weekly_budget_kept",descriptionKey: "quest.weekly_budget_kept_desc",conditionType: "category_budget_kept", conditionValue: 1,  rewardCoins: 180, rewardExp: 70 },
  { key: "weekly_streak_3",   type: "weekly", rarity: "common", titleKey: "quest.weekly_streak_3",   descriptionKey: "quest.weekly_streak_3_desc",   conditionType: "streak_days",          conditionValue: 3,  rewardCoins: 80,  rewardExp: 35 },
  { key: "weekly_streak_7",   type: "weekly", rarity: "epic",   titleKey: "quest.weekly_streak_7",   descriptionKey: "quest.weekly_streak_7_desc",   conditionType: "streak_days",          conditionValue: 7,  rewardCoins: 350, rewardExp: 140 },
  { key: "weekly_days_5",     type: "weekly", rarity: "rare",   titleKey: "quest.weekly_days_5",     descriptionKey: "quest.weekly_days_5_desc",     conditionType: "record_days",          conditionValue: 5,  rewardCoins: 180, rewardExp: 70 },
  { key: "weekly_income_3",   type: "weekly", rarity: "common", titleKey: "quest.weekly_income_3",   descriptionKey: "quest.weekly_income_3_desc",   conditionType: "record_income",        conditionValue: 3,  rewardCoins: 80,  rewardExp: 35 },
  { key: "weekly_days_3",     type: "weekly", rarity: "common", titleKey: "quest.weekly_days_3",     descriptionKey: "quest.weekly_days_3_desc",     conditionType: "record_days",          conditionValue: 3,  rewardCoins: 80,  rewardExp: 35 },
];

// ──────────────────────────────────────────
// Onboarding Tutorial Steps
// ──────────────────────────────────────────
// Each step declares the `route` (page, without locale prefix) it belongs to.
// The tutorial overlay navigates to that page first, waits for it to render,
// then spotlights the element matching `targetSelector` on that page.
export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: "welcome",
    titleKey: "tutorial.welcome.title",
    contentKey: "tutorial.welcome.content",
    route: "/",
    targetSelector: null, // pure text card
  },
  {
    id: "record_button",
    titleKey: "tutorial.record_button.title",
    contentKey: "tutorial.record_button.content",
    route: "/",
    targetSelector: "[data-tutorial='add-record-btn']",
    position: "top",
  },
  {
    id: "resources",
    titleKey: "tutorial.resources.title",
    contentKey: "tutorial.resources.content",
    route: "/",
    targetSelector: "[data-tutorial='wallet-bar']",
    position: "bottom",
  },
  {
    id: "reports",
    titleKey: "tutorial.reports.title",
    contentKey: "tutorial.reports.content",
    route: "/reports",
    targetSelector: "[data-tutorial='reports-tabs']",
    position: "bottom",
  },
  {
    id: "island",
    titleKey: "tutorial.island.title",
    contentKey: "tutorial.island.content",
    route: "/island",
    targetSelector: "[data-tutorial='island-scene']",
    position: "bottom",
  },
  {
    id: "cats",
    titleKey: "tutorial.cats.title",
    contentKey: "tutorial.cats.content",
    route: "/cats",
    targetSelector: "[data-tutorial='cats-grid']",
    position: "bottom",
  },
  {
    id: "game_loop",
    titleKey: "tutorial.game_loop.title",
    contentKey: "tutorial.game_loop.content",
    route: "/",
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

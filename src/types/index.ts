export type Language = "zh-TW" | "en";

export type TransactionType = "income" | "expense";

export type ResourceType = "coins" | "wood" | "fabric" | "fish";

export interface Category {
  id: string;
  userId: string | null; // null = system default
  nameKey: string; // i18n key or custom name
  emoji: string;
  color: string;
  resourceType: ResourceType;
  resourceAmount: number;
  bonusCoins: number;
  sortOrder: number;
  isIncome: boolean;
  isCustom: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  categorySnapshot: Pick<Category, "nameKey" | "emoji" | "color" | "isCustom">;
  date: string; // YYYY-MM-DD
  note?: string;
  rewardCoins: number;
  rewardResourceType: ResourceType | null;
  rewardResourceAmount: number;
  createdAt: string;
}

export interface Budget {
  id: string;
  userId: string;
  categoryId: string | null; // null = monthly total
  amount: number;
  yearMonth: string; // 'YYYY-MM'
}

export interface ResourceWallet {
  userId: string;
  coins: number;
  wood: number;
  fabric: number;
  fish: number;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  level: number;
  exp: number;
  currentStreak: number;
  longestStreak: number;
  lastRecordDate: string | null;
  language: Language;
  onboardingCompleted: boolean;
  createdAt: string;
}

export interface UserSettings {
  userId: string;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  animationsEnabled: boolean;
}

// Island / Zone types
export type ZoneKey = "harbor" | "market" | "hill";

export interface IslandZone {
  key: ZoneKey;
  nameKey: string;
  descriptionKey: string;
  unlockLevel: number;
  position: { x: number; y: number }; // CSS positioning %
  slots: BuildingSlot[];
}

export interface BuildingSlot {
  slotId: string;
  position: { x: number; y: number };
  buildingKey: string | null;
}

export interface Building {
  key: string;
  slotId: string;
  zoneKey: ZoneKey;
  nameKey: string;
  descriptionKey: string;
  maxLevel: number;
  imageKey: string;
  levelCosts: BuildingLevelCost[];
}

export interface BuildingLevelCost {
  level: number;
  coins: number;
  wood: number;
  fabric: number;
  fish: number;
  requiredUserLevel: number;
}

export interface UserBuilding {
  userId: string;
  buildingKey: string;
  level: number;
}

// Cat types
export type CatUnlockType = "level" | "quest" | "building" | "achievement";

export interface CatDefinition {
  key: string;
  nameKey: string;
  descriptionKey: string;
  imageKey: string;
  unlockType: CatUnlockType;
  unlockValue: string;
  animations: CatAnimation[];
}

export type CatAnimationType = "idle" | "walk" | "lick" | "roll" | "sleep" | "wave";

export interface CatAnimation {
  type: CatAnimationType;
  durationMs: number;
  frames?: string[];
}

export interface UserCat {
  userId: string;
  catKey: string;
  acquiredAt: string;
  isActive: boolean;
  currentOutfitKey: string | null;
  position?: { x: number; y: number }; // current position on island
}

export interface CatOutfit {
  key: string;
  catKey: string | null; // null = universal outfit
  nameKey: string;
  imageKey: string;
  costCoins: number;
}

// Quest types
export type QuestType = "daily" | "weekly" | "one_time";
export type QuestConditionType =
  | "record_count"
  | "view_report"
  | "category_budget_kept"
  | "streak_days"
  | "zone_unlocked"
  | "building_built";

export interface Quest {
  key: string;
  type: QuestType;
  titleKey: string;
  descriptionKey: string;
  conditionType: QuestConditionType;
  conditionValue: number;
  rewardCoins: number;
  rewardExp: number;
  rewardResource?: { type: ResourceType; amount: number };
}

export interface UserQuest {
  userId: string;
  questKey: string;
  progress: number;
  completedAt: string | null;
  claimed: boolean;
  resetDate: string | null;
}

// Achievement (fine-grained, permanent)
export interface Achievement {
  key: string;
  nameKey: string;
  descriptionKey: string;
  imageKey: string;
  category: "recording" | "streak" | "island" | "cats" | "finance" | "social";
  conditionType: string;
  conditionValue: number;
  rewardCoins: number;
  rewardExp: number;
  isHidden: boolean; // 隱藏成就
}

export interface UserAchievement {
  userId: string;
  achievementKey: string;
  earnedAt: string;
  seen: boolean; // 是否已彈出通知
}

// Milestone (major stage gates, visual celebration)
export interface Milestone {
  key: string;
  nameKey: string;
  descriptionKey: string;
  requiredLevel: number;
  rewardCoins: number;
  rewardResource?: { type: ResourceType; amount: number };
}

// Reward (result from reward engine)
export interface RewardResult {
  coins: number;
  resourceType: ResourceType | null;
  resourceAmount: number;
  expGained: number;
  streakBonus: boolean;
  newAchievements: string[];
  levelUp: boolean;
  newLevel?: number;
}

// Onboarding
export interface TutorialStep {
  id: string;
  titleKey: string;
  contentKey: string;
  targetSelector: string | null; // CSS selector, null = text-only card
  position?: "top" | "bottom" | "left" | "right";
}

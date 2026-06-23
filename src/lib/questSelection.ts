import { QUESTS } from "@/lib/constants";
import type { Quest, QuestRarity } from "@/types";

// Higher weight = more likely to be picked.
const RARITY_WEIGHT: Record<QuestRarity, number> = {
  common: 60,
  rare: 30,
  epic: 10,
};

// FNV-1a string hash → 32-bit seed.
function hashSeed(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

// Deterministic PRNG so the same seed always yields the same picks.
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function weightedPick(pool: Quest[], rng: () => number): Quest {
  const total = pool.reduce((s, q) => s + RARITY_WEIGHT[q.rarity], 0);
  let r = rng() * total;
  for (const q of pool) {
    r -= RARITY_WEIGHT[q.rarity];
    if (r <= 0) return q;
  }
  return pool[pool.length - 1];
}

/**
 * Pick `count` quests of the given type for a given seed (date string for
 * daily, week-start string for weekly). Pure & deterministic: same seed →
 * same quests, stable across app restarts.
 *
 * Slot 1 is always drawn from the common tier (new-player friendly); the
 * remaining slots are drawn weighted by rarity from whatever's left.
 */
export function selectQuests(
  type: "daily" | "weekly",
  seed: string,
  count = 2,
): Quest[] {
  const pool = QUESTS.filter((q) => q.type === type);
  const rng = mulberry32(hashSeed(`${type}:${seed}`));
  const result: Quest[] = [];

  const commons = pool.filter((q) => q.rarity === "common");
  if (commons.length > 0) {
    result.push(weightedPick(commons, rng));
  }

  while (result.length < count) {
    const remaining = pool.filter((q) => !result.includes(q));
    if (remaining.length === 0) break;
    result.push(weightedPick(remaining, rng));
  }

  return result;
}

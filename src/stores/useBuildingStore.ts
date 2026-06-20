import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserBuilding } from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { BUILDINGS } from "@/lib/constants";
import { useWalletStore } from "./useWalletStore";

interface BuildingState {
  buildings: UserBuilding[];
  loadBuildings: (userId: string) => Promise<void>;
  buildOrUpgrade: (userId: string, buildingKey: string) => Promise<boolean>;
}

export const useBuildingStore = create<BuildingState>()(
  persist(
    (set, get) => ({
      buildings: [],

      loadBuildings: async (userId: string) => {
        if (!isSupabaseConfigured()) return;
        const { data } = await supabase
          .from("user_buildings")
          .select("*")
          .eq("user_id", userId);
        if (data) {
          set({
            buildings: data.map((row) => ({
              userId: row.user_id,
              buildingKey: row.building_key,
              level: row.level,
            })),
          });
        }
      },

      buildOrUpgrade: async (userId: string, buildingKey: string) => {
        const buildingDef = BUILDINGS.find((b) => b.key === buildingKey);
        if (!buildingDef) return false;

        const current = get().buildings.find((b) => b.buildingKey === buildingKey);
        const currentLevel = current?.level ?? 0;
        const nextLevel = currentLevel + 1;

        if (nextLevel > buildingDef.maxLevel) return false;

        const costDef = buildingDef.levelCosts.find((c) => c.level === nextLevel);
        if (!costDef) return false;

        const spent = await useWalletStore.getState().spendResources(userId, {
          coins: costDef.coins,
          wood: costDef.wood,
          fabric: costDef.fabric,
          fish: costDef.fish,
        });
        if (!spent) return false;

        const updated: UserBuilding = { userId, buildingKey, level: nextLevel };
        set({
          buildings: [
            ...get().buildings.filter((b) => b.buildingKey !== buildingKey),
            updated,
          ],
        });

        if (isSupabaseConfigured()) {
          await supabase.from("user_buildings").upsert({
            user_id: userId,
            building_key: buildingKey,
            level: nextLevel,
            built_at: new Date().toISOString(),
          });
        }

        return true;
      },
    }),
    { name: "meow_buildings" }
  )
);

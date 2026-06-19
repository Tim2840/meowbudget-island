import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ResourceWallet, ResourceType } from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface WalletState {
  wallet: Omit<ResourceWallet, "userId" | "updatedAt">;
  loadWallet: (userId: string) => Promise<void>;
  addResources: (userId: string, coins: number, resourceType: ResourceType | null, resourceAmount: number) => Promise<void>;
  spendResources: (userId: string, costs: { coins?: number; wood?: number; fabric?: number; fish?: number }) => Promise<boolean>;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      wallet: { coins: 0, wood: 0, fabric: 0, fish: 0 },

      loadWallet: async (userId: string) => {
        if (!isSupabaseConfigured()) return;
        const { data } = await supabase
          .from("resource_wallets")
          .select("*")
          .eq("user_id", userId)
          .single();
        if (data) {
          set({ wallet: { coins: data.coins, wood: data.wood, fabric: data.fabric, fish: data.fish } });
        } else {
          await supabase.from("resource_wallets").upsert({ user_id: userId, coins: 0, wood: 0, fabric: 0, fish: 0 });
        }
      },

      addResources: async (userId, coins, resourceType, resourceAmount) => {
        const current = get().wallet;
        const updated = { ...current, coins: current.coins + coins };
        if (resourceType && resourceType !== "coins") {
          updated[resourceType] = current[resourceType] + resourceAmount;
        }
        set({ wallet: updated });

        if (isSupabaseConfigured()) {
          await supabase.from("resource_wallets").update({
            coins: updated.coins,
            wood: updated.wood,
            fabric: updated.fabric,
            fish: updated.fish,
            updated_at: new Date().toISOString(),
          }).eq("user_id", userId);
        }
      },

      spendResources: async (userId, costs) => {
        const current = get().wallet;
        // Check if enough resources
        if ((costs.coins ?? 0) > current.coins) return false;
        if ((costs.wood ?? 0) > current.wood) return false;
        if ((costs.fabric ?? 0) > current.fabric) return false;
        if ((costs.fish ?? 0) > current.fish) return false;

        const updated = {
          coins: current.coins - (costs.coins ?? 0),
          wood: current.wood - (costs.wood ?? 0),
          fabric: current.fabric - (costs.fabric ?? 0),
          fish: current.fish - (costs.fish ?? 0),
        };
        set({ wallet: updated });

        if (isSupabaseConfigured()) {
          await supabase.from("resource_wallets").update({
            ...updated,
            updated_at: new Date().toISOString(),
          }).eq("user_id", userId);
        }
        return true;
      },
    }),
    { name: "meow_wallet" }
  )
);

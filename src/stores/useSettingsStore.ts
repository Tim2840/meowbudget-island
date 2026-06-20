import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

type SettingKey = "soundEnabled" | "animationsEnabled" | "notificationsEnabled";

interface SettingsState {
  soundEnabled: boolean;
  animationsEnabled: boolean;
  notificationsEnabled: boolean;
  loadSettings: (userId: string) => Promise<void>;
  setSetting: (userId: string, key: SettingKey, value: boolean) => Promise<void>;
}

const COLUMN: Record<SettingKey, string> = {
  soundEnabled: "sound_enabled",
  animationsEnabled: "animations_enabled",
  notificationsEnabled: "notifications_enabled",
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      soundEnabled: true,
      animationsEnabled: true,
      notificationsEnabled: false,

      loadSettings: async (userId: string) => {
        if (!isSupabaseConfigured()) return;
        const { data } = await supabase
          .from("user_settings")
          .select("*")
          .eq("user_id", userId)
          .single();
        if (data) {
          set({
            soundEnabled: data.sound_enabled,
            animationsEnabled: data.animations_enabled,
            notificationsEnabled: data.notifications_enabled,
          });
        } else {
          const s = get();
          await supabase.from("user_settings").upsert({
            user_id: userId,
            sound_enabled: s.soundEnabled,
            animations_enabled: s.animationsEnabled,
            notifications_enabled: s.notificationsEnabled,
          });
        }
      },

      setSetting: async (userId, key, value) => {
        set({ [key]: value } as Pick<SettingsState, SettingKey>);
        if (isSupabaseConfigured()) {
          await supabase
            .from("user_settings")
            .update({ [COLUMN[key]]: value })
            .eq("user_id", userId);
        }
      },
    }),
    { name: "meow_settings" }
  )
);

"use client";

import { useTranslations } from "next-intl";
import { Lock, ChevronRight, Anchor, Store, TreePine } from "lucide-react";
import type { IslandZone } from "@/types";

interface IslandZoneCardProps {
  zone: IslandZone;
  currentLevel: number;
}

const ZONE_CONFIG: Record<string, {
  from: string; to: string; lightBg: string;
  accent: string; textAccent: string;
  Icon: React.ComponentType<{ size: number; strokeWidth: number; className?: string }>;
}> = {
  harbor: {
    from: "#0891B2", to: "#0E7490", lightBg: "#ECFEFF",
    accent: "#0891B2", textAccent: "#0E7490",
    Icon: Anchor,
  },
  market: {
    from: "#F59E0B", to: "#D97706", lightBg: "#FFFBEB",
    accent: "#F59E0B", textAccent: "#B45309",
    Icon: Store,
  },
  hill: {
    from: "#10B981", to: "#059669", lightBg: "#ECFDF5",
    accent: "#10B981", textAccent: "#065F46",
    Icon: TreePine,
  },
};

const DEFAULT_CONFIG = {
  from: "#6B7280", to: "#4B5563", lightBg: "#F9FAFB",
  accent: "#6B7280", textAccent: "#374151",
  Icon: Anchor,
};

export default function IslandZoneCard({ zone, currentLevel }: IslandZoneCardProps) {
  const t = useTranslations("zone");
  const tIsland = useTranslations("island");
  const unlocked = currentLevel >= zone.unlockLevel;
  const cfg = ZONE_CONFIG[zone.key] ?? DEFAULT_CONFIG;
  const { Icon } = cfg;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        opacity: unlocked ? 1 : 0.65,
        boxShadow: unlocked
          ? `0 2px 12px 0 ${cfg.from}30, 0 1px 3px 0 rgba(0,0,0,0.07)`
          : "0 1px 3px 0 rgba(0,0,0,0.07)",
      }}
    >
      <div className="flex items-stretch">
        {/* Colored icon panel */}
        <div
          className="w-[60px] flex items-center justify-center shrink-0"
          style={{ background: `linear-gradient(160deg, ${cfg.from}, ${cfg.to})` }}
        >
          <Icon size={24} strokeWidth={1.8} className="text-white opacity-95" />
        </div>

        {/* Content */}
        <div
          className="flex-1 flex items-center gap-3 px-4 py-3"
          style={{ backgroundColor: unlocked ? cfg.lightBg : "#F9FAFB" }}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-bold text-gray-800 text-[15px] leading-tight">{t(zone.key)}</p>
              {unlocked && (
                <span
                  className="text-[9px] font-extrabold tracking-wide uppercase px-1.5 py-0.5 rounded-full text-white leading-none shrink-0"
                  style={{ backgroundColor: cfg.accent }}
                >
                  OPEN
                </span>
              )}
            </div>
            <p className="text-xs mt-0.5" style={{ color: unlocked ? cfg.textAccent : "#9CA3AF" }}>
              {unlocked
                ? `${zone.slots.length} ${tIsland("empty_slot")}`
                : tIsland("unlock_zone_cost", { level: zone.unlockLevel })}
            </p>
          </div>

          {unlocked ? (
            <ChevronRight size={18} className="text-gray-300 shrink-0" />
          ) : (
            <div className="flex items-center gap-1 bg-gray-100 rounded-full px-2.5 py-1 shrink-0">
              <Lock size={11} className="text-gray-400" />
              <span className="text-[11px] font-bold text-gray-400">Lv{zone.unlockLevel}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { Lock, ChevronRight } from "lucide-react";
import type { IslandZone } from "@/types";
import { cn } from "@/lib/utils";

interface IslandZoneCardProps {
  zone: IslandZone;
  currentLevel: number;
}

const ZONE_EMOJI: Record<string, string> = {
  harbor: "⚓",
  market: "🏪",
  hill: "🌄",
};

export default function IslandZoneCard({ zone, currentLevel }: IslandZoneCardProps) {
  const t = useTranslations("zone");
  const tIsland = useTranslations("island");
  const unlocked = currentLevel >= zone.unlockLevel;

  return (
    <div className={cn(
      "bg-white rounded-2xl px-4 py-3 shadow-sm flex items-center gap-3",
      !unlocked && "opacity-60"
    )}>
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center text-2xl",
        unlocked ? "bg-amber-50" : "bg-gray-100"
      )}>
        {unlocked ? ZONE_EMOJI[zone.key] : <Lock size={20} className="text-gray-400" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800">{t(zone.key)}</p>
        <p className="text-xs text-gray-400 truncate">
          {unlocked
            ? `${zone.slots.length} ${tIsland("empty_slot")}`
            : tIsland("unlock_zone_cost", { level: zone.unlockLevel })}
        </p>
      </div>
      {unlocked && <ChevronRight size={18} className="text-gray-300" />}
    </div>
  );
}

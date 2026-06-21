"use client";

import { useTranslations } from "next-intl";
import { Lock, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import type { IslandZone } from "@/types";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/stores/useSettingsStore";
import GameIcon from "@/components/ui/GameIcon";
import { ZONE_ICON_MAP } from "@/lib/iconMap";

interface IslandZoneCardProps {
  zone: IslandZone;
  currentLevel: number;
  builtCount?: number;
  onClick?: () => void;
}

export default function IslandZoneCard({ zone, currentLevel, builtCount = 0, onClick }: IslandZoneCardProps) {
  const t = useTranslations("zone");
  const tIsland = useTranslations("island");
  const { animationsEnabled } = useSettingsStore();
  const unlocked = currentLevel >= zone.unlockLevel;
  const interactive = unlocked && !!onClick;

  const cardContent = (
    <div
      className={cn(
        "bg-white rounded-2xl px-4 py-3 shadow-sm flex items-center gap-3 transition-colors",
        !unlocked && "opacity-60",
        interactive && "cursor-pointer active:bg-amber-50"
      )}
      onClick={interactive ? onClick : undefined}
    >
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center",
        unlocked ? "bg-amber-50" : "bg-gray-100"
      )}>
        {unlocked
          ? <GameIcon icon={ZONE_ICON_MAP[zone.key]} size={30} />
          : <Lock size={20} className="text-gray-400" />
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800">{t(zone.key)}</p>
        <p className="text-xs text-gray-400 truncate">
          {unlocked
            ? tIsland("slots_progress", { built: builtCount, total: zone.slots.length })
            : tIsland("unlock_zone_cost", { level: zone.unlockLevel })}
        </p>
      </div>
      {unlocked && <ChevronRight size={18} className="text-gray-300" />}
    </div>
  );

  if (!interactive || !animationsEnabled) return cardContent;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {cardContent}
    </motion.div>
  );
}

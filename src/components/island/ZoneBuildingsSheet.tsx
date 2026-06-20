"use client";

import { useTranslations } from "next-intl";
import { X, ChevronRight } from "lucide-react";
import type { Building, IslandZone } from "@/types";
import { BUILDINGS } from "@/lib/constants";
import { useBuildingStore } from "@/stores/useBuildingStore";
import { useProfileStore } from "@/stores/useProfileStore";
import MotionSheet from "@/components/ui/MotionSheet";

interface ZoneBuildingsSheetProps {
  zone: IslandZone;
  onClose: () => void;
  onSelectBuilding: (building: Building) => void;
}

const ZONE_EMOJI: Record<string, string> = {
  harbor: "⚓",
  market: "🏪",
  hill: "🌄",
};

export default function ZoneBuildingsSheet({
  zone,
  onClose,
  onSelectBuilding,
}: ZoneBuildingsSheetProps) {
  const tZone = useTranslations("zone");
  const tIsland = useTranslations("island");
  const tBld = useTranslations("building");
  const { buildings } = useBuildingStore();
  const { profile } = useProfileStore();
  const userLevel = profile?.level ?? 1;

  const zoneBuildings = BUILDINGS.filter((b) => b.zoneKey === zone.key);

  return (
    <MotionSheet
      onClose={onClose}
      cardClassName="overflow-y-auto"
      cardStyle={{
        maxHeight: "85vh",
        paddingBottom: "max(5rem, calc(4rem + env(safe-area-inset-bottom)))",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-xl">{ZONE_EMOJI[zone.key]}</span>
          <div>
            <h2 className="text-base font-bold text-gray-900">
              {tZone(zone.key)}
            </h2>
            <p className="text-xs text-gray-400">
              {tIsland("buildings_in_zone")}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
      </div>

      {/* Building list */}
      <div className="divide-y divide-gray-50">
        {zoneBuildings.map((building) => {
          const userBuilding = buildings.find(
            (ub) => ub.buildingKey === building.key
          );
          const currentLevel = userBuilding?.level ?? 0;
          const isMaxLevel = currentLevel >= building.maxLevel;
          const lv1Cost = building.levelCosts.find((c) => c.level === 1);
          const levelLocked =
            !userBuilding && lv1Cost
              ? userLevel < lv1Cost.requiredUserLevel
              : false;

          const nameKey = building.nameKey.replace("building.", "");

          let badgeText: string;
          let badgeCls: string;
          if (isMaxLevel) {
            badgeText = "MAX";
            badgeCls = "bg-amber-100 text-amber-600";
          } else if (levelLocked && lv1Cost) {
            badgeText = tIsland("unlock_zone_cost", { level: lv1Cost.requiredUserLevel });
            badgeCls = "bg-gray-100 text-gray-400";
          } else if (currentLevel > 0) {
            badgeText = `Lv.${currentLevel}/${building.maxLevel}`;
            badgeCls = "bg-blue-50 text-blue-500";
          } else {
            badgeText = tIsland("build");
            badgeCls = "bg-green-50 text-green-600";
          }

          const clickable = !levelLocked;

          return (
            <button
              key={building.key}
              className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors ${
                clickable
                  ? "hover:bg-amber-50 active:bg-amber-100"
                  : "opacity-50 cursor-not-allowed"
              }`}
              onClick={() => clickable && onSelectBuilding(building)}
              disabled={!clickable}
            >
              {/* Building icon + level bar */}
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-2xl">
                  {building.imageKey}
                </div>
                {currentLevel > 0 && (
                  <div className="absolute -bottom-1 left-0 right-0 flex gap-0.5 px-1">
                    {Array.from({ length: building.maxLevel }, (_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full ${
                          i < currentLevel ? "bg-amber-400" : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Name + desc */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm">
                  {tBld(nameKey)}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {tBld(`${nameKey}_desc`)}
                </p>
              </div>

              {/* Badge + chevron */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badgeCls}`}>
                  {badgeText}
                </span>
                {clickable && !isMaxLevel && (
                  <ChevronRight size={16} className="text-gray-300" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </MotionSheet>
  );
}

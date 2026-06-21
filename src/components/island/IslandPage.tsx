"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useProfileStore } from "@/stores/useProfileStore";
import { ISLAND_ZONES } from "@/lib/constants";
import IslandZoneCard from "./IslandZoneCard";
import LevelBar from "./LevelBar";

// Representative building image shown on the island for each zone. The same
// cut-out (background-removed) art is used for both the unlocked and locked
// states — locked zones simply render it greyed-out — so the scene never falls
// back to emoji or a broken image. Only assets that actually exist under
// /public/assets/buildings are referenced here.
const ZONE_BUILDING: Record<string, string> = {
  harbor: "harbor_lighthouse",
  market: "market_stall",
  hill: "hill_windmill",
};

export default function IslandPage() {
  const t = useTranslations("island");
  const { profile } = useProfileStore();
  const level = profile?.level ?? 1;

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="px-4 pt-5 pb-3 bg-gradient-to-b from-sky-300 to-sky-100">
        <h1 className="text-2xl font-bold text-gray-800">{t("title")}</h1>
        <div className="mt-2">
          <LevelBar level={level} exp={profile?.exp ?? 0} />
        </div>
      </div>

      {/* Island scene */}
      <div className="relative overflow-hidden" style={{ height: 288 }}>
        {/* Background art */}
        <Image
          src="/assets/island_bg.png"
          alt={t("title")}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-[1.35]"
        />

        {/* Zone markers on island */}
        {ISLAND_ZONES.map((zone) => {
          const unlocked = level >= zone.unlockLevel;
          const buildingImg = ZONE_BUILDING[zone.key];
          return (
            <div
              key={zone.key}
              className="absolute"
              style={{ left: `${zone.position.x}%`, top: `${zone.position.y}%`, transform: "translate(-50%, -50%)" }}
            >
              {unlocked ? (
                <div className="relative flex flex-col items-center animate-bounce-in">
                  {/* Soft glow to lift the building off the busy background */}
                  <span className="absolute top-7 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/45 blur-md" />
                  <Image
                    src={`/assets/buildings/${buildingImg}.png`}
                    alt={zone.key}
                    width={72}
                    height={72}
                    className="relative drop-shadow-[0_5px_8px_rgba(0,0,0,0.5)]"
                  />
                  <div className="-mt-1 bg-amber-500 rounded-full w-2.5 h-2.5 shadow ring-2 ring-white/70" />
                </div>
              ) : (
                <div className="relative flex flex-col items-center animate-bounce-in">
                  {/* Locked zones reuse the cut-out building art, greyed out */}
                  <span className="absolute top-7 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/40 blur-md" />
                  <Image
                    src={`/assets/buildings/${buildingImg}.png`}
                    alt={zone.key}
                    width={72}
                    height={72}
                    className="relative grayscale opacity-65 drop-shadow-[0_4px_6px_rgba(0,0,0,0.45)]"
                  />
                  <div className="absolute -top-1 -right-2 flex items-center gap-0.5 bg-gray-800/90 rounded-full px-1.5 py-0.5 shadow ring-1 ring-white/40">
                    <span className="text-[9px] text-white font-bold leading-none">🔒Lv{zone.unlockLevel}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Zone list */}
      <div className="px-4 pt-4 pb-4 space-y-3 bg-amber-50 flex-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">島嶼區域</p>
        {ISLAND_ZONES.map((zone) => (
          <IslandZoneCard key={zone.key} zone={zone} currentLevel={level} />
        ))}
      </div>
    </div>
  );
}

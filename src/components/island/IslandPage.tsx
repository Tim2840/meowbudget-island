"use client";

import { useTranslations } from "next-intl";
import { useProfileStore } from "@/stores/useProfileStore";
import { ISLAND_ZONES } from "@/lib/constants";
import IslandZoneCard from "./IslandZoneCard";
import LevelBar from "./LevelBar";

const ZONE_ICONS: Record<string, string> = {
  harbor: "⚓",
  market: "🏪",
  hill: "🌄",
};

const ZONE_COLORS: Record<string, { bg: string; border: string }> = {
  harbor: { bg: "bg-blue-100", border: "border-blue-300" },
  market: { bg: "bg-yellow-100", border: "border-yellow-300" },
  hill: { bg: "bg-green-100", border: "border-green-300" },
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
      <div className="relative bg-gradient-to-b from-sky-200 to-sky-100 overflow-hidden" style={{ height: 240 }}>
        {/* Clouds */}
        <div className="absolute top-4 left-6 w-16 h-6 bg-white rounded-full opacity-80" />
        <div className="absolute top-3 left-10 w-24 h-8 bg-white rounded-full opacity-90" />
        <div className="absolute top-6 right-8 w-20 h-6 bg-white rounded-full opacity-75" />
        <div className="absolute top-4 right-12 w-12 h-5 bg-white rounded-full opacity-85" />

        {/* Sun */}
        <div className="absolute top-5 right-6 w-10 h-10 bg-yellow-300 rounded-full shadow-[0_0_20px_8px_rgba(253,224,71,0.4)]" />

        {/* Ocean */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-blue-300 to-blue-500 opacity-80" />
        {/* Ocean waves */}
        <div className="absolute bottom-16 inset-x-0 h-4 opacity-30">
          <svg viewBox="0 0 400 16" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,8 Q50,0 100,8 Q150,16 200,8 Q250,0 300,8 Q350,16 400,8 L400,16 L0,16 Z" fill="#60a5fa" />
          </svg>
        </div>

        {/* Island ground */}
        <div
          className="absolute bg-gradient-to-b from-green-400 to-green-600 rounded-[50%]"
          style={{ left: "8%", right: "8%", bottom: 12, height: 120 }}
        />
        {/* Sandy beach ring */}
        <div
          className="absolute bg-amber-200 rounded-[50%] opacity-60"
          style={{ left: "10%", right: "10%", bottom: 10, height: 30 }}
        />

        {/* Decorative trees */}
        <div className="absolute text-2xl" style={{ left: "12%", bottom: 70 }}>🌴</div>
        <div className="absolute text-xl" style={{ right: "14%", bottom: 65 }}>🌴</div>
        <div className="absolute text-lg" style={{ left: "30%", bottom: 82 }}>🌿</div>
        <div className="absolute text-lg" style={{ right: "28%", bottom: 78 }}>🌿</div>

        {/* Zone icons on island */}
        {ISLAND_ZONES.map((zone) => {
          const unlocked = level >= zone.unlockLevel;
          const colors = ZONE_COLORS[zone.key] ?? { bg: "bg-white", border: "border-gray-200" };
          return (
            <div
              key={zone.key}
              className="absolute"
              style={{ left: `${zone.position.x}%`, top: `${zone.position.y}%`, transform: "translate(-50%, -50%)" }}
            >
              <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center shadow-md border-2 transition-all animate-bounce-in ${
                unlocked ? `${colors.bg} ${colors.border}` : "bg-gray-100 border-gray-300 opacity-50"
              }`}>
                <span className="text-2xl">{ZONE_ICONS[zone.key]}</span>
                {!unlocked && (
                  <div className="absolute -top-1.5 -right-1.5 bg-gray-700 rounded-full px-1.5 py-0.5 shadow">
                    <span className="text-[9px] text-white font-bold">Lv{zone.unlockLevel}</span>
                  </div>
                )}
                {unlocked && (
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-amber-500 rounded-full w-2 h-2 shadow" />
                )}
              </div>
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

"use client";

import { useTranslations } from "next-intl";
import { useProfileStore } from "@/stores/useProfileStore";
import { ISLAND_ZONES } from "@/lib/constants";
import IslandZoneCard from "./IslandZoneCard";
import LevelBar from "./LevelBar";
import CatLayer from "./CatLayer";
import ParticleLayer from "./ParticleLayer";
import BuildingIcon from "./BuildingIcon";

const ZONE_BUILDING: Record<string, string> = {
  harbor: "harbor_lighthouse",
  market: "market_stall",
  hill: "hill_windmill",
};

function getDayNight(hour: number): {
  skyFrom: string; skyTo: string;
  overlayColor: string; overlayOpacity: number; stars: boolean;
} {
  if (hour >= 6 && hour < 17) return {
    skyFrom: "#87CEEB", skyTo: "#E0F4FF",
    overlayColor: "transparent", overlayOpacity: 0, stars: false,
  };
  if (hour >= 17 && hour < 19) return {
    skyFrom: "#F97316", skyTo: "#FDE68A",
    overlayColor: "#FB923C", overlayOpacity: 0.15, stars: false,
  };
  if (hour >= 19 && hour < 22) return {
    skyFrom: "#312E81", skyTo: "#6D28D9",
    overlayColor: "#312E81", overlayOpacity: 0.3, stars: false,
  };
  return {
    skyFrom: "#0F172A", skyTo: "#1E293B",
    overlayColor: "#0F172A", overlayOpacity: 0.5, stars: true,
  };
}

// Soft Ghibli-style cloud
function Cloud({ w = 96, opacity = 0.88, className }: { w?: number; opacity?: number; className?: string }) {
  const h = Math.round(w * 0.42);
  return (
    <svg viewBox="0 0 96 40" width={w} height={h} className={className} style={{ opacity }}>
      <defs>
        <filter id="blur-cloud" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
        </filter>
      </defs>
      {/* Shadow blob */}
      <ellipse cx="48" cy="38" rx="38" ry="6" fill="#94A3B8" opacity="0.12" filter="url(#blur-cloud)" />
      {/* Cloud body */}
      <ellipse cx="48" cy="28" rx="36" ry="14" fill="white" />
      <ellipse cx="30" cy="26" rx="22" ry="15" fill="white" />
      <ellipse cx="65" cy="27" rx="24" ry="14" fill="white" />
      <ellipse cx="48" cy="20" rx="28" ry="18" fill="white" />
      {/* Highlight */}
      <ellipse cx="38" cy="16" rx="18" ry="9" fill="white" opacity="0.6" />
    </svg>
  );
}

export default function IslandPage() {
  const t = useTranslations("island");
  const { profile } = useProfileStore();
  const level = profile?.level ?? 1;

  const hour = new Date().getHours();
  const dn = getDayNight(hour);

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div
        className="px-4 pt-4 pb-3 transition-all duration-[3000ms]"
        style={{ background: `linear-gradient(to bottom, ${dn.skyFrom}, ${dn.skyTo})` }}
      >
        <h1 className="text-xl font-bold text-white drop-shadow-sm">{t("title")}</h1>
        <div className="mt-2">
          <LevelBar level={level} exp={profile?.exp ?? 0} />
        </div>
      </div>

      {/* Island scene */}
      <div
        data-tutorial="island-scene"
        className="relative overflow-hidden"
        style={{
          height: 300,
          background: `linear-gradient(to bottom, ${dn.skyFrom} 0%, ${dn.skyTo} 45%, #4ADE80 45%, #16A34A 60%, #166534 100%)`,
        }}
      >
        {/* Ocean strip */}
        <div
          className="absolute left-0 right-0"
          style={{ bottom: 0, height: "42%", background: "linear-gradient(to bottom, #38BDF8 0%, #0284C7 60%, #0369A1 100%)" }}
        />
        {/* Ocean shimmer */}
        <div className="absolute left-0 right-0 pointer-events-none" style={{ bottom: "26%", height: 12 }}>
          {[8, 20, 33, 46, 58, 70, 82].map((x, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{ left: `${x}%`, top: 0, width: 24, height: 3, opacity: 0.18 + (i % 3) * 0.06 }}
            />
          ))}
        </div>

        {/* Cloud layer */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
          <div className="absolute animate-cloud" style={{ left: "3%", top: "4%" }}>
            <Cloud w={104} />
          </div>
          <div className="absolute animate-cloud-r" style={{ left: "40%", top: "2%", opacity: 0.8 }}>
            <Cloud w={80} />
          </div>
          <div className="absolute animate-cloud" style={{ left: "68%", top: "6%", opacity: 0.72 }}>
            <Cloud w={88} />
          </div>
        </div>

        {/* Particles */}
        <ParticleLayer />

        {/* Zone building icons */}
        <div className="absolute inset-0" style={{ zIndex: 5 }}>
          {ISLAND_ZONES.map((zone) => {
            const unlocked = level >= zone.unlockLevel;
            const buildingType = ZONE_BUILDING[zone.key] ?? "";
            return (
              <div
                key={zone.key}
                className="absolute"
                style={{
                  left: `${zone.position.x}%`,
                  top: `${zone.position.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {unlocked ? (
                  <div className="relative flex flex-col items-center animate-bounce-in">
                    {/* Soft glow underneath */}
                    <span
                      className="absolute rounded-full"
                      style={{
                        width: 80, height: 80,
                        top: "50%", left: "50%",
                        transform: "translate(-50%, -40%)",
                        background: "radial-gradient(ellipse, rgba(255,255,255,0.55) 0%, transparent 70%)",
                        filter: "blur(4px)",
                      }}
                    />
                    <div className="relative drop-shadow-[0_6px_10px_rgba(0,0,0,0.4)]">
                      <BuildingIcon type={buildingType} size={80} />
                    </div>
                    <div className="mt-0.5 w-2.5 h-2.5 rounded-full bg-amber-400 shadow ring-2 ring-white/80" />
                  </div>
                ) : (
                  <div className="relative flex flex-col items-center animate-bounce-in">
                    <span
                      className="absolute rounded-full"
                      style={{
                        width: 70, height: 70,
                        top: "50%", left: "50%",
                        transform: "translate(-50%, -40%)",
                        background: "radial-gradient(ellipse, rgba(255,255,255,0.3) 0%, transparent 70%)",
                        filter: "blur(4px)",
                      }}
                    />
                    <div className="relative drop-shadow-[0_4px_6px_rgba(0,0,0,0.35)]" style={{ filter: "grayscale(85%) opacity(0.6)" }}>
                      <BuildingIcon type={buildingType} size={72} />
                    </div>
                    <div className="absolute -top-2 -right-3 flex items-center gap-0.5 bg-gray-800/90 rounded-full px-1.5 py-0.5 shadow ring-1 ring-white/30">
                      <span className="text-[9px] text-white font-bold leading-none">🔒Lv{zone.unlockLevel}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Walking cats */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 8 }}>
          <CatLayer />
        </div>

        {/* Day/Night overlay */}
        {dn.overlayOpacity > 0 && (
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-[3000ms]"
            style={{ backgroundColor: dn.overlayColor, opacity: dn.overlayOpacity, zIndex: 15 }}
          />
        )}

        {/* Night stars */}
        {dn.stars && (
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 16 }}>
            {[
              [15, 8], [28, 5], [52, 7], [70, 4], [84, 11],
              [20, 18], [46, 14], [77, 16], [91, 7], [62, 20],
            ].map(([x, y], i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${x}%`, top: `${y}%`,
                  width: i % 3 === 0 ? 3 : 2,
                  height: i % 3 === 0 ? 3 : 2,
                  opacity: 0.6 + (i % 4) * 0.1,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Zone list */}
      <div className="px-4 pt-4 pb-4 space-y-3 bg-amber-50 flex-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t("zones")}</p>
        {ISLAND_ZONES.map((zone) => (
          <IslandZoneCard key={zone.key} zone={zone} currentLevel={level} />
        ))}
      </div>
    </div>
  );
}

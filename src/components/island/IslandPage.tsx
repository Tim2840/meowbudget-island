"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useProfileStore } from "@/stores/useProfileStore";
import { ISLAND_ZONES } from "@/lib/constants";
import IslandZoneCard from "./IslandZoneCard";
import LevelBar from "./LevelBar";
import CatLayer from "./CatLayer";
import ParticleLayer from "./ParticleLayer";

const ZONE_BUILDING: Record<string, string> = {
  harbor: "harbor_lighthouse",
  market: "market_stall",
  hill: "hill_windmill",
};

function getDayNightStyle(hour: number): { overlayColor: string; opacity: number; stars: boolean } {
  if (hour >= 6 && hour < 17)  return { overlayColor: "transparent", opacity: 0, stars: false };
  if (hour >= 17 && hour < 19) return { overlayColor: "#FB923C", opacity: 0.18, stars: false };
  if (hour >= 19 && hour < 22) return { overlayColor: "#312E81", opacity: 0.32, stars: false };
  return { overlayColor: "#0F172A", opacity: 0.52, stars: true };
}

// Simple 3-ellipse cloud SVG
function Cloud({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 32" width={80} height={32} className={className}>
      <ellipse cx="40" cy="22" rx="30" ry="12" fill="white" opacity="0.75" />
      <ellipse cx="25" cy="20" rx="18" ry="10" fill="white" opacity="0.75" />
      <ellipse cx="57" cy="21" rx="20" ry="10" fill="white" opacity="0.75" />
      <ellipse cx="40" cy="14" rx="20" ry="12" fill="white" opacity="0.75" />
    </svg>
  );
}

export default function IslandPage() {
  const t = useTranslations("island");
  const { profile } = useProfileStore();
  const level = profile?.level ?? 1;

  const hour = new Date().getHours();
  const dn = getDayNightStyle(hour);

  const headerGradient =
    hour >= 22 || hour < 6 ? "from-slate-700 to-slate-500"
    : hour >= 19 ? "from-indigo-700 to-indigo-400"
    : hour >= 17 ? "from-orange-400 to-amber-200"
    : "from-sky-300 to-sky-100";

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className={`px-4 pt-4 pb-3 bg-gradient-to-b ${headerGradient} transition-all duration-[3000ms]`}>
        <h1 className="text-xl font-bold text-gray-800">{t("title")}</h1>
        <div className="mt-2">
          <LevelBar level={level} exp={profile?.exp ?? 0} />
        </div>
      </div>

      {/* Island scene */}
      <div data-tutorial="island-scene" className="relative overflow-hidden" style={{ height: 288 }}>
        {/* Background */}
        <Image
          src="/assets/island_bg.png"
          alt={t("title")}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Cloud layer */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
          <div className="absolute animate-cloud" style={{ left: "5%", top: "6%" }}>
            <Cloud />
          </div>
          <div className="absolute animate-cloud-r" style={{ left: "42%", top: "4%", opacity: 0.85 }}>
            <Cloud className="scale-75" />
          </div>
          <div className="absolute animate-cloud" style={{ left: "70%", top: "8%", opacity: 0.7 }}>
            <Cloud className="scale-90" />
          </div>
        </div>

        {/* Particles: falling leaves + flying birds */}
        <ParticleLayer />

        {/* Zone markers */}
        <div className="absolute inset-0" style={{ zIndex: 5 }}>
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

        {/* Walking cats */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 8 }}>
          <CatLayer />
        </div>

        {/* Day/Night overlay */}
        {dn.opacity > 0 && (
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-[3000ms]"
            style={{ backgroundColor: dn.overlayColor, opacity: dn.opacity, zIndex: 15 }}
          />
        )}

        {/* Night stars */}
        {dn.stars && (
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 16 }}>
            {[
              [15, 10], [30, 6], [55, 8], [70, 5], [85, 12],
              [20, 20], [48, 15], [78, 18], [92, 8], [62, 22],
            ].map(([x, y], i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{ left: `${x}%`, top: `${y}%`, width: i % 3 === 0 ? 3 : 2, height: i % 3 === 0 ? 3 : 2, opacity: 0.6 + (i % 4) * 0.1 }}
              />
            ))}
          </div>
        )}
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

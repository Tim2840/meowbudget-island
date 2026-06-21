"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Target, Trophy } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useProfileStore } from "@/stores/useProfileStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useBuildingStore } from "@/stores/useBuildingStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { ISLAND_ZONES, CAT_DEFINITIONS, BUILDINGS } from "@/lib/constants";
import IslandZoneCard from "./IslandZoneCard";
import BuildingModal from "./BuildingModal";
import ZoneBuildingsSheet from "./ZoneBuildingsSheet";
import LevelBar from "./LevelBar";
import Cat from "@/components/cats/Cat";
import GameIcon from "@/components/ui/GameIcon";
import { ZONE_ICON_MAP, BUILDING_ICON_MAP } from "@/lib/iconMap";

// ── Day/night ───────────────────────────────────────────────
type TimePeriod = "day" | "dusk" | "evening" | "night";

function getTimePeriod(h: number): TimePeriod {
  if (h >= 6 && h < 17) return "day";
  if (h >= 17 && h < 19) return "dusk";
  if (h >= 19 && h < 22) return "evening";
  return "night";
}

const TIME_CFG: Record<TimePeriod, {
  skyCls: string;
  oceanCls: string;
  sunColor: string;
  sunGlow: string;
  showMoon: boolean;
  showStars: boolean;
  cloudOpacity: number;
}> = {
  day: {
    skyCls: "from-sky-400 to-sky-200",
    oceanCls: "from-blue-300 to-blue-500",
    sunColor: "#FDE047",
    sunGlow: "rgba(253,224,71,0.45)",
    showMoon: false,
    showStars: false,
    cloudOpacity: 0.88,
  },
  dusk: {
    skyCls: "from-orange-400 to-amber-200",
    oceanCls: "from-orange-300 to-blue-400",
    sunColor: "#FB923C",
    sunGlow: "rgba(251,146,60,0.5)",
    showMoon: false,
    showStars: false,
    cloudOpacity: 0.75,
  },
  evening: {
    skyCls: "from-indigo-800 to-indigo-500",
    oceanCls: "from-indigo-700 to-blue-900",
    sunColor: "#C7D2FE",
    sunGlow: "rgba(199,210,254,0.35)",
    showMoon: true,
    showStars: true,
    cloudOpacity: 0.3,
  },
  night: {
    skyCls: "from-slate-900 to-indigo-950",
    oceanCls: "from-slate-800 to-slate-900",
    sunColor: "#E2E8F0",
    sunGlow: "rgba(226,232,240,0.25)",
    showMoon: true,
    showStars: true,
    cloudOpacity: 0.15,
  },
};

// ── Cat wandering positions (% of scene w/h) ────────────────
const WANDER_SPOTS = [
  { x: 22, y: 62 },
  { x: 38, y: 68 },
  { x: 50, y: 60 },
  { x: 63, y: 65 },
  { x: 75, y: 62 },
  { x: 30, y: 72 },
  { x: 58, y: 72 },
];

function pickSpot(currentX: number) {
  const others = WANDER_SPOTS.filter((s) => Math.abs(s.x - currentX) > 10);
  return others[Math.floor(Math.random() * others.length)] ?? WANDER_SPOTS[0];
}

// ── Leaves (CSS-only particle) ───────────────────────────────
const LEAVES = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  left: `${10 + i * 15}%`,
  delay: `${i * 1.8}s`,
  duration: `${6 + i * 1.2}s`,
  emoji: i % 3 === 0 ? "🍃" : i % 3 === 1 ? "🌿" : "🍂",
}));

// Zone highlight overlay config — bounding box (%) that wraps all slots in each zone
const ZONE_HIGHLIGHT: Record<string, {
  cls: string;
  left: string; top: string; width: string; height: string;
}> = {
  harbor: { cls: "border-blue-400 bg-blue-200/25",   left: "5%",  top: "55%", width: "65%", height: "26%" },
  market: { cls: "border-amber-400 bg-amber-200/25", left: "14%", top: "30%", width: "76%", height: "30%" },
  hill:   { cls: "border-green-400 bg-green-200/25", left: "17%", top: "4%",  width: "59%", height: "26%" },
};

export default function IslandPage() {
  const t = useTranslations("island");
  const { profile } = useProfileStore();
  const { user } = useAuthStore();
  const { buildings, buildOrUpgrade } = useBuildingStore();
  const { animationsEnabled } = useSettingsStore();
  const level = profile?.level ?? 1;

  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [selectedZoneKey, setSelectedZoneKey] = useState<string | null>(null);
  const [activeZoneKey, setActiveZoneKey] = useState<string | null>(null);
  const [lastBuiltSlotId, setLastBuiltSlotId] = useState<string | null>(null);

  const selectedBuildingDef = selectedSlotId
    ? BUILDINGS.find((b) => b.slotId === selectedSlotId) ?? null
    : null;
  const selectedUserBuilding = selectedBuildingDef
    ? buildings.find((ub) => ub.buildingKey === selectedBuildingDef.key) ?? null
    : null;
  const selectedZone = selectedZoneKey
    ? ISLAND_ZONES.find((z) => z.key === selectedZoneKey) ?? null
    : null;

  const handleBuild = async () => {
    if (!selectedBuildingDef || !user) return;
    const ok = await buildOrUpgrade(user.id, selectedBuildingDef.key);
    if (ok) {
      if (animationsEnabled) {
        confetti({
          particleCount: 80,
          spread: 60,
          colors: ["#F59E0B", "#FCD34D", "#FEF08A"],
          origin: { y: 0.6 },
        });
      }
      setLastBuiltSlotId(selectedBuildingDef.slotId);
      setSelectedSlotId(null);
    }
  };

  // ── Time of day ──
  const [period, setPeriod] = useState<TimePeriod>(() =>
    getTimePeriod(new Date().getHours())
  );
  useEffect(() => {
    const update = () => setPeriod(getTimePeriod(new Date().getHours()));
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);
  const cfg = TIME_CFG[period];

  // ── Parallax ──
  const [parallax, setParallax] = useState(0); // -1 to 1
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma == null) return;
      setParallax(Math.max(-1, Math.min(1, e.gamma / 30)));
    };
    const handleMouse = (e: MouseEvent) => {
      setParallax((e.clientX / window.innerWidth - 0.5) * 2);
    };
    window.addEventListener("deviceorientation", handleOrientation);
    window.addEventListener("mousemove", handleMouse);
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  // ── Cat wander ──
  const catKey = CAT_DEFINITIONS[0].key; // captain, always unlocked at Lv1
  const [catPos, setCatPos] = useState(WANDER_SPOTS[0]);
  const [catState, setCatState] = useState<"idle" | "walk">("idle");
  const [catFlip, setCatFlip] = useState(false);
  const catPosRef = useRef(WANDER_SPOTS[0]);

  useEffect(() => {
    const move = () => {
      const next = pickSpot(catPosRef.current.x);
      setCatFlip(next.x < catPosRef.current.x);
      catPosRef.current = next;
      setCatState("walk");
      setCatPos(next);
      setTimeout(() => setCatState("idle"), 2200);
    };
    const id = setInterval(move, 5000 + Math.random() * 3000);
    return () => clearInterval(id);
  }, []);

  const slotSpring = animationsEnabled
    ? { type: "spring" as const, damping: 12, stiffness: 400 }
    : { duration: 0 };

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className={`px-4 pt-5 pb-3 bg-gradient-to-b ${cfg.skyCls} transition-all duration-[3000ms]`}>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white drop-shadow">{t("title")}</h1>
          <div className="flex gap-2">
            <Link
              href="/quests"
              className="flex items-center gap-1 bg-white/25 backdrop-blur text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-white/35 transition-colors"
            >
              <Target size={14} /> {t("btn_quests")}
            </Link>
            <Link
              href="/achievements"
              className="flex items-center gap-1 bg-white/25 backdrop-blur text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-white/35 transition-colors"
            >
              <Trophy size={14} /> {t("btn_achievements")}
            </Link>
          </div>
        </div>
        <div className="mt-2">
          <LevelBar level={level} exp={profile?.exp ?? 0} />
        </div>
      </div>

      {/* ── Scene ── */}
      <div
        className={`relative overflow-hidden bg-gradient-to-b ${cfg.skyCls} transition-all duration-[3000ms]`}
        style={{ height: 300 }}
      >

        {/* Layer 1: Stars (night/evening) */}
        {cfg.showStars && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            {[12, 28, 45, 60, 75, 88, 20, 65].map((x, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white animate-pulse"
                style={{
                  left: `${x}%`,
                  top: `${8 + (i * 7) % 25}%`,
                  width: i % 3 === 0 ? 3 : 2,
                  height: i % 3 === 0 ? 3 : 2,
                  opacity: 0.6 + (i % 3) * 0.15,
                  animationDelay: `${i * 0.4}s`,
                  transform: `translateX(${parallax * 2}px)`,
                  transition: "transform 0.5s ease-out",
                }}
              />
            ))}
          </div>
        )}

        {/* Layer 2: Sun / Moon */}
        <div
          className="absolute z-20 rounded-full transition-all duration-[3000ms]"
          style={{
            top: 16,
            right: 28,
            width: 36,
            height: 36,
            background: cfg.sunColor,
            boxShadow: `0 0 22px 10px ${cfg.sunGlow}`,
            transform: `translateX(${parallax * 5}px)`,
            transition: "transform 0.5s ease-out, background 3s ease, box-shadow 3s ease",
          }}
        />

        {/* Layer 3: Clouds */}
        <div
          className="absolute inset-0 z-30 pointer-events-none"
          style={{
            transform: `translateX(${parallax * 10}px)`,
            transition: "transform 0.5s ease-out",
            opacity: cfg.cloudOpacity,
          }}
        >
          <div className="absolute top-4 left-6 w-16 h-6 bg-white rounded-full" />
          <div className="absolute top-3 left-10 w-24 h-8 bg-white rounded-full" />
          <div className="absolute top-6 right-8 w-20 h-6 bg-white rounded-full" />
          <div className="absolute top-4 right-12 w-12 h-5 bg-white rounded-full" />
        </div>

        {/* Layer 4: Falling leaves */}
        <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
          {LEAVES.map((leaf) => (
            <div
              key={leaf.id}
              className="absolute text-sm animate-leaf-fall"
              style={{
                left: leaf.left,
                top: "-20px",
                animationDelay: leaf.delay,
                animationDuration: leaf.duration,
              }}
            >
              {leaf.emoji}
            </div>
          ))}
        </div>

        {/* Layer 5: Ocean */}
        <div
          className={`absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b ${cfg.oceanCls} opacity-80 z-40 transition-all duration-[3000ms]`}
          style={{
            transform: `translateX(${parallax * 15}px)`,
            transition: "transform 0.5s ease-out",
          }}
        />
        {/* Wave shimmer */}
        <div className="absolute bottom-16 inset-x-0 h-4 opacity-30 z-50">
          <svg viewBox="0 0 400 16" preserveAspectRatio="none" className="w-full h-full animate-wave-shimmer">
            <path d="M0,8 Q50,0 100,8 Q150,16 200,8 Q250,0 300,8 Q350,16 400,8 L400,16 L0,16 Z" fill="#60a5fa" />
          </svg>
        </div>

        {/* Layer 6: Island ground */}
        <div
          className="absolute bg-gradient-to-b from-green-400 to-green-600 rounded-[50%] z-50"
          style={{
            left: "8%", right: "8%", bottom: 12, height: 120,
            transform: `translateX(${parallax * 0}px)`,
          }}
        />
        {/* Sandy beach — thin strip at island base, no oval shape */}
        <div
          className="absolute bg-amber-200 opacity-50 z-50"
          style={{ left: "12%", right: "12%", bottom: 10, height: 16, borderRadius: "0 0 50% 50% / 0 0 100% 100%" }}
        />

        {/* Decorative trees */}
        <div className="absolute text-2xl z-50" style={{ left: "12%", bottom: 70 }}>🌴</div>
        <div className="absolute text-xl z-50"  style={{ right: "14%", bottom: 65 }}>🌴</div>
        <div className="absolute text-lg z-50"  style={{ left: "30%",  bottom: 82 }}>🌿</div>
        <div className="absolute text-lg z-50"  style={{ right: "28%", bottom: 78 }}>🌿</div>

        {/* Layer 7: Zone icons — always visible */}
        {ISLAND_ZONES.map((zone) => {
          const unlocked = level >= zone.unlockLevel;
          const isActive = activeZoneKey === zone.key;
          return (
            <div
              key={zone.key}
              className="absolute z-[59] pointer-events-none"
              style={{
                left: `${zone.position.x}%`,
                top: `${zone.position.y}%`,
                transform: `translate(-50%, -50%) translateX(${parallax * 3}px)`,
                transition: "transform 0.5s ease-out",
              }}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow border transition-all duration-200 ${
                !unlocked
                  ? "bg-gray-100/80 border-gray-300/60 opacity-40"
                  : isActive
                    ? "bg-white border-white shadow-md scale-110"
                    : "bg-white/80 border-white/60"
              }`}>
                <GameIcon icon={ZONE_ICON_MAP[zone.key]} size={20} />
              </div>
              {!unlocked && (
                <div className="absolute -top-1 -right-1 bg-gray-600 rounded-full px-1 py-0.5">
                  <span className="text-[8px] text-white font-bold leading-none">Lv{zone.unlockLevel}</span>
                </div>
              )}
            </div>
          );
        })}

        {/* Layer 7b: Active zone highlight overlay */}
        <AnimatePresence>
          {activeZoneKey && ZONE_HIGHLIGHT[activeZoneKey] && (() => {
            const h = ZONE_HIGHLIGHT[activeZoneKey];
            return (
              <motion.div
                key={activeZoneKey}
                className={`absolute z-[58] rounded-2xl border-2 pointer-events-none ${h.cls}`}
                style={{ left: h.left, top: h.top, width: h.width, height: h.height }}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={animationsEnabled ? { duration: 0.2 } : { duration: 0 }}
              />
            );
          })()}</AnimatePresence>

        {/* Layer 7b: Building slots */}
        {ISLAND_ZONES.map((zone) => {
          const zoneUnlocked = level >= zone.unlockLevel;
          const zoneActive = activeZoneKey === zone.key;
          return zone.slots.map((slot) => {
            const buildingDef = BUILDINGS.find((b) => b.slotId === slot.slotId);
            const userBuilding = buildingDef
              ? buildings.find((ub) => ub.buildingKey === buildingDef.key) ?? null
              : null;
            // Empty slots only visible when their zone is active
            if (!userBuilding && !zoneActive) return null;
            return (
              <motion.button
                key={slot.slotId}
                className={`absolute z-[62] touch-manipulation ${!zoneUnlocked ? "pointer-events-none" : ""}`}
                style={{
                  left: `${slot.position.x}%`,
                  top: `${slot.position.y}%`,
                  transform: `translate(-50%, -50%) translateX(${parallax * 3}px)`,
                  transition: "transform 0.5s ease-out",
                }}
                whileTap={zoneUnlocked ? { scale: 0.9 } : undefined}
                onClick={() => { if (zoneUnlocked) setSelectedSlotId(slot.slotId); }}
              >
                {userBuilding ? (
                  <motion.div
                    key={`${buildingDef?.key}-lv${userBuilding.level}`}
                    initial={{ scale: slot.slotId === lastBuiltSlotId ? 0 : 1 }}
                    animate={{ scale: 1 }}
                    transition={slotSpring}
                    className="w-12 h-12 rounded-xl bg-white/90 shadow-md flex items-center justify-center border-2 border-amber-300"
                  >
                    <GameIcon icon={BUILDING_ICON_MAP[buildingDef!.key]} size={26} color="#92400e" />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={animationsEnabled ? { type: "spring", damping: 18, stiffness: 380 } : { duration: 0 }}
                    className="w-9 h-9 rounded-full flex items-center justify-center border-2 border-dashed bg-white/70 border-amber-400 shadow-sm"
                  >
                    <span className="text-amber-500 text-sm font-bold leading-none">+</span>
                  </motion.div>
                )}
              </motion.button>
            );
          });
        })}

        {/* Layer 8: Cat wandering */}
        <div
          className="absolute z-[65]"
          style={{
            left: `${catPos.x}%`,
            bottom: `${100 - catPos.y}%`,
            transform: "translateX(-50%)",
            transition: "left 2.2s ease-in-out, bottom 2.2s ease-in-out",
          }}
        >
          <Cat catId={catKey} state={catState} size={40} flip={catFlip} />
        </div>
      </div>

      {/* Zone list */}
      <div className="px-4 pt-4 pb-4 space-y-3 bg-amber-50 flex-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t("zones_label")}</p>
        {ISLAND_ZONES.map((zone) => {
          const zoneBuildings = BUILDINGS.filter((b) => b.zoneKey === zone.key);
          const builtCount = zoneBuildings.filter((b) =>
            buildings.some((ub) => ub.buildingKey === b.key)
          ).length;
          return (
            <IslandZoneCard
              key={zone.key}
              zone={zone}
              currentLevel={level}
              builtCount={builtCount}
              isActive={activeZoneKey === zone.key}
              onClick={() => {
                setActiveZoneKey(zone.key);
                setSelectedZoneKey(zone.key);
              }}
            />
          );
        })}
      </div>

      {/* Zone buildings sheet */}
      <AnimatePresence>
        {selectedZone && (
          <ZoneBuildingsSheet
            key="zone-sheet"
            zone={selectedZone}
            onClose={() => {
              setSelectedZoneKey(null);
              setActiveZoneKey(null);
            }}
            onSelectBuilding={(b) => {
              setSelectedZoneKey(null);
              setActiveZoneKey(null);
              setSelectedSlotId(b.slotId);
            }}
          />
        )}
      </AnimatePresence>

      {/* Building modal */}
      <AnimatePresence>
        {selectedSlotId && selectedBuildingDef && (
          <BuildingModal
            key="building-modal"
            building={selectedBuildingDef}
            userBuilding={selectedUserBuilding}
            onClose={() => setSelectedSlotId(null)}
            onBuild={handleBuild}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

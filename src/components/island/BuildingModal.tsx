"use client";

import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import type { Building, UserBuilding } from "@/types";
import { useWalletStore } from "@/stores/useWalletStore";

interface BuildingModalProps {
  building: Building;
  userBuilding: UserBuilding | null;
  onClose: () => void;
  onBuild: () => Promise<void>;
}

export default function BuildingModal({
  building,
  userBuilding,
  onClose,
  onBuild,
}: BuildingModalProps) {
  const tIsland = useTranslations("island");
  const tRes = useTranslations("resource");
  const tBld = useTranslations("building");
  const { wallet } = useWalletStore();

  const currentLevel = userBuilding?.level ?? 0;
  const nextLevel = currentLevel + 1;
  const isMaxLevel = currentLevel >= building.maxLevel;
  const costDef = !isMaxLevel
    ? building.levelCosts.find((c) => c.level === nextLevel)
    : null;

  // Strip "building." prefix to get the translation sub-key
  const nameSubKey = building.nameKey.replace("building.", "");
  const descSubKey = building.descriptionKey.replace("building.", "");

  const costs = costDef
    ? [
        { key: "coins" as const, icon: "💰", amount: costDef.coins, have: wallet.coins },
        { key: "wood" as const, icon: "🪵", amount: costDef.wood, have: wallet.wood },
        { key: "fabric" as const, icon: "🧵", amount: costDef.fabric, have: wallet.fabric },
        { key: "fish" as const, icon: "🐟", amount: costDef.fish, have: wallet.fish },
      ].filter((c) => c.amount > 0)
    : [];

  const canAfford = costs.every((c) => c.have >= c.amount);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-t-3xl px-6 pt-6 shadow-xl overflow-y-auto"
        style={{
          maxHeight: "85vh",
          paddingBottom: "max(6rem, calc(4rem + env(safe-area-inset-bottom)))",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{building.imageKey}</span>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {tBld(nameSubKey)}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">{tBld(descSubKey)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Level progress bar */}
        <div className="flex gap-1.5 mb-1">
          {Array.from({ length: building.maxLevel }, (_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-colors ${
                i < currentLevel ? "bg-amber-400" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-gray-400 mb-5">
          Lv.{currentLevel} / {building.maxLevel}
        </p>

        {isMaxLevel ? (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center mb-6">
            <span className="text-2xl block mb-1">🏆</span>
            <p className="text-amber-700 font-semibold text-sm">
              {tIsland("max_level")}
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              {currentLevel === 0 ? tIsland("build") : tIsland("upgrade")} → Lv.
              {nextLevel}
            </p>

            <div className="space-y-2.5 mb-5">
              {costs.map((c) => (
                <div key={c.key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {c.icon} {tRes(c.key)}
                  </span>
                  <span
                    className={`text-sm font-semibold tabular-nums ${
                      c.have < c.amount ? "text-red-500" : "text-gray-700"
                    }`}
                  >
                    {c.have} / {c.amount}
                  </span>
                </div>
              ))}
            </div>

            {!canAfford && (
              <p className="text-xs text-red-400 text-center mb-3">
                {tBld("not_enough")}
              </p>
            )}

            <button
              onClick={onBuild}
              disabled={!canAfford}
              className={`w-full py-3 rounded-2xl font-bold text-sm transition-colors ${
                canAfford
                  ? "bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {currentLevel === 0 ? tIsland("build") : tIsland("upgrade")} Lv.
              {nextLevel}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { Lock } from "lucide-react";
import { CAT_DEFINITIONS, ACHIEVEMENTS } from "@/lib/constants";
import { useProfileStore } from "@/stores/useProfileStore";

const ACHIEVEMENT_LABEL: Record<string, string> = Object.fromEntries(
  ACHIEVEMENTS.map((a) => [a.key, a.nameKey])
);

export default function CatsPage() {
  const t = useTranslations("cat");
  const tAch = useTranslations("achievement");
  const { profile } = useProfileStore();
  const level = profile?.level ?? 1;

  const getUnlockLabel = (cat: typeof CAT_DEFINITIONS[number]) => {
    if (cat.unlockType === "level") return `Lv.${cat.unlockValue}`;
    const nameKey = ACHIEVEMENT_LABEL[cat.unlockValue];
    if (nameKey) return tAch(nameKey.replace("achievement.", "") as Parameters<typeof tAch>[0]);
    return cat.unlockValue;
  };

  return (
    <div className="flex flex-col min-h-full px-4 pt-5 pb-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">貓貓收藏</h1>
      <div data-tutorial="cats-grid" className="grid grid-cols-2 gap-3">
        {CAT_DEFINITIONS.map((cat) => {
          const unlocked =
            cat.unlockType === "level" && level >= parseInt(cat.unlockValue);
          return (
            <div
              key={cat.key}
              className={`bg-white rounded-2xl p-4 shadow-sm flex flex-col items-center gap-2 ${!unlocked ? "opacity-50" : ""}`}
            >
              <div className={`w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center text-4xl ${unlocked ? "animate-cat-idle" : ""}`}>
                🐱
              </div>
              {unlocked ? (
                <>
                  <p className="font-semibold text-gray-800 text-center">{t(cat.key as Parameters<typeof t>[0])}</p>
                  <p className="text-xs text-gray-400 text-center">{t(`${cat.key}_desc` as Parameters<typeof t>[0])}</p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-gray-400 text-center">???</p>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Lock size={12} />
                    <span className="text-xs text-center">{getUnlockLabel(cat)}</span>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

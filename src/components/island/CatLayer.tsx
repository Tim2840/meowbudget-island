"use client";

import { useState, useEffect, useCallback } from "react";
import { CAT_DEFINITIONS } from "@/lib/constants";
import { useProfileStore } from "@/stores/useProfileStore";
import Cat from "@/components/cats/Cat";

interface CatState {
  x: number;   // % from left
  y: number;   // % from top
  moving: boolean;
  flipped: boolean;
}

// Usable walking area within the 288 px island scene
const AREA = { minX: 8, maxX: 80, minY: 44, maxY: 78 };

function rndPos() {
  return {
    x: AREA.minX + Math.random() * (AREA.maxX - AREA.minX),
    y: AREA.minY + Math.random() * (AREA.maxY - AREA.minY),
  };
}

export default function CatLayer() {
  const level = useProfileStore((s) => s.profile?.level ?? 1);

  const unlockedCats = CAT_DEFINITIONS.filter(
    (c) => c.unlockType === "level" && level >= parseInt(c.unlockValue)
  );

  const [states, setStates] = useState<Record<string, CatState>>(() => {
    const init: Record<string, CatState> = {};
    unlockedCats.forEach((c) => {
      const p = rndPos();
      init[c.key] = { ...p, moving: false, flipped: false };
    });
    return init;
  });

  const walk = useCallback(() => {
    setStates((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        const cur = next[key];
        const np = rndPos();
        next[key] = { x: np.x, y: np.y, moving: true, flipped: np.x < cur.x };
      });
      return next;
    });

    // After transition finishes, mark idle
    const tid = window.setTimeout(() => {
      setStates((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((k) => { next[k] = { ...next[k], moving: false }; });
        return next;
      });
    }, 2600);

    return tid;
  }, []);

  useEffect(() => {
    // Stagger each cat's walk interval slightly
    const intervals = unlockedCats.map((cat, i) => {
      const base = 5000 + i * 1200;
      const jitter = Math.random() * 3000;
      return window.setInterval(() => walk(), base + jitter);
    });
    return () => intervals.forEach(clearInterval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walk, unlockedCats.length]);

  if (unlockedCats.length === 0) return null;

  return (
    <>
      {unlockedCats.map((cat) => {
        const s = states[cat.key];
        if (!s) return null;
        return (
          <div
            key={cat.key}
            className="absolute"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              transform: "translate(-50%, -50%)",
              transition: "left 2.5s ease-in-out, top 2s ease-in-out",
              zIndex: 10,
            }}
          >
            <div style={{ transform: s.flipped ? "scaleX(-1)" : undefined }}>
              <Cat
                catId={cat.key}
                animationState={s.moving ? "walk" : "idle"}
                walkVariant="island"
                size={34}
              />
            </div>
          </div>
        );
      })}
    </>
  );
}

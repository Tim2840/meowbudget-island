import { cn } from "@/lib/utils";
import type { CatAnimationType } from "@/types";

interface CatStyle {
  body: string;
  ear: string;
  stripe?: boolean;
  star?: boolean;
  glasses?: boolean;
  spot?: boolean;
}

const CAT_STYLES: Record<string, CatStyle> = {
  captain:      { body: "#FB923C", ear: "#FDA4AF", stripe: true },
  merchant:     { body: "#FCD34D", ear: "#FEF08A" },
  scholar:      { body: "#9CA3AF", ear: "#E5E7EB", glasses: true },
  explorer:     { body: "#92400E", ear: "#B45309", spot: true },
  streak_master:{ body: "#A78BFA", ear: "#DDD6FE", star: true },
};

const DEFAULT_STYLE: CatStyle = { body: "#D4D4D4", ear: "#E5E7EB" };

interface CatProps {
  catId: string;
  animationState?: CatAnimationType;
  size?: number;
  className?: string;
  /** Flip horizontally (cat facing left) */
  flipped?: boolean;
  /** "island" = bob-only walk, no translateX that fights CSS position transition */
  walkVariant?: "catalog" | "island";
}

export default function Cat({
  catId,
  animationState = "idle",
  size = 48,
  className,
  flipped = false,
  walkVariant = "catalog",
}: CatProps) {
  const style = CAT_STYLES[catId] ?? DEFAULT_STYLE;

  const animClass =
    animationState === "walk"
      ? walkVariant === "island"
        ? "animate-cat-island-walk"
        : "animate-cat-walk"
      : animationState === "lick"
      ? "animate-cat-lick"
      : "animate-cat-idle";

  const isSleeping = animationState === "sleep";

  return (
    <div
      className={cn("inline-block", animClass, className)}
      style={{
        width: size,
        height: size,
        transform: flipped ? "scaleX(-1)" : undefined,
        flexShrink: 0,
      }}
    >
      <svg
        viewBox="0 0 48 48"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
      >
        {/* Tail */}
        <path
          d="M36,40 Q44,30 40,20"
          fill="none"
          stroke={style.body}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Body */}
        <ellipse cx="24" cy="34" rx="13" ry="10" fill={style.body} />
        {/* Head */}
        <circle cx="24" cy="19" r="12" fill={style.body} />
        {/* Ears */}
        <polygon points="14,11 11,2 20,10" fill={style.body} />
        <polygon points="34,11 37,2 28,10" fill={style.body} />
        {/* Ear inner */}
        <polygon points="14.5,10.5 13,4 19.5,10" fill={style.ear} />
        <polygon points="33.5,10.5 35,4 28.5,10" fill={style.ear} />

        {/* Eyes — closed when sleeping */}
        {isSleeping ? (
          <>
            <path d="M17,18 Q20,16 23,18" fill="none" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M25,18 Q28,16 31,18" fill="none" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" />
            {/* "zzz" */}
            <text x="33" y="11" fontSize="5" fill="#94A3B8" fontWeight="bold">z</text>
            <text x="36" y="8" fontSize="4" fill="#94A3B8" fontWeight="bold">z</text>
          </>
        ) : (
          <>
            <circle cx="20" cy="18" r="2.8" fill="#1a1a1a" />
            <circle cx="28" cy="18" r="2.8" fill="#1a1a1a" />
            <circle cx="21.2" cy="16.8" r="1" fill="white" />
            <circle cx="29.2" cy="16.8" r="1" fill="white" />
          </>
        )}

        {/* Nose */}
        <polygon points="23,22 25,22 24,23.5" fill="#F9A8D4" />
        {/* Mouth */}
        <path d="M21.5,23.5 Q24,25.5 26.5,23.5" fill="none" stroke="#1a1a1a" strokeWidth="0.8" />
        {/* Whiskers */}
        <line x1="12" y1="21" x2="20" y2="22" stroke="#1a1a1a" strokeWidth="0.6" opacity="0.4" />
        <line x1="12" y1="23.5" x2="20" y2="23" stroke="#1a1a1a" strokeWidth="0.6" opacity="0.4" />
        <line x1="36" y1="21" x2="28" y2="22" stroke="#1a1a1a" strokeWidth="0.6" opacity="0.4" />
        <line x1="36" y1="23.5" x2="28" y2="23" stroke="#1a1a1a" strokeWidth="0.6" opacity="0.4" />

        {/* Per-cat details */}
        {style.stripe && (
          /* Captain: tabby forehead stripe */
          <path d="M20,10 Q24,8 28,10" fill="none" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round" />
        )}
        {style.glasses && (
          /* Scholar: round spectacles */
          <>
            <circle cx="20" cy="18" r="4.2" fill="none" stroke="#6B7280" strokeWidth="0.9" />
            <circle cx="28" cy="18" r="4.2" fill="none" stroke="#6B7280" strokeWidth="0.9" />
            <line x1="24.2" y1="18" x2="23.8" y2="18" stroke="#6B7280" strokeWidth="0.9" />
          </>
        )}
        {style.star && (
          /* Streak master: star on forehead */
          <text x="24" y="13" textAnchor="middle" fontSize="6" fill="#F59E0B">★</text>
        )}
        {style.spot && (
          /* Explorer: forehead spot */
          <circle cx="24" cy="11" r="2" fill="#78350F" opacity="0.6" />
        )}
      </svg>
    </div>
  );
}

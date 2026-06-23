import { cn } from "@/lib/utils";
import type { CatAnimationType } from "@/types";

interface CatPalette {
  fur: string;
  furShade: string;
  ear: string;
  iris: string;
  badge?: "stripe" | "star" | "glasses" | "spot";
}

const PALETTES: Record<string, CatPalette> = {
  captain:       { fur: "#F97316", furShade: "#C2410C", ear: "#FCA5A5", iris: "#7C3AED", badge: "stripe" },
  merchant:      { fur: "#FBBF24", furShade: "#D97706", ear: "#FDE68A", iris: "#059669" },
  scholar:       { fur: "#A1A8B8", furShade: "#6B7280", ear: "#E5E7EB", iris: "#3B82F6", badge: "glasses" },
  explorer:      { fur: "#A16207", furShade: "#78350F", ear: "#D97706", iris: "#DC2626", badge: "spot" },
  streak_master: { fur: "#A78BFA", furShade: "#7C3AED", ear: "#EDE9FE", iris: "#F59E0B", badge: "star" },
};

const DEFAULT_PALETTE: CatPalette = { fur: "#D1D5DB", furShade: "#9CA3AF", ear: "#F3F4F6", iris: "#6B7280" };

const INK = "#3A1A0A"; // warm dark brown ink line, not pure black

function GhibliEye({ cx, cy, iris }: { cx: number; cy: number; iris: string }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx="5.5" ry="6" fill="#FDFCFB" />
      <ellipse cx={cx} cy={cy + 0.5} rx="4.2" ry="5" fill={iris} />
      <ellipse cx={cx} cy={cy + 1} rx="2.6" ry="3.5" fill="#140800" />
      {/* Primary highlight — large oval top-left */}
      <ellipse cx={cx - 1.5} cy={cy - 2} rx="1.8" ry="2.2" fill="white" />
      {/* Secondary highlight — small dot bottom-right */}
      <circle cx={cx + 2.2} cy={cy + 2} r="0.9" fill="white" opacity="0.75" />
      {/* Outer ring */}
      <ellipse cx={cx} cy={cy} rx="5.5" ry="6" fill="none" stroke={INK} strokeWidth="1.1" />
      {/* Upper lash thickening */}
      <path
        d={`M${cx - 5.3},${cy - 1.2} Q${cx},${cy - 6.8} ${cx + 5.3},${cy - 1.2}`}
        fill="none"
        stroke={INK}
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </g>
  );
}

interface CatProps {
  catId: string;
  animationState?: CatAnimationType;
  size?: number;
  className?: string;
  flipped?: boolean;
  walkVariant?: "catalog" | "island";
}

export default function Cat({
  catId,
  animationState = "idle",
  size = 56,
  className,
  flipped = false,
  walkVariant = "catalog",
}: CatProps) {
  const pal = PALETTES[catId] ?? DEFAULT_PALETTE;
  const isSleeping = animationState === "sleep";

  const animClass =
    animationState === "walk"
      ? walkVariant === "island"
        ? "animate-cat-island-walk"
        : "animate-cat-walk"
      : animationState === "lick"
      ? "animate-cat-lick"
      : "animate-cat-idle";

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
        viewBox="0 0 64 76"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
      >
        {/* ── TAIL ─────────────────────────── */}
        <path d="M43,66 Q60,54 58,40 Q56,26 63,17"
          fill="none" stroke={pal.fur} strokeWidth="5.5" strokeLinecap="round" />
        <path d="M43,66 Q60,54 58,40 Q56,26 63,17"
          fill="none" stroke={pal.furShade} strokeWidth="2" strokeLinecap="round" opacity="0.28" />

        {/* ── BODY ─────────────────────────── */}
        <ellipse cx="30" cy="58" rx="15" ry="12" fill={pal.fur} />
        <ellipse cx="30" cy="62" rx="10" ry="7" fill={pal.furShade} opacity="0.18" />
        <ellipse cx="30" cy="58" rx="15" ry="12" fill="none" stroke={INK} strokeWidth="1.2" />

        {/* ── PAWS ─────────────────────────── */}
        <ellipse cx="20" cy="68" rx="5.5" ry="3.5" fill={pal.fur} />
        <ellipse cx="20" cy="68" rx="5.5" ry="3.5" fill="none" stroke={INK} strokeWidth="1" />
        <ellipse cx="40" cy="68" rx="5.5" ry="3.5" fill={pal.fur} />
        <ellipse cx="40" cy="68" rx="5.5" ry="3.5" fill="none" stroke={INK} strokeWidth="1" />

        {/* ── EARS (before head so head overlaps base) ── */}
        <polygon points="13,19 9,4 24,18" fill={pal.fur} />
        <polygon points="15,18 12,6 22.5,17" fill={pal.ear} />
        <polygon points="13,19 9,4 24,18" fill="none" stroke={INK} strokeWidth="1.1" />
        <polygon points="51,19 55,4 40,18" fill={pal.fur} />
        <polygon points="49,18 52,6 41.5,17" fill={pal.ear} />
        <polygon points="51,19 55,4 40,18" fill="none" stroke={INK} strokeWidth="1.1" />

        {/* ── HEAD ─────────────────────────── */}
        <circle cx="32" cy="31" r="22" fill={pal.fur} />
        {/* Jaw shading */}
        <ellipse cx="32" cy="39" rx="16" ry="10" fill={pal.furShade} opacity="0.14" />
        <circle cx="32" cy="31" r="22" fill="none" stroke={INK} strokeWidth="1.2" />

        {/* ── BLUSH ────────────────────────── */}
        <ellipse cx="14" cy="37" rx="5.5" ry="3.5" fill="#FECDD3" opacity="0.55" />
        <ellipse cx="50" cy="37" rx="5.5" ry="3.5" fill="#FECDD3" opacity="0.55" />

        {/* ── EYES ─────────────────────────── */}
        {isSleeping ? (
          <>
            <path d="M20,30 Q23.5,25 27,30" fill="none" stroke={INK} strokeWidth="1.9" strokeLinecap="round" />
            <path d="M37,30 Q40.5,25 44,30" fill="none" stroke={INK} strokeWidth="1.9" strokeLinecap="round" />
            <text x="52" y="18" fontSize="7" fill="#94A3B8" fontWeight="bold" opacity="0.7">z</text>
            <text x="56" y="12" fontSize="5" fill="#94A3B8" fontWeight="bold" opacity="0.7">z</text>
          </>
        ) : (
          <>
            <GhibliEye cx={23} cy={29} iris={pal.iris} />
            <GhibliEye cx={41} cy={29} iris={pal.iris} />
          </>
        )}

        {/* ── NOSE ─────────────────────────── */}
        <path d="M30.5,38.5 L33.5,38.5 L32,40.5 Z" fill="#FDA4AF" />

        {/* ── MOUTH ────────────────────────── */}
        <path d="M29,41 Q32,44.5 35,41"
          fill="none" stroke={INK} strokeWidth="1" strokeLinecap="round" />

        {/* ── WHISKERS ─────────────────────── */}
        {[
          [[5, 36], [20, 37.5]], [[5, 39], [20, 39]], [[5, 42], [20, 40.5]],
          [[59, 36], [44, 37.5]], [[59, 39], [44, 39]], [[59, 42], [44, 40.5]],
        ].map(([[x1, y1], [x2, y2]], i) => (
          <line key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={INK} strokeWidth="0.75" opacity="0.32"
          />
        ))}

        {/* ── BADGE (per-cat unique detail) ── */}
        {pal.badge === "stripe" && (
          <>
            <path d="M26,14 Q32,12 38,14" fill="none" stroke="#C2410C" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M28,19 Q32,17 36,19" fill="none" stroke="#C2410C" strokeWidth="1.6" strokeLinecap="round" />
          </>
        )}
        {pal.badge === "glasses" && (
          <>
            <circle cx="23" cy="29" r="7" fill="none" stroke="#6B7280" strokeWidth="1.1" />
            <circle cx="41" cy="29" r="7" fill="none" stroke="#6B7280" strokeWidth="1.1" />
            <line x1="30" y1="29" x2="34" y2="29" stroke="#6B7280" strokeWidth="1.1" />
            <line x1="8"  y1="27" x2="16" y2="28" stroke="#6B7280" strokeWidth="1.1" />
            <line x1="56" y1="27" x2="48" y2="28" stroke="#6B7280" strokeWidth="1.1" />
          </>
        )}
        {pal.badge === "star" && (
          <text x="32" y="21" textAnchor="middle" fontSize="11" fill="#F59E0B">★</text>
        )}
        {pal.badge === "spot" && (
          <>
            <circle cx="32" cy="15" r="3.5" fill="#78350F" opacity="0.48" />
            <circle cx="25" cy="20" r="2" fill="#78350F" opacity="0.28" />
          </>
        )}
      </svg>
    </div>
  );
}

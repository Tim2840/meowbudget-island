interface Props {
  type: string;
  size?: number;
  grayscale?: boolean;
}

function Lighthouse({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 60 88" width={size} height={size} xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
      {/* Light beam */}
      <path d="M38,18 L58,6 L58,28 Z" fill="#FEF9C3" opacity="0.55" />

      {/* Stone base */}
      <rect x="16" y="64" width="28" height="22" rx="3" fill="#C5B99A" />
      <line x1="16" y1="72" x2="44" y2="72" stroke="#A89880" strokeWidth="0.8" />
      <line x1="16" y1="79" x2="44" y2="79" stroke="#A89880" strokeWidth="0.8" />
      {/* Door */}
      <path d="M24,86 L24,76 Q30,71 36,76 L36,86 Z" fill="#6B4F3A" />
      <circle cx="34" cy="81" r="1.2" fill="#9CA3AF" />

      {/* Tower body (tapering) */}
      <path d="M18,24 L42,24 L40,64 L20,64 Z" fill="white" />
      {/* Red stripe bands */}
      <path d="M18.3,34 L41.7,34 L41.2,41 L18.8,41 Z" fill="#EF4444" />
      <path d="M19.2,51 L40.8,51 L40.3,58 L19.7,58 Z" fill="#EF4444" />
      {/* Tower outline */}
      <path d="M18,24 L42,24 L40,64 L20,64 Z" fill="none" stroke="#94A3B8" strokeWidth="1" />
      {/* Window */}
      <ellipse cx="30" cy="46" rx="4.5" ry="4" fill="#BAE6FD" />
      <line x1="30" y1="42" x2="30" y2="50" stroke="#93C5FD" strokeWidth="0.8" />
      <line x1="25.5" y1="46" x2="34.5" y2="46" stroke="#93C5FD" strokeWidth="0.8" />
      <ellipse cx="30" cy="46" rx="4.5" ry="4" fill="none" stroke="#94A3B8" strokeWidth="0.8" />

      {/* Lantern gallery (walkway ring) */}
      <rect x="15" y="21" width="30" height="3.5" rx="1" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="0.7" />
      {/* Lantern room */}
      <rect x="20" y="10" width="20" height="12" rx="1.5" fill="#1E293B" />
      {/* Glass panes */}
      {[21.5, 26, 30.5, 35].map((x, i) => (
        <rect key={i} x={x} y="11" width="3.5" height="10" rx="0.6" fill="#FEF9C3" opacity="0.65" />
      ))}
      <rect x="20" y="10" width="20" height="12" rx="1.5" fill="none" stroke="#94A3B8" strokeWidth="0.8" />
      {/* Conical roof */}
      <path d="M19,10 Q30,2 41,10 Z" fill="#DC2626" />
      <path d="M19,10 Q30,2 41,10 Z" fill="none" stroke="#B91C1C" strokeWidth="0.8" />
      {/* Top light glow */}
      <circle cx="30" cy="8" r="4" fill="#FEF08A" opacity="0.9" />
      <circle cx="30" cy="8" r="7" fill="#FEF08A" opacity="0.3" />
    </svg>
  );
}

function MarketStall({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 72 68" width={size} height={size} xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
      {/* Counter/table top */}
      <rect x="4" y="44" width="64" height="6" rx="2" fill="#B45309" />
      <rect x="6" y="50" width="60" height="16" rx="2" fill="#92400E" />
      {/* Table legs */}
      <rect x="10" y="60" width="4" height="7" fill="#78350F" />
      <rect x="58" y="60" width="4" height="7" fill="#78350F" />

      {/* Goods on counter */}
      <circle cx="18" cy="41" r="5" fill="#F97316" />
      <circle cx="22" cy="42" r="4" fill="#FB923C" opacity="0.8" />
      <rect x="30" y="36" width="9" height="8" rx="1" fill="#3B82F6" />
      <rect x="31" y="37" width="7" height="2" rx="0.5" fill="#60A5FA" opacity="0.6" />
      <circle cx="48" cy="41" r="4.5" fill="#22C55E" />
      <circle cx="55" cy="42" r="3.5" fill="#F59E0B" />

      {/* Awning shape */}
      <path d="M2,16 Q36,7 70,16 L70,38 Q36,29 2,38 Z" fill="#EF4444" />
      {/* White stripes on awning */}
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d={`M${4 + i * 4},${17 + i * 5.5} Q36,${10 + i * 5} ${68 - i * 4},${17 + i * 5.5} L${68 - i * 4},${20 + i * 5} Q36,${13 + i * 5} ${4 + i * 4},${20 + i * 5} Z`}
          fill="white"
          opacity="0.35"
        />
      ))}
      {/* Awning fringe/scallops at bottom */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <ellipse key={i} cx={8 + i * 8} cy="38" rx="4" ry="3" fill="#DC2626" />
      ))}
      <path d="M2,16 Q36,7 70,16 L70,38 Q36,29 2,38 Z" fill="none" stroke="#B91C1C" strokeWidth="1" />

      {/* Hanging bunting rope */}
      <path d="M5,16 Q36,12 67,16" fill="none" stroke="#6B7280" strokeWidth="0.9" />
      {/* Bunting flags */}
      {[["#FCD34D", 10], ["#34D399", 24], ["#F87171", 38], ["#818CF8", 52]].map(([color, x], i) => (
        <polygon key={i} points={`${x},16 ${Number(x) + 5},24 ${Number(x) + 10},16`} fill={color as string} />
      ))}

      {/* Sign above stall */}
      <rect x="22" y="2" width="28" height="13" rx="3" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.2" />
      <text x="36" y="11" textAnchor="middle" fontSize="6" fill="#92400E" fontWeight="bold">SHOP</text>
    </svg>
  );
}

function Windmill({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 60 96" width={size} height={size} xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
      {/* Base */}
      <rect x="15" y="72" width="30" height="22" rx="2" fill="#C5B99A" />
      {/* Stone lines */}
      {[78, 84, 90].map((y, i) => (
        <line key={i} x1="15" y1={y} x2="45" y2={y} stroke="#A89880" strokeWidth="0.8" />
      ))}
      {/* Door */}
      <path d="M23,94 L23,82 Q30,77 37,82 L37,94 Z" fill="#6B4F3A" />

      {/* Tower body (tapering trapezoid) */}
      <path d="M17,34 L43,34 L41,72 L19,72 Z" fill="#DED8D0" />
      {/* Stone texture lines */}
      {[44, 54, 64].map((y, i) => (
        <line key={i} x1={18 + i * 0.3} y1={y} x2={42 - i * 0.3} y2={y} stroke="#C5BDB5" strokeWidth="0.8" />
      ))}
      {/* Window */}
      <rect x="24" y="54" width="12" height="10" rx="2" fill="#BAE6FD" />
      <line x1="30" y1="54" x2="30" y2="64" stroke="#93C5FD" strokeWidth="0.9" />
      <line x1="24" y1="59" x2="36" y2="59" stroke="#93C5FD" strokeWidth="0.9" />
      <rect x="24" y="54" width="12" height="10" rx="2" fill="none" stroke="#94A3B8" strokeWidth="0.8" />
      {/* Tower outline */}
      <path d="M17,34 L43,34 L41,72 L19,72 Z" fill="none" stroke="#94A3B8" strokeWidth="1" />

      {/* Cap roof */}
      <path d="M14,34 Q30,24 46,34 L43,36 L30,28 L17,36 Z" fill="#C2410C" />
      <path d="M14,34 Q30,24 46,34" fill="none" stroke="#9CA3AF" strokeWidth="0.8" />

      {/* Hub */}
      <circle cx="30" cy="34" r="5" fill="#64748B" stroke="#475569" strokeWidth="0.9" />
      <circle cx="30" cy="34" r="2" fill="#94A3B8" />

      {/* Blades (4, X pattern) */}
      {/* Top blade */}
      <path d="M30,34 L26,8 Q30,5 34,8 Z" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="0.8" />
      {/* Right blade */}
      <path d="M30,34 L56,28 Q58,32 56,38 Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.8" />
      {/* Bottom blade */}
      <path d="M30,34 L26,60 Q30,63 34,60 Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.8" />
      {/* Left blade */}
      <path d="M30,34 L4,28 Q2,32 4,38 Z" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="0.8" />
    </svg>
  );
}

export default function BuildingIcon({ type, size = 72, grayscale = false }: Props) {
  const content = type.includes("lighthouse") ? (
    <Lighthouse size={size} />
  ) : type.includes("stall") ? (
    <MarketStall size={size} />
  ) : type.includes("windmill") ? (
    <Windmill size={size} />
  ) : (
    <svg viewBox="0 0 60 60" width={size} height={size}>
      <rect x="10" y="10" width="40" height="40" rx="4" fill="#E5E7EB" stroke="#9CA3AF" />
    </svg>
  );

  return (
    <div style={{ filter: grayscale ? "grayscale(100%) opacity(0.6)" : undefined, display: "inline-block" }}>
      {content}
    </div>
  );
}

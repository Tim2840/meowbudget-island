// Pure CSS-driven particles: falling leaves + periodic flying birds.
// No state or effects — all animation is declarative via keyframes.

const LEAVES: {
  left: string;
  delay: number;
  duration: number;
  size: number;
  color: string;
}[] = [
  { left: "7%",  delay: 0,   duration: 7,   size: 10, color: "#86EFAC" },
  { left: "19%", delay: 2.5, duration: 8.5, size: 8,  color: "#4ADE80" },
  { left: "33%", delay: 1.2, duration: 6.5, size: 12, color: "#FCD34D" },
  { left: "52%", delay: 4,   duration: 7.2, size: 9,  color: "#86EFAC" },
  { left: "68%", delay: 1.8, duration: 9,   size: 11, color: "#FCA5A5" },
  { left: "80%", delay: 3.2, duration: 6.2, size: 8,  color: "#4ADE80" },
  { left: "91%", delay: 5.5, duration: 8.2, size: 10, color: "#FCD34D" },
];

// Two bird groups staggered by half the duration so there's always a flyby every ~9 s
const BIRD_GROUPS = [
  { top: "13%", delay: 0 },
  { top: "19%", delay: 9 },
];

function BirdGroup({ top, delay }: { top: string; delay: number }) {
  return (
    <div
      className="absolute"
      style={{
        top,
        left: 0,
        animation: `bird-fly 18s ease-in-out ${delay}s infinite both`,
      }}
    >
      <svg width="60" height="22" viewBox="0 0 60 22" fill="none">
        {/* 3 birds at different sizes and slight offsets */}
        <path d="M0,12 Q8,6 16,12 Q24,6 32,12"   stroke="#374151" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        <path d="M22,7 Q29,2 36,7 Q43,2 50,7"    stroke="#374151" strokeWidth="1.3" strokeLinecap="round" opacity="0.4" />
        <path d="M-6,16 Q1,11 8,16 Q15,11 22,16" stroke="#374151" strokeWidth="1.2" strokeLinecap="round" opacity="0.35" />
      </svg>
    </div>
  );
}

export default function ParticleLayer() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 4 }}>
      {/* Falling leaves */}
      {LEAVES.map((leaf, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: leaf.left,
            top: 0,
            width: leaf.size,
            height: leaf.size * 1.4,
            borderRadius: "0 60% 60% 60%",
            background: leaf.color,
            animation: `leaf-fall ${leaf.duration}s ease-in ${leaf.delay}s infinite both`,
          }}
        />
      ))}

      {/* Flying birds */}
      {BIRD_GROUPS.map((g, i) => (
        <BirdGroup key={i} top={g.top} delay={g.delay} />
      ))}
    </div>
  );
}

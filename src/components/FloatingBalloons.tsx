"use client";

const COLORS = [
  { from: "#ff9a9e", to: "#a768d5" },
  { from: "#c9a2e6", to: "#7b4fc4" },
  { from: "#ffd3a5", to: "#ff9a9e" },
  { from: "#a1c4fd", to: "#c9a2e6" },
  { from: "#fff0c4", to: "#ffb77c" },
  { from: "#e0c3fc", to: "#8ec5fc" },
];

interface Balloon {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  color: { from: string; to: string };
  sway: number;
}

function balloons(count: number): Balloon[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    left: 3 + ((i * 97) % 94),
    delay: (i % 10) * 1.2,
    duration: 7 + (i % 6) * 1.6,
    size: 42 + (i % 5) * 14,
    color: COLORS[i % COLORS.length],
    sway: (i % 2 === 0 ? 1 : -1) * (2 + (i % 4) * 1.5),
  }));
}

export default function FloatingBalloons({ count = 8 }: { count?: number }) {
  const items = balloons(count);
  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
      {items.map((b) => (
        <div
          key={b.id}
          className="absolute bottom-[-8rem]"
          style={{
            left: `${b.left}%`,
            ["--sway" as string]: `${b.sway}rem`,
            animation: `floatBalloon ${b.duration}s ${b.delay}s ease-in-out infinite`,
          }}
        >
          <div
            className="relative"
            style={{ width: b.size, height: b.size * 1.18 }}
          >
            {/* Balloon body */}
            <div
              className="absolute inset-0 rounded-[50%]"
              style={{
                background: `radial-gradient(circle at 32% 28%, #ffffff 0%, ${b.color.from} 38%, ${b.color.to} 100%)`,
                boxShadow: "inset -6px -10px 14px rgba(0,0,0,0.18)",
                animation: `swayBalloon ${b.duration / 2}s ${b.delay}s ease-in-out infinite`,
              }}
            />
            {/* Highlight */}
            <div
              className="absolute rounded-[50%] bg-white/70"
              style={{
                left: "18%",
                top: "13%",
                width: "22%",
                height: "26%",
                filter: "blur(1px)",
                transform: "rotate(-18deg)",
              }}
            />
            {/* Knot */}
            <div
              className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1"
              style={{
                width: 0,
                height: 0,
                borderLeft: `${b.size * 0.07}px solid transparent`,
                borderRight: `${b.size * 0.07}px solid transparent`,
                borderTop: `${b.size * 0.09}px solid ${b.color.to}`,
              }}
            />
            {/* String */}
            <div
              className="absolute left-1/2 top-full h-24 w-px -translate-x-1/2 bg-white/40"
              style={{
                transformOrigin: "top",
                animation: `swayString ${b.duration / 2}s ${b.delay}s ease-in-out infinite`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

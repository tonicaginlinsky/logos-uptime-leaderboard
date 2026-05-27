"use client";

import { useEffect, useRef } from "react";
import type { CountryPath } from "@/lib/worldmap";

interface WorldMapBackgroundProps {
  paths: CountryPath[];
  uptimeByCode: Record<string, number>;
  hoursByCode: Record<string, number>;
  opacity?: number;
}

function uptimeFill(pct: number, hoursRatio: number): string {
  const a = 0.2 + hoursRatio * 0.45;
  if (pct >= 85) return `rgba(16,185,129,${a.toFixed(2)})`;
  if (pct >= 50) return `rgba(245,158,11,${(a * 0.85).toFixed(2)})`;
  return `rgba(239,68,68,${(a * 0.7).toFixed(2)})`;
}

function uptimeStroke(pct: number): string {
  if (pct >= 85) return "rgba(16,185,129,0.5)";
  if (pct >= 50) return "rgba(245,158,11,0.35)";
  return "rgba(239,68,68,0.3)";
}

export default function WorldMapBackground({
  paths,
  uptimeByCode,
  hoursByCode,
  opacity = 1,
}: WorldMapBackgroundProps) {
  const maxHours = Math.max(...Object.values(hoursByCode), 1);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.setAttribute("inert", "");
  }, []);

  return (
    <div
      ref={ref}
      className="fixed inset-0 pointer-events-none flex items-center justify-center"
      style={{ opacity, transition: "opacity 80ms linear", pointerEvents: "none" }}
      aria-hidden="true"
    >
      <svg
        viewBox="120 25 790 330"
        preserveAspectRatio="xMidYMid meet"
        className="opacity-90"
        style={{ width: "100vw", height: "auto", pointerEvents: "none" }}
      >
        {paths.map((p, i) => {
          const uptime = p.alpha2 ? uptimeByCode[p.alpha2] : undefined;
          const hours = p.alpha2 ? hoursByCode[p.alpha2] : undefined;
          const hasData = uptime !== undefined && hours !== undefined;
          const hoursRatio = hasData ? hours! / maxHours : 0;
          return (
            <path
              key={`${p.id}-${i}`}
              d={p.d}
              fill={hasData ? uptimeFill(uptime!, hoursRatio) : "rgba(255,255,255,0.06)"}
              stroke={hasData ? uptimeStroke(uptime!) : "rgba(255,255,255,0.1)"}
              strokeWidth={0.4}
            />
          );
        })}
      </svg>
    </div>
  );
}

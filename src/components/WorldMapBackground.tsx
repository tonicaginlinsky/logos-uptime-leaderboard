"use client";

import { useState, useEffect } from "react";
import type { CountryPath } from "@/lib/worldmap";

interface WorldMapBackgroundProps {
  paths: CountryPath[];
  uptimeByCode: Record<string, number>;
  hoursByCode: Record<string, number>;
  hidden?: boolean;
}

function uptimeFill(pct: number, hoursRatio: number): string {
  const a = 0.08 + hoursRatio * 0.35;
  if (pct >= 85) return `rgba(0,103,71,${a.toFixed(2)})`;
  if (pct >= 50) return `rgba(255,120,0,${(a * 0.7).toFixed(2)})`;
  return `rgba(255,80,0,${(a * 0.4).toFixed(2)})`;
}

function uptimeStroke(pct: number): string {
  if (pct >= 85) return "rgba(0,103,71,0.35)";
  if (pct >= 50) return "rgba(255,120,0,0.2)";
  return "rgba(255,255,255,0.1)";
}

export default function WorldMapBackground({
  paths,
  uptimeByCode,
  hoursByCode,
  hidden = false,
}: WorldMapBackgroundProps) {
  const maxHours = Math.max(...Object.values(hoursByCode), 1);
  const [brightness, setBrightness] = useState(1);

  useEffect(() => {
    const onScroll = () => {
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const ratio = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;
      setBrightness(1 + ratio * 3);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`fixed inset-0 pointer-events-none flex items-center justify-center transition-opacity duration-500 ${hidden ? "opacity-0" : "opacity-100"}`} aria-hidden="true">
      <svg
        viewBox="120 25 790 330"
        preserveAspectRatio="xMidYMid meet"
        className="opacity-90 transition-[filter] duration-100"
        style={{ width: "100vw", height: "auto", filter: `brightness(${brightness})` }}
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
              fill={hasData ? uptimeFill(uptime!, hoursRatio) : "rgba(255,255,255,0.03)"}
              stroke={hasData ? uptimeStroke(uptime!) : "rgba(255,255,255,0.07)"}
              strokeWidth={0.4}
            />
          );
        })}
      </svg>
    </div>
  );
}

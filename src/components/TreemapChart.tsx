"use client";

import { useState } from "react";
import type { CountryRow } from "@/lib/leaderboard";
import { formatHours } from "@/lib/format";

interface Rect { x: number; y: number; w: number; h: number }
interface Tile { country: CountryRow; rect: Rect }

function buildTreemap(items: CountryRow[], rect: Rect): Tile[] {
  if (items.length === 0) return [];
  if (items.length === 1) return [{ country: items[0], rect }];

  const total = items.reduce((s, c) => s + c.totalHours, 0);
  let cumulative = 0;
  let splitIdx = 0;
  for (let i = 0; i < items.length - 1; i++) {
    cumulative += items[i].totalHours;
    splitIdx = i + 1;
    if (cumulative >= total / 2) break;
  }

  const leftRatio = cumulative / total;
  const left = items.slice(0, splitIdx);
  const right = items.slice(splitIdx);

  let leftRect: Rect, rightRect: Rect;
  if (rect.w >= rect.h) {
    leftRect  = { x: rect.x,                    y: rect.y, w: rect.w * leftRatio,        h: rect.h };
    rightRect = { x: rect.x + rect.w * leftRatio, y: rect.y, w: rect.w * (1 - leftRatio), h: rect.h };
  } else {
    leftRect  = { x: rect.x, y: rect.y,                     w: rect.w, h: rect.h * leftRatio };
    rightRect = { x: rect.x, y: rect.y + rect.h * leftRatio, w: rect.w, h: rect.h * (1 - leftRatio) };
  }

  return [...buildTreemap(left, leftRect), ...buildTreemap(right, rightRect)];
}

function tileColor(country: CountryRow, rank: number, total: number): string {
  const t = rank / Math.max(total - 1, 1);
  const brightness = 0.55 + (1 - t) * 0.45;
  if (country.averageUptimePct >= 85) {
    const r = Math.round(16 * brightness);
    const g = Math.round(185 * brightness);
    const b = Math.round(129 * brightness);
    return `rgb(${r},${g},${b})`;
  }
  if (country.averageUptimePct >= 60) {
    const r = Math.round(245 * brightness);
    const g = Math.round(158 * brightness);
    const b = Math.round(11 * brightness);
    return `rgb(${r},${g},${b})`;
  }
  const r = Math.round(239 * brightness);
  const g = Math.round(68 * brightness);
  const b = Math.round(68 * brightness);
  return `rgb(${r},${g},${b})`;
}

interface TreemapChartProps {
  countries: CountryRow[];
}

const W = 1000;
const H = 480;
const GAP = 2;

interface Tooltip { country: CountryRow; x: number; y: number }

export default function TreemapChart({ countries }: TreemapChartProps) {
  const items = countries.filter((c) => c.countryCode !== null && c.totalHours > 0);
  const tiles = buildTreemap(items, { x: 0, y: 0, w: W, h: H });
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);

  return (
    <>
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      className="rounded-lg overflow-hidden"
      style={{ width: "100%", height: "100%", display: "block" }}
      onMouseLeave={() => setTooltip(null)}
    >
      {tiles.map(({ country, rect }, i) => {
        const x = rect.x + GAP / 2;
        const y = rect.y + GAP / 2;
        const w = Math.max(rect.w - GAP, 0);
        const h = Math.max(rect.h - GAP, 0);
        const color = tileColor(country, i, tiles.length);

        const pad = 6;
        const availW = w - pad * 2;
        const nameParts = (country.countryName ?? "").split(" ");
        const twoLine = nameParts.length >= 2;
        // flag emoji ≈ 2.2 char widths; account for it on the first line
        const firstLineChars = (twoLine ? nameParts[0].length : (country.countryName ?? "").length) + 2.8;
        const secondLineChars = twoLine ? nameParts.slice(1).join(" ").length : 0;
        const longestLineChars = Math.max(firstLineChars, secondLineChars);
        const maxFontByWidth = availW / (longestLineChars * 0.58);
        const fs = Math.min(14, Math.min(w / 8, maxFontByWidth));
        const showLabel = fs >= 9 && h > (twoLine ? 48 : 28);
        const showHours = fs >= 9 && w > 70 && h > (twoLine ? 68 : 52);
        const labelY = y + fs + 4;

        return (
          <g
            key={country.countryCode}
            style={{ cursor: "default" }}
            onMouseEnter={(e) => setTooltip({ country, x: e.clientX, y: e.clientY })}
            onMouseMove={(e) => setTooltip((t) => t ? { ...t, x: e.clientX, y: e.clientY } : null)}
          >
            <rect x={x} y={y} width={w} height={h} fill={color} rx={2} />
            {showLabel && (
              <>
                <text
                  x={x + pad}
                  y={labelY}
                  fontSize={fs}
                  fill="rgba(255,255,255,0.9)"
                  fontFamily="sans-serif"
                  fontWeight="600"
                >
                  {twoLine ? (
                    <>
                      <tspan x={x + pad} dy="0">{country.flag} {nameParts[0]}</tspan>
                      <tspan x={x + pad} dy={fs * 1.25}>{nameParts.slice(1).join(" ")}</tspan>
                    </>
                  ) : (
                    `${country.flag} ${country.countryName}`
                  )}
                </text>
                {showHours && (
                  <text
                    x={x + pad}
                    y={labelY + (twoLine ? fs * 1.25 : 0) + fs + 4}
                    fontSize={fs * 0.85}
                    fill="rgba(255,255,255,0.6)"
                    fontFamily="monospace"
                  >
                    {formatHours(country.totalHours)}h
                  </text>
                )}
              </>
            )}
          </g>
        );
      })}
    </svg>
    {tooltip && (
      <div
        className="fixed pointer-events-none bg-bg-elevated/95 backdrop-blur-sm border border-white/10 rounded px-3 py-2 text-xs text-cream whitespace-nowrap"
        style={{ left: tooltip.x + 14, top: tooltip.y - 36, zIndex: 50 }}
      >
        <span className="font-semibold">{tooltip.country.flag} {tooltip.country.countryName}</span>
        <span className="text-muted ml-2">{tooltip.country.averageUptimePct.toFixed(1)}% uptime</span>
        <span className="text-muted ml-2">{formatHours(tooltip.country.totalHours)}h</span>
      </div>
    )}
    </>
  );
}

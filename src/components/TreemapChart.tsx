"use client";

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
  if (country.averageUptimePct >= 85) {
    const g = Math.round(80 + (1 - t) * 100);
    return `rgb(0,${g},${Math.round(g * 0.6)})`;
  }
  if (country.averageUptimePct >= 60) {
    const r = Math.round(180 + (1 - t) * 75);
    return `rgb(${r},${Math.round(r * 0.4)},0)`;
  }
  return `rgb(${Math.round(120 + (1 - t) * 60)},50,0)`;
}

interface TreemapChartProps {
  countries: CountryRow[];
}

const W = 1000;
const H = 480;
const GAP = 2;

export default function TreemapChart({ countries }: TreemapChartProps) {
  const items = countries.filter((c) => c.countryCode !== null && c.totalHours > 0);
  const tiles = buildTreemap(items, { x: 0, y: 0, w: W, h: H });

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      className="rounded-lg overflow-hidden"
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      {tiles.map(({ country, rect }, i) => {
        const x = rect.x + GAP / 2;
        const y = rect.y + GAP / 2;
        const w = Math.max(rect.w - GAP, 0);
        const h = Math.max(rect.h - GAP, 0);
        const color = tileColor(country, i, tiles.length);
        const showLabel = w > 60 && h > 30;
        const showHours = w > 80 && h > 50;
        const fontSize = Math.min(14, Math.max(9, w / 8));

        return (
          <g key={country.countryCode}>
            <rect x={x} y={y} width={w} height={h} fill={color} rx={2} />
            {showLabel && (
              <>
                <text
                  x={x + 6}
                  y={y + fontSize + 4}
                  fontSize={fontSize}
                  fill="rgba(255,255,255,0.9)"
                  fontFamily="sans-serif"
                  fontWeight="600"
                >
                  {country.flag} {country.countryName}
                </text>
                {showHours && (
                  <text
                    x={x + 6}
                    y={y + fontSize * 2 + 8}
                    fontSize={fontSize * 0.85}
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
  );
}

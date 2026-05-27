"use client";

import { useState, useCallback, useEffect } from "react";
import DataSourceModal from "./DataSourceModal";
import type { WindowKey, Leaderboard } from "@/lib/leaderboard";
import type { CountryPath } from "@/lib/worldmap";
import { formatHours } from "@/lib/format";
import Wordmark from "./Wordmark";
import Rule from "./Rule";
import WindowToggle from "./WindowToggle";
import CountryRowComponent from "./CountryRow";
import DisclaimerBlock from "./DisclaimerBlock";
import WorldMapBackground from "./WorldMapBackground";
import TreemapChart from "./TreemapChart";

interface LeaderboardClientProps {
  data7d: Leaderboard;
  data30d: Leaderboard;
  countryPaths: CountryPath[];
}

export default function LeaderboardClient({
  data7d,
  data30d,
  countryPaths,
}: LeaderboardClientProps) {
  const [period, setPeriod] = useState<WindowKey>("7d");
  const [bottomView, setBottomView] = useState<"map" | "chart">("map");
  const [showDataSource, setShowDataSource] = useState(false);
  const [scrollRatio, setScrollRatio] = useState(0);
  const scrolledToBottom = scrollRatio > 0.5;

  useEffect(() => {
    const onScroll = () => {
      const maxScroll = document.body.scrollHeight - globalThis.innerHeight;
      setScrollRatio(maxScroll > 0 ? Math.min(globalThis.scrollY / maxScroll, 1) : 0);
    };
    globalThis.addEventListener("scroll", onScroll, { passive: true });
    return () => globalThis.removeEventListener("scroll", onScroll);
  }, []);

  // Crossfade range: scroll 45% → 65%
  const blendT = Math.min(1, Math.max(0, (scrollRatio - 0.45) / 0.2));
  const mapOpacity = bottomView === "chart" ? 1 - blendT : 1;
  const chartOpacity = bottomView === "chart" ? blendT * 0.85 : 0;
  const [expandedCountries, setExpandedCountries] = useState<Set<string>>(
    new Set()
  );

  const active = period === "7d" ? data7d : data30d;

  const uptimeByCode: Record<string, number> = {};
  const hoursByCode: Record<string, number> = {};
  for (const c of active.countries) {
    if (c.countryCode) {
      uptimeByCode[c.countryCode] = c.averageUptimePct;
      hoursByCode[c.countryCode] = c.totalHours;
    }
  }

  const toggleCountry = useCallback((countryKey: string) => {
    setExpandedCountries((prev) => {
      const next = new Set(prev);
      if (next.has(countryKey)) {
        next.delete(countryKey);
      } else {
        next.add(countryKey);
      }
      return next;
    });
  }, []);

  const isExpanded = (countryKey: string) => expandedCountries.has(countryKey);

  return (
    <div className="relative min-h-screen bg-bg-deep text-cream">
      <WorldMapBackground
        paths={countryPaths}
        uptimeByCode={uptimeByCode}
        hoursByCode={hoursByCode}
        opacity={mapOpacity}
      />
      {bottomView === "chart" && (
        <div
          className="hidden sm:block fixed inset-x-0"
          style={{ top: 16, bottom: 112, zIndex: 15, opacity: chartOpacity, transition: "opacity 80ms linear" }}
        >
          <TreemapChart countries={active.countries} />
        </div>
      )}
      <div className="relative z-10 mx-auto max-w-[1100px] px-4 sm:px-8 py-10 sm:py-16" style={{ paddingBottom: "calc(100vh + 80px)" }}>
        {/* Header */}
        <header className="mb-10 sm:mb-16 text-center">
          <Wordmark />
          <p className="text-muted text-xs tracking-[0.2em] uppercase font-medium mt-2">
            UNOFFICIAL FAN PROJECT
          </p>
        </header>

        {/* Window Toggle & Meta */}
        <section className="mb-8 sm:mb-12 flex flex-col items-center sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <WindowToggle
            value={period}
            onChange={setPeriod}
            options={[
              { value: "7d", label: "7 DAYS" },
              { value: "30d", label: "30 DAYS" },
            ]}
          />
          <div className="text-center sm:text-right text-xs text-muted tabular-nums leading-tight">
            <p>{active.meta.windowRangeUtc}</p>
            <p>
              {formatHours(active.meta.totalPeers)} peers seen
              <button
                onClick={() => setShowDataSource(true)}
                className="ml-2 text-muted/50 hover:text-muted underline underline-offset-2 transition-colors non-tabular-nums"
              >
                data source
              </button>
            </p>
          </div>
        </section>

        {/* Desktop Table */}
        <section className="hidden lg:block mb-8">
          <div className="backdrop-blur-md bg-black/30 rounded-lg border border-white/5">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-rule text-muted text-xs uppercase tracking-wider">
                <th className="py-3 pl-4 pr-6 text-left font-medium w-16">Rank</th>
                <th className="py-3 text-left font-medium w-[38%]">Country</th>
                <th className="py-3 px-4 text-left font-medium tabular-nums w-[14%]">
                  Nodes
                </th>
                <th className="py-3 px-4 text-left font-medium tabular-nums w-[18%]">
                  Total Hours
                </th>
                <th className="py-3 pr-4 text-right font-medium tabular-nums w-[22%]">
                  Avg Uptime
                </th>
              </tr>
            </thead>
            <tbody>
              {active.countries.map((country) => (
                <CountryRowComponent
                  key={country.countryCode ?? "Unknown"}
                  row={country}
                  expanded={isExpanded(country.countryCode ?? "Unknown")}
                  onToggle={() =>
                    toggleCountry(country.countryCode ?? "Unknown")
                  }
                  layout="table"
                />
              ))}
            </tbody>
          </table>
          </div>
        </section>

        {/* Tablet View (768-1023px) */}
        <section className="hidden md:block lg:hidden mb-8">
          <div className="backdrop-blur-md bg-black/30 rounded-lg border border-white/5">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-rule text-muted text-xs uppercase tracking-wider">
                <th className="py-3 pl-4 pr-6 text-left font-medium w-16">Rank</th>
                <th className="py-3 text-left font-medium w-[38%]">Country</th>
                <th className="py-3 px-4 text-left font-medium tabular-nums w-[14%]">
                  Nodes
                </th>
                <th className="py-3 px-4 text-left font-medium tabular-nums w-[18%]">
                  Total Hours
                </th>
                <th className="py-3 pr-4 text-right font-medium tabular-nums w-[22%]">
                  Avg Uptime
                </th>
              </tr>
            </thead>
            <tbody>
              {active.countries.map((country) => (
                <CountryRowComponent
                  key={country.countryCode ?? "Unknown"}
                  row={country}
                  expanded={isExpanded(country.countryCode ?? "Unknown")}
                  onToggle={() =>
                    toggleCountry(country.countryCode ?? "Unknown")
                  }
                  layout="table"
                />
              ))}
            </tbody>
          </table>
          </div>
        </section>

        {/* Mobile Cards (< 768px) */}
        <section className="md:hidden mb-8">
          <div className="backdrop-blur-md bg-black/30 rounded-lg border border-white/5">
            {active.countries.map((country) => (
              <CountryRowComponent
                key={country.countryCode ?? "Unknown"}
                row={country}
                expanded={isExpanded(country.countryCode ?? "Unknown")}
                onToggle={() =>
                  toggleCountry(country.countryCode ?? "Unknown")
                }
                layout="card"
              />
            ))}
          </div>
        </section>


        {/* Bottom sticky tabs — desktop only, visible only when scrolled down */}
        <div
          className={`hidden sm:flex fixed bottom-[56px] left-0 right-0 z-20 justify-center py-3 transition-all duration-300 ${
            scrolledToBottom ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <div className="inline-flex rounded-full border border-white/10 p-0.5 bg-black/80">
            {(["map", "chart"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setBottomView(v)}
                className={`px-5 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase transition-colors duration-150 ${
                  bottomView === v ? "bg-yellow/90 text-bg-deep" : "text-muted hover:text-cream"
                }`}
              >
                {v === "map" ? "MAP" : "CHART"}
              </button>
            ))}
          </div>
        </div>

        {/* About & Footer — fixed to viewport bottom */}
        <footer className="fixed bottom-0 left-0 right-0 z-20 px-4 sm:px-8 py-4 bg-black/90 border-t border-white/5">
          <div className="mx-auto max-w-[1100px]">
            <DisclaimerBlock />
          </div>
        </footer>
      </div>
      {showDataSource && (
        <DataSourceModal onClose={() => setShowDataSource(false)} />
      )}
    </div>
  );
}
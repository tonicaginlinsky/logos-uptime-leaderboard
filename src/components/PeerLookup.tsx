"use client";

import { useState, useEffect } from "react";
import type { CountryRow, PeerRow } from "@/lib/leaderboard";
import { formatHours, formatUptime, truncatePeerId } from "@/lib/format";

interface PeerLookupProps {
  countries: CountryRow[];
  totalPeers: number;
  onFound: (countryKey: string, peerId: string) => void;
  onClear: () => void;
}

interface FoundResult {
  peer: PeerRow;
  countryKey: string;
  countryName: string;
  flag: string | null;
}

export default function PeerLookup({ countries, totalPeers, onFound, onClear }: PeerLookupProps) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<FoundResult | "not-found" | null>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResult(null);
      onClear();
      return;
    }
    for (const country of countries) {
      for (const peer of country.peers) {
        if (peer.peerId === trimmed) {
          const countryKey = country.countryCode ?? "Unknown";
          setResult({ peer, countryKey, countryName: country.countryName, flag: country.flag });
          onFound(countryKey, peer.peerId);
          return;
        }
      }
    }
    setResult("not-found");
    onClear();
  }, [query, countries]);

  const topPct =
    result && result !== "not-found"
      ? Math.ceil((result.peer.rank / totalPeers) * 100)
      : null;

  return (
    <div className="mb-8 sm:mb-12">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Check if you're in the leaderboard — paste your peer ID"
          className="w-full bg-black/30 backdrop-blur-md border border-white/10 rounded-lg px-4 py-3 text-sm text-cream placeholder:text-muted/50 focus:outline-none focus:border-yellow/40 focus:bg-black/50 transition-colors font-mono"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-cream text-xl w-7 h-7 flex items-center justify-center rounded"
          >
            ×
          </button>
        )}
      </div>

      {result === "not-found" && (
        <div className="mt-2 px-4 py-3 rounded-lg bg-red/10 border border-red/20 text-sm backdrop-blur-md">
          Peer not found in this leaderboard window —{" "}
          <span className="text-cream font-medium">run harder 🔥</span>
        </div>
      )}

      {result && result !== "not-found" && (
        <div className="mt-2 px-4 py-3 rounded-lg bg-green/10 border border-green/20 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-2">
            {result.flag && <span className="text-base leading-none">{result.flag}</span>}
            <span className="text-sm font-medium text-cream">{result.countryName}</span>
            <span className="text-muted text-xs ml-auto tabular-nums">
              #{result.peer.rank} of {totalPeers}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-cream">
            <span>
              Top{" "}
              <span className="text-green font-semibold tabular-nums">{topPct}%</span>
            </span>
            <span>
              Uptime{" "}
              <span className="text-cream tabular-nums">
                {formatUptime(result.peer.uptimePct)}
              </span>
            </span>
            <span>
              Hours{" "}
              <span className="text-cream tabular-nums">
                {formatHours(result.peer.hours)}h
              </span>
            </span>
          </div>
          <p className="text-muted text-xs mt-2 font-mono truncate">
            {truncatePeerId(result.peer.peerId)}
          </p>
        </div>
      )}
    </div>
  );
}

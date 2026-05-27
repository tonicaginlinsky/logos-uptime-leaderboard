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

const CURL_CMD = "curl localhost:8080/network/info | jq .peer_id";

export default function PeerLookup({ countries, totalPeers, onFound, onClear }: PeerLookupProps) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<FoundResult | "not-found" | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(CURL_CMD).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText();
    setQuery(text.trim().replace(/^"|"$/g, ""));
  };

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
    <div className="mb-4 sm:mb-6">
      <div className="backdrop-blur-md bg-black/30 border border-white/10 rounded-lg px-4 pt-3 pb-3">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Check if you're in the leaderboard — paste your peer ID"
            className="w-full bg-transparent text-sm text-cream placeholder:text-muted/70 focus:outline-none font-mono"
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {query ? (
              <button
                onClick={() => setQuery("")}
                className="text-muted hover:text-cream text-xl w-7 h-7 flex items-center justify-center rounded"
              >
                ×
              </button>
            ) : (
              <button
                onClick={handlePaste}
                className="text-muted/60 hover:text-cream text-xs w-12 py-0.5 rounded border border-white/10 hover:border-white/20 transition-colors"
              >
                paste
              </button>
            )}
          </div>
        </div>
        <div className="border-t border-white/5 mt-2.5 pt-2">
          <div className="flex items-center justify-between gap-3">
            <p className="text-muted/60 text-xs font-mono truncate">
              Fetch your peer ID: {CURL_CMD}
            </p>
            <button
              onClick={handleCopy}
              className="shrink-0 text-muted/60 hover:text-cream text-xs w-12 py-0.5 rounded border border-white/10 hover:border-white/20 transition-colors"
            >
              {copied ? "copied!" : "copy"}
            </button>
          </div>
        </div>
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

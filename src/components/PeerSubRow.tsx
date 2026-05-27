import type { PeerRow } from "@/lib/leaderboard";
import { formatHours } from "@/lib/format";
import UptimeBar from "./UptimeBar";

interface PeerSubRowProps {
  peer: PeerRow;
}

export default function PeerSubRow({ peer }: PeerSubRowProps) {
  return (
    <div className="flex items-center justify-between py-2 px-3 text-sm border-b border-green/10 last:border-b-0">
      <div className="flex items-center gap-2 min-w-0">
        <span className="font-mono text-xs text-muted tabular-nums whitespace-nowrap">
          {peer.peerId.slice(0, 8)}...{peer.peerId.slice(-6)}
        </span>
        {peer.host && (
          <span className="text-muted text-xs hidden sm:inline truncate max-w-[120px]">
            {peer.host}
          </span>
        )}
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <span className="text-muted text-xs tabular-nums">
          {formatHours(peer.hours)}h
        </span>
        <UptimeBar pct={peer.uptimePct} barWidth="w-16" />
      </div>
    </div>
  );
}
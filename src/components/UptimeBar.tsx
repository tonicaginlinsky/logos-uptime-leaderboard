interface UptimeBarProps {
  pct: number;
  barWidth?: string;
}

export default function UptimeBar({ pct, barWidth = "w-20" }: UptimeBarProps) {
  const fillColor =
    pct >= 90 ? "bg-green" : pct >= 70 ? "bg-yellow" : "bg-muted";

  return (
    <div className="flex items-center gap-2.5">
      <span className="tabular-nums text-sm text-cream w-12 text-right shrink-0">
        {pct.toFixed(1)}%
      </span>
      <div className={`${barWidth} h-1 rounded-full bg-white/10 shrink-0`}>
        <div
          className={`h-full rounded-full ${fillColor}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  );
}

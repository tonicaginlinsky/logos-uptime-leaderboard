import type { CountryRow } from "@/lib/leaderboard";
import { formatHours } from "@/lib/format";

interface HoursChartProps {
  countries: CountryRow[];
}

export default function HoursChart({ countries }: HoursChartProps) {
  const top = countries.filter((c) => c.countryCode !== null).slice(0, 20);
  const max = top[0]?.totalHours ?? 1;

  return (
    <div className="space-y-2">
      {top.map((c) => {
        const pct = (c.totalHours / max) * 100;
        return (
          <div key={c.countryCode} className="flex items-center gap-3 group">
            <div className="w-6 text-base leading-none shrink-0 text-center">
              {c.flag ?? "🌐"}
            </div>
            <div className="flex-1 h-5 bg-white/5 rounded-sm overflow-hidden">
              <div
                className="h-full rounded-sm bg-green/60 group-hover:bg-green/80 transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="tabular-nums text-xs text-muted w-20 text-right shrink-0">
              {formatHours(c.totalHours)}h
            </div>
          </div>
        );
      })}
    </div>
  );
}

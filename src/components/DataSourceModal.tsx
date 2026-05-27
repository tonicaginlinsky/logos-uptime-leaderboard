"use client";

interface DataSourceModalProps {
  onClose: () => void;
}

export default function DataSourceModal({ onClose }: DataSourceModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-2xl bg-black/90 border border-white/10 rounded-xl p-6 sm:p-8 text-sm overflow-y-auto max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-cream transition-colors text-lg leading-none"
        >
          ✕
        </button>

        <h2 className="font-sans font-semibold uppercase tracking-[0.15em] text-cream text-base mb-6">
          Data Source & Scripts
        </h2>

        <div className="space-y-6 text-muted leading-relaxed">

          <div>
            <h3 className="text-cream text-xs uppercase tracking-widest font-medium mb-2">Pipeline</h3>
            <div className="bg-white/5 rounded-lg p-4 font-mono text-xs text-muted leading-6">
              hourly node logs<br />
              {'  '}↓ <a href="https://github.com/tonicaginlinsky/logos-uptime-leaderboard/blob/main/scripts/extract_recent_rg.sh" target="_blank" rel="noopener noreferrer" className="text-yellow/80 hover:text-yellow underline underline-offset-2 transition-colors">extract_recent_rg.sh</a><br />
              {'  '}peers_recent.csv · ip_peers_recent.csv<br />
              {'  '}↓ <a href="https://github.com/tonicaginlinsky/logos-uptime-leaderboard/blob/main/scripts/uptime_olympics.py" target="_blank" rel="noopener noreferrer" className="text-yellow/80 hover:text-yellow underline underline-offset-2 transition-colors">uptime_olympics.py</a><br />
              {'  '}uptime_olympics.txt → data/last-Nd.txt
            </div>
          </div>

          <div>
            <h3 className="text-cream text-xs uppercase tracking-widest font-medium mb-2">How it works</h3>
            <p>
              <a href="https://github.com/tonicaginlinsky/logos-uptime-leaderboard/blob/main/scripts/extract_recent_rg.sh" target="_blank" rel="noopener noreferrer" className="text-yellow/80 hover:text-yellow underline underline-offset-2 transition-colors"><code>extract_recent_rg.sh</code></a> scans hourly-rotated Logos node
              logs (<code className="text-cream/70">logos-blockchain.log.YYYY-MM-DD-HH</code>) using ripgrep,
              extracting peer IDs, IPs, and stake info into CSV files. A size+mtime cache means only the
              currently-rotating log file is re-processed on each run.
            </p>
            <p className="mt-3">
              <a href="https://github.com/tonicaginlinsky/logos-uptime-leaderboard/blob/main/scripts/uptime_olympics.py" target="_blank" rel="noopener noreferrer" className="text-yellow/80 hover:text-yellow underline underline-offset-2 transition-colors"><code>uptime_olympics.py</code></a> counts distinct (peer, hour) pairs
              over the trailing window, geo-resolves IPs via ip-api.com (cached in{" "}
              <code className="text-cream/70">ip_geo_cache.json</code>), and writes a ranked leaderboard
              sorted by total uptime hours then average uptime %.
            </p>
          </div>

          <div>
            <h3 className="text-cream text-xs uppercase tracking-widest font-medium mb-2">Reproduce locally</h3>
            <div className="bg-white/5 rounded-lg p-4 font-mono text-xs leading-6 space-y-1">
              <p><span className="text-muted"># install deps</span></p>
              <p className="text-cream/80">pip install -r scripts/requirements.txt</p>
              <p className="text-cream/80">brew install ripgrep</p>
              <p className="mt-3 text-muted"># fetch logs and render (requires node credentials)</p>
              <p className="text-cream/80">AUTH=user:password make refresh DAYS=7</p>
              <p className="mt-3 text-muted"># or render from existing cached CSVs</p>
              <p className="text-cream/80">DAYS=7 make olympics</p>
              <p className="text-cream/80">cp uptime_olympics.txt ../data/last-7-days.txt</p>
            </div>
          </div>

          <div>
            <h3 className="text-cream text-xs uppercase tracking-widest font-medium mb-2">Notes</h3>
            <ul className="space-y-1.5 list-none">
              <li>— Log fetch credentials are not public. Contact the node operator.</li>
              <li>— Geo-lookup uses ip-api.com; results cached in <code className="text-cream/70">ip_geo_cache.json</code>.</li>
              <li>— Peer uptime = distinct hours the peer appeared in logs ÷ window hours.</li>
              <li>— Country avg uptime = mean across all peers from that country.</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}

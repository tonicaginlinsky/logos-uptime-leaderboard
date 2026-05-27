# Retro Log — logos-uptime-leaderboard

## Session 2026-05-28

### Wins
- [project] Peer ID lookup shipped pure frontend — no backend needed, all ~116 peers already client-side
- [project] Safari touch-blocking root cause found: fixed+backdrop-filter WebKit compositing bug. Removing blur from fixed footer fixed ALL touch events site-wide
- [project] Duplicate style prop bug: React silently drops one, causing hydration failure with no console error — hard to diagnose without knowing the pattern
- [project] Vercel HTTPS vs localhost HTTP revealed Safari interactivity difference — confirmed localhost was masking bugs, not causing them
- [process] Iterative deploy loop (vercel --yes background + task notifications) worked well for rapid mobile testing
- [project] z-index: 1 on fixed map element breaks backdrop-filter on overlying elements — stacking context trap

### Fails
- [project] Spent multiple rounds debugging "blur disappeared" — root cause was three separate issues at different times: (1) z-index on map, (2) split blur/bg divs, (3) hydration failure from duplicate style prop. Each fix exposed the next layer. Root cause of slow diagnosis: didn't read the React hydration warning clearly enough early on.
- [project] `</div>}` Turbopack syntax error — assumed JSX shorthand `{open && <div>...</div>}` was fine without parens, cost one build cycle. Root cause: Turbopack stricter than standard JSX parsers on inline closing.
- [process] Multiple stale background task notifications accumulated from previous sessions — created noise. Root cause: background tasks not tracked/cancelled when session changes direction.

# Retro Log — logos-uptime-leaderboard

## Session 2026-06-09

### Wins
- [process] Discord sync before implementing saved a full re-migration — learned chair's Vercel is linked to his GitHub account, which killed the migration plan before we wasted time on it
- [project] Identified stale fork quickly by comparing file sizes and headers (116 vs 646 peers, ~2 weeks behind)
- [project] `deploy.yml` with `paths: data/**` correctly scopes Vercel rebuilds to data changes only — no wasted builds on code-only pushes
- [process] Iterative alias/promote/verify loop found the real issue (stale build, not CDN) before escalating

### Fails
- [process] Set up sync workflow in the wrong direction twice (tonicaginlinsky→chair28980, then reversed) before understanding the full deployment ownership. Root cause: didn't map out who owns what Vercel account before writing any workflow code.
- [project] First `vercel --prod` deployed stale data because it ran before `git pull`. Root cause: assumed local files were current after resetting the branch; didn't verify data file contents before deploying.
- [project] `GITHUB_TOKEN` push from GitHub Actions never triggered the downstream deploy workflow — sync committed fresh data but no rebuild fired. Root cause: GitHub silently blocks GITHUB_TOKEN-triggered pushes from cascading to other workflows; we only discovered this after checking the run list.
- [process] Spent 3 rounds debugging "site still shows old data" — tried CDN cache, alias, promote — root cause was a stale build artifact from before the pull. Should have verified build content (direct deploy URL) first before chasing CDN.

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

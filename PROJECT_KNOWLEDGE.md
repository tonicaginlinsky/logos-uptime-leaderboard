# Project Knowledge — logos-uptime-leaderboard

Next.js 16 canary (Turbopack) + Tailwind v4 + React 18 static leaderboard.
Live at: https://leaderboard.logos.live

---

## Architecture

- **Static site** — all data loaded at build time from `data/last-7-days.txt` + `data/last-30-days.txt`
- **Client interactivity** — `LeaderboardClient.tsx` owns all state; server component passes parsed data as props
- **Map** — SVG world map (`WorldMapBackground.tsx`), fixed-positioned, opacity-driven, `inert` + `pointer-events:none`
- **Treemap** — pure SVG (`TreemapChart.tsx`), desktop only (`hidden sm:block`), crossfades with map on scroll
- **Peer lookup** — pure frontend search across `active.countries.flatMap(c => c.peers)`, collapsible block

## Critical Bugs Fixed

### Duplicate `style` prop → React hydration failure
React silently drops one `style` prop when two appear on the same element. This causes hydration failure — all event handlers silently detach. No console error. Fix: merge into single style object or use Tailwind class for one value.

### `backdrop-filter` broken by explicit `z-index` on fixed map
Adding `zIndex: 1` (inline style) to a `position: fixed` element creates a new CSS stacking context. Elements above it that use `backdrop-filter` can no longer see through it. Fix: no explicit z-index on `WorldMapBackground` wrapper — use only Tailwind `z-10` on the content div above it.

### `backdrop-filter` broken by splitting blur and bg onto separate elements
`backdrop-blur` and `bg-black/30` must be on the **same element** to render correctly. Splitting them (e.g. outer div has blur, inner div has bg) causes blur to disappear. Fix: single wrapper div with both classes.

### iOS Safari: `position: fixed` + `backdrop-filter` blocks all touch events
Known WebKit compositing bug. Any `position: fixed` element with `backdrop-blur` creates a compositor layer that absorbs ALL touch events across the entire viewport — even elements above it in z-index. Fix: remove `backdrop-blur` from the footer and bottom tab toggle (both are `position: fixed`). Use `bg-black/90` instead.

### `inert` attribute dropped by React 18
React 18 silently drops unknown HTML attributes including `inert`. Fix: set via `useEffect` + `ref.current.setAttribute("inert", "")`.

### SVG `pointer-events: none` not inherited in Safari
Safari doesn't inherit `pointer-events: none` into SVG children from a parent div. Fix: add explicit `style={{ pointerEvents: "none" }}` on the `<svg>` element itself.

### Turbopack JSX: `</div>}` on same line is a syntax error
Turbopack rejects `</div>}` as an unexpected token. Conditional JSX blocks must use `{condition && ( <div>...</div> )}` with explicit parentheses and the closing `)}` on its own line.

## Patterns

### Scroll-ratio crossfade
```tsx
const blendT = Math.min(1, Math.max(0, (scrollRatio - 0.45) / 0.2));
const mapOpacity = bottomView === "chart" ? 1 - blendT : 1;
const chartOpacity = bottomView === "chart" ? blendT * 0.85 : 0;
```
Crossfade triggers between 45%–65% scroll position.

### Peer lookup search
All ~116 peer records loaded client-side. Search: `active.countries.flatMap(c => c.peers).find(p => p.peerId === query)`. Percentile: `Math.ceil(peer.rank / totalPeers * 100)`.

### CountryRow highlight filter
Pass `highlightPeerId?: string` to `CountryRowComponent`. When set, `displayedPeers = row.peers.filter(p => p.peerId === highlightPeerId)`. The country auto-expands via `expandCountry(key)` (additive, never toggles).

### Glass card pattern
```tsx
<div className="backdrop-blur-md bg-black/30 border border-white/10 rounded-lg">
```
Never add `overflow-hidden` to this element — it clips the blur.

## Deployment

- Branch: `main` (production) — `ui-improvements` merged 2026-06-09
- Vercel project: `alisheryakupov-1493s-projects/logos-uptime-leaderboard`
- Vercel CLI: `vercel --prod --yes` for manual production deploy
- Each deploy gets a unique URL — old URLs serve stale builds
- Deployment Protection must be disabled in Vercel settings for public access
- Custom domain: `leaderboard.logos.live` via CNAME `vercel-dns-017.com` in Namecheap

## Data Pipeline

- Data source: `chair28980/logos-uptime-leaderboard` (updated by David's agent)
- Canonical repo: `tonicaginlinsky/logos-uptime-leaderboard` (code + data, deploys to Vercel)
- David pushes `data/last-7-days.txt` + `data/last-30-days.txt` directly to `tonicaginlinsky/main`
- Push to `data/**` triggers `.github/workflows/deploy.yml` → `npx vercel deploy --prod`
- Vercel secrets on repo: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

### GITHUB_TOKEN push does NOT trigger other workflows
GitHub Actions blocks cascade triggers from `GITHUB_TOKEN` pushes. If a workflow commits+pushes data, a downstream deploy workflow will NOT fire. Fix: use a PAT for the push, or call `vercel deploy` directly in the same job.

### Verify local data before deploying
`vercel --prod` can reuse cached build outputs. Always check `head -4 data/last-7-days.txt` before deploying. If the direct deployment URL shows new data but the domain shows old — run `vercel alias <deployment-url> leaderboard.logos.live`.

## Color Palette

```css
--color-green: #10b981;
--color-yellow: #f59e0b;
--color-red: #ef4444;
--color-cream: #f0ede8;
--color-bg-deep: #080b10;
--color-muted: rgba(240, 237, 232, 0.5);
```

# Halt — 2026-06-09

## Where we stopped

Session complete. Merged `ui-improvements` → `main`, rebuilt the data pipeline, and ran retro. The leaderboard is live at `leaderboard.logos.live` with fresh data (646 peers, window 2026-06-01 → 2026-06-08). David has write access to `tonicaginlinsky` and will push data updates directly; the new `deploy.yml` workflow auto-redeploys Vercel on `data/**` changes.

## Current state

- Branch: `main`
- Last commit: `7dd4d71 retro: 2026-06-09 — pipeline rebuild, deployment pitfalls`
- Build status: passing — Vercel deployment live, `leaderboard.logos.live` serving current data
- Open review: none

## Next steps (in order)

1. Verify David's first data push triggers `deploy.yml` correctly end-to-end
2. If David's push uses a bot/GITHUB_TOKEN, add a PAT to the workflow (see PROJECT_KNOWLEDGE.md — GITHUB_TOKEN doesn't cascade to other workflows)
3. No other code work pending

## Blockers

- None — pipeline is live, David is onboarded

## Context that's hard to re-derive

- `chair28980`'s Vercel is linked to his GitHub account — this is why we kept `tonicaginlinsky` as the deployment repo instead of migrating to his fork. Don't re-open that migration question.
- The GitHub Pages workflow (`nextjs.yml`) was intentionally removed — Vercel is the sole deployment target now. GitHub Pages is still enabled on the repo (GitHub infrastructure) but we no longer push to it.
- Vercel secrets (`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`) are set on `tonicaginlinsky` repo — no need to re-add.
- Local `main` branch was historically an orphan (different history from `ui-improvements`). Was reset to `ui-improvements` tip this session. Don't be alarmed if old git archaeology shows unrelated commits.

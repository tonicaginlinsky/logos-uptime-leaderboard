---
id: safari-fixed-backdrop-filter-touch-block
title: Remove backdrop-blur from position:fixed elements on iOS Safari
phase: hardening
type: bug-pattern
severity: high
severity_reason: Silently blocks all touch events site-wide — buttons and links stop working with no visible error
last_used: "2026-05-28"
created: "2026-05-28"
status: active
---

## Problem

On iOS Safari, any `position: fixed` element with `backdrop-filter` (including Tailwind `backdrop-blur-*`) creates a compositor layer that absorbs ALL touch events across the entire viewport — including elements above it in z-index. Buttons and links stop working. No JS error, no visual change, works fine in Chrome/Firefox.

## Recipe

Remove `backdrop-blur-*` from any `position: fixed` element (footer, sticky tabs, modals anchored to viewport):

```tsx
// BROKEN — blocks all touches on iOS Safari
<footer className="fixed bottom-0 ... backdrop-blur-md bg-black/60">

// FIXED — use opaque bg instead
<footer className="fixed bottom-0 ... bg-black/90">
```

For bottom tab toggles and any other fixed UI chrome — same rule. Use `bg-black/80` or higher opacity instead of blur.

## Why

WebKit compositing bug. The fixed+backdrop-filter combination triggers a layer promotion that intercepts touch hit-testing before it reaches the correct target. Not reproducible on localhost HTTP — requires HTTPS (Vercel/production) to reproduce on device.

## See also
- css-zindex-stacking-context-backdrop-filter

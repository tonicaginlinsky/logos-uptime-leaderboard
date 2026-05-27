---
id: css-zindex-stacking-context-backdrop-filter
title: Explicit z-index on a fixed element breaks backdrop-filter on elements above it
phase: hardening
type: bug-pattern
severity: medium
severity_reason: backdrop-blur silently stops working — glass card effect disappears with no error
last_used: "2026-05-28"
created: "2026-05-28"
status: active
---

## Problem

Adding an explicit `z-index` (via inline style or Tailwind `z-*` class) to a `position: fixed` element creates a new CSS stacking context. Elements that sit above it in the DOM using `backdrop-filter`/`backdrop-blur` can no longer see through it — the blur effect disappears silently.

## Recipe

```tsx
// BROKEN — zIndex:1 on map creates stacking context, breaks blur on table above
<div
  className="fixed inset-0"
  style={{ zIndex: 1, opacity }}  // ← removes backdrop-filter on higher elements
>

// FIXED — no explicit z-index on the background layer
<div
  className="fixed inset-0"
  style={{ opacity }}
>

// Content above uses Tailwind class (not inline style) for z-index
<div className="relative z-10 ...">
```

## Why

A new stacking context isolates the element's painting. `backdrop-filter` composites against the nearest stacking context boundary — not the actual background below. Tailwind's `z-10` on a non-positioned element doesn't create a stacking context, so it's safe. Inline `style={{ zIndex }}` on `position: fixed` always does.

## See also
- safari-fixed-backdrop-filter-touch-block

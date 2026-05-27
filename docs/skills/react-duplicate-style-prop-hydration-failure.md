---
id: react-duplicate-style-prop-hydration-failure
title: Never duplicate style prop on a JSX element — causes silent hydration failure
phase: hardening
type: bug-pattern
severity: high
severity_reason: React silently drops one style object, causing hydration mismatch; all event handlers detach with no console error
last_used: "2026-05-28"
created: "2026-05-28"
status: active
---

## Problem

Two `style` props on the same JSX element compiles without error but React silently drops one at runtime. This causes a server/client hydration mismatch. The result: **all event handlers on that element and its subtree silently detach** — clicks, onChange, nothing works. No console error, no React warning in production builds.

## Recipe

```tsx
// BROKEN — React drops one style silently
<div
  className="relative z-10"
  style={{ zIndex: 10 }}          // ← duplicate
  style={{ paddingBottom: "..." }} // ← this wins, zIndex lost
>

// FIXED — merge into single style object
<div
  className="relative z-10"
  style={{ paddingBottom: "calc(100vh + 80px)" }}
>
// or use Tailwind class for one value and style for the other
```

## Why

JSX compiles to `React.createElement(type, props)`. When two identical prop keys appear, the second overwrites the first in the props object before React sees it. The hydration mismatch between SSR (which may see one value) and client (which sees the other) silently breaks event handler attachment.

---
title: Home Genres reserved chevron
type: note
date: 2026-08-11
tags: [home, genres, overflow, a11y]
impl: 43
---

# Impl 43 — SoftGate Comic Home Genres reserved chevron

## What shipped

- Home `Genres:` strip uses the same Impl 26 pattern as Categories: `useOverflowScrollX` + reserved right chevron (not overlay)
- Separate hook instance from Continue Reading rail (no shared ref)
- Fixed `Genres:` label stays outside the scroll rail; chips keep Home link styles (`rounded-2xl`)
- `a11y.scrollGenresRight` reused for the button label
- Vitest setup: global `ResizeObserver` stub so HomePage tests mount the always-on genre overflow hook

## Verify

`npm run check` — narrow Home viewport and confirm chevron appears when chips overflow.

## Next Impl

**44**

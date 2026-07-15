---
title: Floating label clip-path reveal (Impl 78)
type: note
date: 2026-07-09
tags: [immersive, motion, floating-controls, clip-path]
---

# Floating label clip-path reveal (Impl 78)

Committed summary. Full detail (gitignored): `docs/sessions/2026-07-09-session-summary.md`.

## Outcome

- Sticky/accumulating hover labels fixed by isolating Motion variant keys (`labelHidden` / `labelVisible`) from toolbar `hidden` / `visible`.
- Hover uses pointer state on a plain wrapper (not `whileHover` sharing parent keys).
- Clip-path text reveal from button edge: `inset(0 0 0 100%)` → `inset(0 0 0 0)` (~360ms in / 240ms out).
- `npm run check` PASS — **142 tests**.

## Canonical wiki

- [implementation-phases.md](../architecture/implementation-phases.md) — Impl 78
- [pm-tracker-airtable.md](../references/pm-tracker-airtable.md) — row 80
- [immersive-ui.md](../conventions/immersive-ui.md) — controlsIn hover label contract

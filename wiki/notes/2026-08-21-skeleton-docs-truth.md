---
title: Impl 157 — Lock skeleton docs to pulse + current contract
type: note
date: 2026-08-21
tags: [skeleton, loading, docs, pulse, 155a, 155b, softgate]
impl: 157
---

# Impl 157 — Lock skeleton docs to pulse + current contract

Docs-only. Wiki + session now match **current code**. No `src/` changes. Sheen stays reverted (156).

## Map (do not treat 155a/155b as new Impl numbers)

| Label    | What                                                                                                                         | Note                                                                                     |
| -------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **155a** | Website layout pass: guest Home, Daily lip, hub comments, Library/Author                                                     | [2026-08-21-page-skeletons-match-live.md](2026-08-21-page-skeletons-match-live.md)       |
| **155b** | Admin agent contract in this repo: CatalogStatus, cover setters, extra skeletons, prefetch. Sheen added, then 156 removed it | [2026-08-21-skeleton-production-contract.md](2026-08-21-skeleton-production-contract.md) |
| **156**  | Pulse restore; 155a order kept; 155b extras stayed                                                                           | [2026-08-21-skeleton-pulse-restore.md](2026-08-21-skeleton-pulse-restore.md)             |
| **157**  | This note: docs truth lock                                                                                                   | (here)                                                                                   |

Both 155 notes keep `impl: 155`. Quick index has **one** `| 155 |` row.

## Current (code)

- Primitive: `animate-pulse`. No `skeleton-sheen` / `coverSheenClass` / `SkeletonLibraryCard`.
- Hub skeleton: comments; **no** Other works / You may also like. Always `hub-next-drop-slot` (live next-drop is gated).
- `CatalogStatus`: `App.tsx` sibling of `<Routes>`, **above** nav; hidden on auth prefixes.
- Cover overlay pulse only if the page passes `imageLoaded` (default `true`).

## Parked (not this Impl)

CatalogStatus below nav; cover `img.complete`; hub Other works / next-drop CLS; Profile / Coins / Notifications on catalog `isLoading`. Daily 6 vs Demo 1–3 is locked in [2026-08-21-daily-skeleton-cap.md](2026-08-21-daily-skeleton-cap.md) (Impl 158).

## Files

- `wiki/conventions/loading-states.md`
- `wiki/notes/2026-08-21-page-skeletons-match-live.md`
- `wiki/notes/2026-08-21-skeleton-production-contract.md`
- `wiki/notes/2026-08-21-skeleton-pulse-restore.md`
- `wiki/architecture/implementation-phases.md`
- `wiki/README.md`, `wiki/00-overview.md`, `wiki/02-workflow.md`

## Verify

`npm run check`. No `src/` in the diff.

## Next

Impl **159** — free (parked UX only if asked). Daily skeleton cap locked in 158.

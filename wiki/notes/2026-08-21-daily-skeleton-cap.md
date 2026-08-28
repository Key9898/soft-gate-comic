---
title: Impl 158 — Lock Daily skeleton cap
type: note
date: 2026-08-21
tags: [daily, skeleton, loading, cap, discovery, softgate]
impl: 158
---

# Impl 158 — Lock Daily skeleton cap

Docs-only. Bones already ship from **155a** in `HomePageSkeleton`: 7 weekday chips + 6 `SkeletonDailyDropCard` lip tiles. This Impl documents the contract. No `src/` changes. Do not rebuild Daily UI, change `dailyDrops.ts`, restore `uploadDay`, or mix Continue / For You.

## Contract

- **7** weekday chips (`home-daily-weekday`).
- **6** lip bones, indices **0–5** = `DISCOVERY_RAIL_CAP` **reserved slots**, not “6 drops exist”.
- CMS/Admin count is **0–6** and unknown at hand-off. Do **not** bind to Demo 1–3.
- Do **not** put `home.dailyEmpty` (or any empty copy) on the skeleton. Loading ≠ empty. Empty copy is live after catalog load (`HomeDailyBoard`).
- Published leaving Daily for Updated is a **live** job, not a skeleton prediction.
- Do not use `uploadDay` or `Date.getDay()` (live cadence is Impl **153**: `scheduledAt` + `Asia/Yangon`).

## Files

- `wiki/conventions/loading-states.md`
- `wiki/conventions/discovery-honesty.md` (Daily bullet one-liner)
- `wiki/notes/2026-08-21-daily-skeleton-cap.md` (this note)
- `wiki/architecture/implementation-phases.md`
- `wiki/README.md`, `wiki/00-overview.md`, `wiki/02-workflow.md`

## Verify

`npm run check`. No `src/` in this Impl’s diff.

## Next

Impl **160**. Continue / For You stays a separate Impl if asked. Hero skeleton chrome locked in 159.

## Related

- [loading-states.md](../conventions/loading-states.md)
- [discovery-honesty.md](../conventions/discovery-honesty.md)
- [2026-08-19-daily-drops.md](2026-08-19-daily-drops.md) (153)
- [2026-08-19-discovery-time-family.md](2026-08-19-discovery-time-family.md) (154)
- [2026-08-21-page-skeletons-match-live.md](2026-08-21-page-skeletons-match-live.md) (155a bones)
- [2026-08-21-skeleton-docs-truth.md](2026-08-21-skeleton-docs-truth.md) (157)
- [2026-08-21-hero-skeleton-chrome.md](2026-08-21-hero-skeleton-chrome.md) (159)

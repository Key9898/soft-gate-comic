---
title: Continue Reading shelf conventions
type: convention
date: 2026-08-11
tags: [home, continue, engagement, progress]
---

# Continue Reading

Auth-gated Home shelf driven by `softgate_engage_v1` history (`EngagementContext`). Guests never see the rail. Empty authenticated history → omit the section (no placeholders). Home fills that empty slot with **Start here** (catalog rail, not fake progress) — see [guest-access.md](guest-access.md) and [discovery-honesty.md](discovery-honesty.md). Continue and Start here never show together.

## Resume route

`/read/:webtoonId/:episodeNumber` — last opened episode from `HistoryRecord`.

## Progress bar (shelves)

- Track: `bg-gray-200`
- Fill: `bg-primary-600` (not accent neon)
- Height: ~`h-[3px]` under the cover
- Soft-Expressive chips elsewhere stay `rounded-2xl` (not `rounded-full`)

## Progress math

Shared helpers in `src/lib/engagement/progress.ts`:

- Blended (schema v2): `blendedProgressPercent(episodeNumber, episodeCount, scrollRatio)`  
  `((episodeNumber - 1) + clamp01(scrollRatio)) / episodeCount * 100` (`clamp01` is module-internal)
- Hide from Continue when `isSeriesCompleteForContinue` — last episode and `scrollRatio >= 0.98` (or episode beyond count)

Home Continue and Library History both use the blended helper. Detail Continue is documented in [series-hub.md](series-hub.md).

Continue tiles keep the progress bar **and** catalog Title / Description / Category / Views / Date (`CatalogBookCard`, Impl 96). Library grid/list is not a catalog tile.

## Scroll depth (Impl 41)

`HistoryRecord.scrollRatio` optional `0..1` within the current episode. Schema version **2**; v1 records normalize to `scrollRatio: 0` in place (no wipe). Reader throttles persist (~1s) and flushes on hide / unmount / episode change; no writes while premium-locked. Restore when `scrollRatio > 0.02`.

## Read episode set (Impl 63)

`HistoryRecord.readEpisodeNumbers?: number[]` — the episodes actually opened, additive on schema v2 (no bump). Storage sanitizes (finite, > 0, dedupe, sort asc); legacy records without the field fall back to `[episodeNumber]` (honest single-episode count — never re-inflate to `1..N`). `recordHistory`/`updateReadingProgress` union the set; `EngagementContext.readEpisodeNumbers(webtoonId)` returns the stored set; Profile "episodes read" sums set lengths. **Never derive read state as a `1..lastEpisode` range.**

## Rail chrome

Horizontal scroll via `useOverflowScrollX` with a **reserved** right chevron slot (Impl 26 pattern — not an overlay). Cap display ~12 items, `lastReadAt` desc.

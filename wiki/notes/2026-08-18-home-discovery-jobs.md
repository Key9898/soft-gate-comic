---
title: Home discovery jobs (spotlight, ranking, trending)
type: note
date: 2026-08-18
tags: [home, discovery, ranking, trending, spotlight, a11y, softgate]
impl: 104
---

# Impl 104 — Home discovery jobs

Gist items 2–6. Item 1 (skip + Pause) unchanged.

## Why

Hero and the first Home rail both sliced lifetime `viewCount`, so guests counted duplicate titles. International portals split **spotlight**, **popular**, and **trending** (velocity). Same title may appear in more than one module.

## What shipped

- `Webtoon.spotlight`, `spotlightOrder`, `weeklyViewCount` (optional). Schema **8**.
- Selectors in `src/lib/catalog/discovery.ts`. No ID stripping. Spotlight fallback to `viewCount` only when zero flags exist.
- Home order: Spotlight Hero, genres, Continue, Ranking (1–6), Trending, Updated, New.
- Guest / empty-history **Start here** eyebrow on Ranking.
- Stable Hero `h1` kicker; series title is a `<p>`. Home cover `tabIndex={-1}`.
- Categories `sort=popular` title uses `home.ranking`. `sort=recentlyUpdated` uses `categories.recentlyUpdated`.
- Nav popular link uses `home.ranking`.

## Verify

`npm run check`

Home: Spotlight kicker does not rotate. Ranking shows 1–6. Trending order is not the same as Ranking. Updated View all opens Recently Updated. Tab: one Start Reading in the hero, not the cover.

## Next

Impl **105**

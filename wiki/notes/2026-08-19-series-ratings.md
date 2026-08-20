---
title: Series ratings on catalog + Highest Rated
type: note
date: 2026-08-19
tags: [rating, catalog, categories, engagement, softgate]
impl: 114
---

# Impl 114 — Series ratings on catalog + Highest Rated

Plan drafted as Impl 113; 113 was taken by Contact hours/FAQ fill.

## What shipped

- Catalog covers (`CatalogBookCard`) show a top-right dark chip: gold star + community `webtoon.rating` (one decimal). `aria-hidden`. Not on HeroBook3D.
- Premium pill moved into that stack (was Categories `extraBadge` at the same corner). Home/Search/Related now show Premium too.
- `SeriesRatingControl`: 0.5-step radiogroup on webtoon detail (between stats and Start Reading) and Reader chapter-complete (after reading time, before Next Chapter).
- Community score stays catalog seed. Your score is `UserEngagement.ratings` (engagement schema **3**). Guest click → `/login` + `state.from`. First rate requires `readEpisodeNumbers.length > 0`. Existing rating remains editable if history is later cleared.
- No fake rating counts. Demo sentence under the control.
- `?sort=highestRated` titles Highest Rated with `Star`. Ranks still only when `?sort=popular`.

## Verify

`npm run check`

Cover chip readable on light art. Premium under the chip. Popular ranks unchanged. Highest Rated unranked. Rate after reading; community number does not move.

## Next

Impl **115**

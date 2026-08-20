---
title: Popular ranks inside the cover
type: note
date: 2026-08-19
tags: [home, ranking, popular, rankmark, softgate]
impl: 119
---

# Impl 119 — Popular ranks inside the cover

Impl 117 hung a giant digit into the title row (`coverEnd` + `pl-12`) on a two-column poster chart. That was not the WEBTOON cover-layer treatment and did not match Home’s other rails.

Superseded in part by [Impl 124](2026-08-19-popular-rank-glyph.md): the digit is still a child of the full hardcover (no pocket), now white fill + primary stroke.

## What shipped

- One `RankMark`: child of `.book-media`, cover bottom-left, `text-primary-600`, white stroke, `text-2xl sm:text-3xl`. No chart/tile variants.
- Title full width (no indent). No hang into the title row.
- Home Popular is the same 6-up wrapping grid as Trending (`xl:grid-cols-6`), still an `<ol>`.
- Home skeleton Popular uses the same grid with ranks 1–6 on the cover placeholders.
- Categories `?sort=popular` uses the same mark. Completed/Hiatus move to bottom-right while ranked.
- No fake ▲/▼ week deltas. Gist 3 not started.

## Verify

`npm run check`

Home Popular: digit sits on the cover, tile-scale, primary. Skeleton Popular is six ranked covers, not a number box beside a card. Categories Popular matches. Trending still unranked.

## Next

Impl **120** (gist 3 still open)

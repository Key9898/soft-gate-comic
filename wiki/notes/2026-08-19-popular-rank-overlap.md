---
title: Popular rank hang-overlap
type: note
date: 2026-08-19
tags: [home, ranking, popular, rankmark, softgate]
impl: 117
---

# Impl 117 — Popular rank hang-overlap

Home Popular chart numbers sat beside the cover at `text-5xl`/`text-6xl` (1–3 even larger). That read as a giant counter, not a rank.

Superseded by [Impl 119](2026-08-19-popular-rank-on-cover.md): ranks live inside the cover on the 6-up Home grid.

## What shipped

- Chart `RankMark` hangs off the cover bottom-left, outside `.book-media` `overflow: hidden`, `translate-y-[45%]`, `text-4xl font-black text-gray-900`. Same size for ranks 1–6.
- Title/meta indent `pl-12` so copy sits to the right of the digit (WEBTOON geometry).
- No fake ▲/▼ week movement (no that field yet).
- Keep the 6-up two-column ordered chart and View all. Do not switch to a 5-card carousel.
- Categories `?sort=popular` tile ranks stay bottom-right (Completed/Hiatus already occupy bottom-left).
- Gist 3 (Updated vs New visual split) not started.

## Verify

`npm run check`

Home Popular: digit half on the cover, half in the title row, not a huge number in a left gutter. Nav/View all Popular still ranked. Trending still unranked.

## Next

Impl **118** (gist 3 still open)

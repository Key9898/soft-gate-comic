---
title: Categories chart chrome without podium
type: note
date: 2026-08-19
tags: [categories, ranking, chrome, sticky, a11y, softgate]
impl: 143
---

# Impl 143 — Categories chart chrome

Drafted as Impl 142; **142** was taken by the account hub. This ships as **143**.

`/ranking` and genre Popular feel like a chart: `<ol>` grid, RankMark on cover, numbered-chart eyebrow, `radial-wash-primary` on the masthead only. No podium, no giant `#1`, no two-column chart. Browse / New stay a `<div>` grid.

Genre + status + count/sort stick below the real nav height (`sticky-below-nav` = `4rem` + safe-area, `z-30`). `h1` + deck scroll away. Header search removed; nav search remains. Empty-grid and genre-404 search stay. Genre/status/chevron `min-h-11`. Genre chips drop `uppercase`.

## Verify

`npx vitest run src/test/CategoriesRanking.test.tsx src/test/CategoriesBrowse.test.tsx src/test/SkeletonStates.test.tsx`

## Next

Impl **144**.

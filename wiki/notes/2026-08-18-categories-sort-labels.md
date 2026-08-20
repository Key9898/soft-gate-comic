---
title: Categories sort labels match Home
type: note
date: 2026-08-18
tags: [categories, sort, ranking, popular, softgate]
impl: 109
---

# Impl 109 — Categories sort labels match Home

Aligns Categories sort chrome with Home item 2 for Popular, New Releases, and Recently Updated.

## What shipped

- Dropdown Popular option uses `home.ranking` (EN Popular / MM လူကြိုက်များစာရင်း). `categories.mostPopular` is unused in UI.
- Popular destination icon is Lucide `ListOrdered` (not `TrendingUp`).
- New / Recently Updated `h1` and dropdown labels were already the Home keys. Unchanged.
- Highest Rated stays in the dropdown. `?sort=highestRated` still shows Browse by Genre until a later discussion.
- Ranks still only when `sort=popular` is in the URL.

## Verify

`npm run check`

Nav Popular and the sort button say Popular. Browse by Genre has no ranks. Home Trending still uses `TrendingUp`.

## Next

Impl **110**

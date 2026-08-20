---
title: Ranking chart + honest Popular destination
type: note
date: 2026-08-18
tags: [home, ranking, trending, categories, discovery, softgate]
impl: 106
---

# Impl 106 — Ranking chart + honest Popular destination

Gist item 2 presentation. Selectors unchanged (Impl 104). Same title may appear in Spotlight, Popular, and Trending.

## What shipped

- Home Popular is `HomeRankingChart`: ordered list. View all `/categories?sort=popular`. Rank chrome is now inside the cover on the 6-up grid ([Impl 119](2026-08-19-popular-rank-on-cover.md)). This note’s 106 ship was a two-column chart with numbers beside the cover.
- Categories shows ranks **only** when the URL has `sort=popular` (Nav Popular / View all). `/categories` without `sort` stays Browse by Genre with no rank aria-labels. Ranks are `index + 1` of the filtered list (tile overlay bottom-right).
- Trending: `home.trendingDesc` + `TrendingUp` icon. No View all. No 1–6 ranks.
- Hero Spotlight, skip link, and Pause untouched. Schema **8**.

## Verify

`npm run check`

Home Popular is a numbered list, not a twin of New. View all / Nav Popular shows 1…9 on mock. Nav Categories has no `1. Shadow Knight` name. Trending has this-week copy and no View all.

## Next

Impl **108**

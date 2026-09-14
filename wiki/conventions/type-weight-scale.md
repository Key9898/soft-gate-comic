---
title: Type weight scale
type: convention
date: 2026-09-14
tags: [typography, weight, hierarchy, tailwind, softgate]
impl: 220
---

# Type weight scale

The portal keeps **Inter** as its single family (`--font-sans`, paired with
`'Noto Sans Myanmar'`). Hierarchy is therefore carried by **size and weight**, not by a
second typeface — which only works if weight actually varies.

## The scale

| Role                                                     | Weight          |
| -------------------------------------------------------- | --------------- |
| Page and section headings, hero titles, prices, balances | `font-bold`     |
| Item titles, labels, eyebrows, chips, control text       | `font-semibold` |
| Body emphasis, secondary metadata                        | `font-medium`   |
| Body copy, decks, descriptions                           | (default, 400)  |

## The exception

Text drawn **on top of cover artwork** keeps `font-bold` at any size:
`RatingChip`, `ContentRatingBadge`, `RankMark`, the `BookCard` badge stack,
`DailyDropCard`'s countdown lip and the hero overlay. That weight is fighting an image
for legibility, not expressing hierarchy, and dropping it makes the label disappear into
whatever cover happens to be behind it.

## Why this exists

Before Impl 220 the distribution was `font-bold` 318, `font-semibold` 161,
`font-medium` 106 — bold outnumbered medium three to one, and **118 of those bolds sat
on `text-xs` / `text-2xs`**, where the weight buys nothing and costs the contrast that a
real heading needs. When everything is bold, nothing is.

After: `font-bold` 140 (headings and cover overlays), `font-semibold` 339,
`font-medium` 106. A Home rail now reads 24px/700 heading → 14px/600 item title →
14px/400 deck, three distinct steps where previously all three were bold.

## Do not

- Reach for `font-bold` on `text-xs` or `text-2xs` outside the cover-overlay exception.
- Add a second family to create hierarchy the weight scale should carry. A display face
  was considered in Phase 5 and deliberately declined: it adds a webfont to the critical
  path and has to be validated against the `html[lang='mm']` 1.8 line-height block.
- Use weight where colour or size is the honest signal — `text-muted` exists for
  secondary text.

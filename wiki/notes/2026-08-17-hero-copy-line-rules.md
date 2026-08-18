---
title: Hero title/deck line rules + overflow
type: note
date: 2026-08-17
tags: [hero, typography, line-clamp, softgate]
impl: 82
---

# Impl 82 — Hero title/deck line rules + overflow

## Why

Trending top-5 catalog copy had no line or overflow rule. Long decks grew the left column and short/long slides jumped. Display CSS now locks line counts; full text stays on webtoon detail.

## What shipped

- Title: `line-clamp-2 lg:line-clamp-1` + `break-words`
- Deck: `line-clamp-2 min-h-2lh break-words`
- Text column + title `motion.div`: `min-w-0` (book wrapper unchanged)
- `@utility min-h-2lh { min-height: 2lh }` in `src/index.css`

## Files

- `src/features/home/components/HeroSpotlight/HeroSpotlight.tsx`
- `src/index.css`
- `src/test/HeroSpotlight.test.tsx`
- `wiki/conventions/hero-spotlight.md`

## Verify

`npm run check`

## Next

Impl **83**

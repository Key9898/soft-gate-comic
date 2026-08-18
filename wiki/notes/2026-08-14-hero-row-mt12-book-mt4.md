---
title: Home hero row mt-12 + book mt-4
type: note
date: 2026-08-14
tags: [hero, herobook3d, layout, softgate]
impl: 81
---

# Impl 81 — Home hero row `lg:mt-12` + book `lg:mt-4`

## Why

Impl 80 row `lg:mt-10` dropped the pair 40px. User wanted a bit more drop, with the book lower than the text (same `mt` on both would push copy too far down).

## What shipped

- Row: `lg:mt-10` → `lg:mt-12` (text 48px)
- Book wrapper: `lg:mt-4` (book 48+16 = 64px)
- Kept `lg:items-center`, `lg:gap-12`, hero `min-h`

## Files

- `src/features/home/components/HeroSpotlight/HeroSpotlight.tsx`
- `src/test/HeroSpotlight.test.tsx`

## Verify

`npm run check`

## Next

Impl **82**

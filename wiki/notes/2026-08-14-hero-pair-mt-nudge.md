---
title: Home hero pair lg:mt-10 nudge
type: note
date: 2026-08-14
tags: [hero, herobook3d, layout, softgate]
impl: 80
---

# Impl 80 — Home hero pair `lg:mt-10` nudge

## Why

Title + 3D book sat visually tight to the top of the hero. `justify-center` cannot drop them: the book box is taller than leftover `min-h` minus padding. User wanted a small downward shift **without** changing hero height.

## What shipped

- Title+book row: `lg:mt-10` (40px, `lg` and up)
- Removed book wrapper `lg:mt-2` so both columns move together
- Kept `lg:items-center` + `lg:gap-12` + hero `min-h` / `py-*`
- Not `items-start` + `pt-*` (would raise the title)

## Files

- `src/features/home/components/HeroSpotlight/HeroSpotlight.tsx`
- `src/test/HeroSpotlight.test.tsx`

## Verify

`npm run check` — Home `lg+`: pair sits ~40px lower; relative title/book alignment unchanged.

## Next

Impl **81**

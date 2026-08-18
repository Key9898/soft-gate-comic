---
title: Hero book enter from under copy
type: note
date: 2026-08-17
tags: [hero, herobook3d, motion, softgate]
impl: 86
---

# Impl 86 — Hero book enter from under copy

## Why

Impl 83/84 enter ran, but started inside the book column (`-5.5rem`) while title/deck faded from opacity 0 — so it never read as emerging from under the left copy.

## What shipped

- Pair row class `hero-spotlight-pair` (`container-type: inline-size`, `container-name: hero-pair`)
- `lg+`: `--hero-book-enter-from: calc(100% - 100cqi) 0`
- Below `lg`: `0 calc(-100% - 2rem)`
- Axis switch: viewport `min-width: 1024px` (not container min-width)
- 0.8s ease-out, `both`, no delay
- Slide group is a plain `div` — title/deck/CTAs opaque at t=0
- Autoplay still respects `useReducedMotion`

## Files

- `src/features/home/components/HeroSpotlight/HeroSpotlight.tsx`
- `src/index.css`
- `src/test/HeroSpotlight.test.tsx`
- `wiki/conventions/hero-spotlight.md`
- `wiki/decisions/005-herobook3d-ux.md`

## Verify

`npm run check`

## Next

Impl **87**

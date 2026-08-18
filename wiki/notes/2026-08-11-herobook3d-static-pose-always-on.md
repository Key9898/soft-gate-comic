---
title: Impl 54 — HeroBook3D static pose always-on
type: note
date: 2026-08-11
tags: [herobook3d, css, reduced-motion, softgate]
impl: 54
---

# Impl 54 — HeroBook3D static pose always-on

## Summary

Static three-quarter hardcover pose + right fore-edge were gated behind `prefers-reduced-motion: no-preference`, so Windows reduced-motion users always saw a flat cover. Unlocked pose as presentation (not animation); reduced-motion now only disables hover lift.

## Changes

- Base CSS: rest `rotateX/Y/Z`, pages `rotateY(90deg)`, cover/back Z always on; scene `preserve-3d`
- `no-preference`: hover lift + transitions only
- `reduce`: no longer `transform: none` / hide pages
- Home book wrapper: `lg:translate-y-2` → `lg:mt-2` (no transform ancestor)

## Files

- `src/index.css`
- `src/features/home/components/HeroSpotlight/HeroSpotlight.tsx`
- `src/test/BookCard.test.tsx`
- `src/test/HeroSpotlight.test.tsx`

## Verify

`npm run check` — DevTools `.hero-book` transform must stay non-`none` under reduced-motion.

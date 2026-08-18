---
title: Home hero book enter from under copy
type: note
date: 2026-08-17
tags: [hero, herobook3d, motion, softgate]
impl: 83
---

# Impl 83 — Home hero book enter (from under copy)

## Why

Carousel slide changes should feel like the hardcover slides out from behind title + description into its rest slot. Framer on the book would flatten CSS 3D.

## What shipped

- Home `HeroBook3D` gets `className="hero-book-enter"`; Detail does not
- CSS `translate` animation on `.hero-book-scene.hero-book-enter` (Impl 84 moved this **out** of `prefers-reduced-motion: no-preference`)
- `--hero-book-enter-from: -5.5rem 0` (`lg+`); `0 -1.75rem` below `lg`
- Text column `relative z-10`; book wrapper `relative z-0 overflow-visible`
- Copy still Framer opacity only; rest pose + hover `transform` unchanged

## Files

- `src/features/home/components/HeroSpotlight/HeroSpotlight.tsx`
- `src/index.css`
- `src/test/HeroSpotlight.test.tsx`
- `src/test/BookCard.test.tsx`

## Verify

`npm run check`

## Next

Impl **84** (force enter for all visitors — [2026-08-17-hero-book-enter-forced.md](2026-08-17-hero-book-enter-forced.md))

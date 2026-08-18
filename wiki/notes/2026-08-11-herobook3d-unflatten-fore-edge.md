---
title: Impl 52 — HeroBook3D unflatten + thick fore-edge
type: note
date: 2026-08-11
tags: [herobook3d, hero-spotlight, css, softgate]
impl: 52
---

# Impl 52 — HeroBook3D unflatten + thick fore-edge

## Summary

Home reference pose was not landing because (1) Impl 49 wrapped `HeroBook3D` in Framer opacity `motion.div` (3D mute/flatten) and (2) Impl 51’s 22px pages at ~32° yaw projected to a ~12px hairline. Fixed both without reviving open/hinge.

## Changes

- `HeroSpotlight`: book is a direct child of the plain `w-56…xl:w-96` / `lg:translate-y-2` wrapper; Framer fade stays on title+CTAs only; book uses `key={current.id}` remount
- CSS: `--hero-book-thickness: 48px`; pose `rotateX(10deg) rotateY(-42deg) rotateZ(-4deg)`; `perspective: 1000px`; cover/back Z from thickness; roomier right scene padding
- Test: assert `.hero-book-scene` parent is the plain width wrapper

## Files

- `src/features/home/components/HeroSpotlight/HeroSpotlight.tsx`
- `src/index.css`
- `src/test/HeroSpotlight.test.tsx`

## Verify

`npm run check`

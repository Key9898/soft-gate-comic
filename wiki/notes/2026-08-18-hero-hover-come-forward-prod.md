---
title: Hero hover come-forward survives production
type: note
date: 2026-08-18
tags: [hero, herobook3d, hover, motion, production, softgate]
impl: 99
---

# Impl 99 — Hero hover come-forward survives production

## Why

Impl 92 second beat (`translate: 0 0 2rem` on `.hero-book`) looked fine in Vite dev but production hover only straightened. Come-forward lived on the same node as rotate, and Home enter animated `translate` on the `perspective` node (`.hero-book-scene`). Production Tailwind v4 Lightning CSS can flatten 3D `translate` Z to 2D; flattened Z is zero screen motion while `rotateY(-42deg)→0` still reads as “the book stands up.” `2rem` at `perspective: 1000px` was only ~3% scale even when it worked.

## What shipped

- Outer `className` shell (`hero-book-enter` on Home only); `aria-hidden` on that shell when decorative
- `.hero-book-scene` is hover/focus-within hit target only — no enter class, no extra `className`
- `.hero-book-motion` wraps `.hero-book` only; floor shadow stays a sibling
- Rotate-only on `.hero-book`; come-forward is `translate3d(0, 0, 0.01px)` → `translate3d(0, 0, 3rem)` on `.hero-book-motion` (same 3D family so minify cannot turn rest into 2D `translate(0)`)
- Enter 2D `translate` keyframes on `.hero-book-enter`, not the perspective node. Distances unchanged (`lg+` `calc(100% - 100cqi) 0`; below `lg` `0 calc(-100% - 2rem)`)
- Two-beat delays unchanged. Forced for every visitor. No `hero-book-enter-hit`, no Framer on the book chain, no Tailwind `translate-*` on the Home width wrapper

## Files

- `src/components/HeroBook3D/HeroBook3D.tsx`
- `src/index.css`
- `src/test/HeroSpotlight.test.tsx`
- `src/test/BookCard.test.tsx`

## Verify

`npm run check`

Home hover: straighten, then the book grows toward the camera. Detail the same (no enter). DevTools hover: `.hero-book-motion` computed transform includes `matrix3d` / `translate3d(..., 3rem)` or `translateZ(48px)`. Production must match, not straighten-only.

## Next

Impl **100**

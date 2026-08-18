---
title: Force hero book hover for all visitors
type: note
date: 2026-08-17
tags: [hero, herobook3d, hover, motion, softgate]
impl: 90
---

# Impl 90 — Force hero book hover for all visitors

## Why

Impl 88 hover still did not play. Deep scan found three independent blockers; none were layout or Framer.

1. Hover/transition rules lived in `@media (prefers-reduced-motion: no-preference)` — same Windows Animation-effects miss as Impl 83 enter.
2. Reduce block set `.hero-book` / `.hero-book-float-shadow { transition: none }`, so even ungated hover would snap or look dead.
3. Home `.hero-book-enter` ran `hero-book-enter-hit` (`pointer-events: none` for 0.8s, `animation-fill-mode: both`). Discrete `pointer-events` can stick at `none`, so Home `:hover` never fired. Detail has no enter class, so it could look “fine” while Home did not.

Standing rule: product motion we add is **forced**. Convention: [forced-product-motion.md](../conventions/forced-product-motion.md).

## What shipped

- Unwrapped Impl 88 straighten-then-lift CSS from `no-preference` (timings/values unchanged)
- Removed `.hero-book` and `.hero-book-float-shadow` from the reduce `transition: none` block
- Removed `hero-book-enter-hit` keyframes and the second animation on `.hero-book-enter`
- Did not change enter offsets, rest Euler, lift `0.75rem`, layout, Framer, Detail/About classes, or StoryBook

## Files

- `src/index.css`
- `wiki/conventions/forced-product-motion.md`
- `wiki/conventions/hero-spotlight.md`
- `wiki/conventions/book-cover-presentation.md`
- `wiki/decisions/005-herobook3d-ux.md`

## Verify

`npm run check`

Home and Detail: hover/focus-within still straighten then lift, including with OS reduce-motion on. Home enter still slides. About stays `StoryBook`.

## Next

Impl **91**

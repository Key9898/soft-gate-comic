---
title: Home hero book enter forced for all visitors
type: note
date: 2026-08-17
tags: [hero, herobook3d, motion, softgate]
impl: 84
---

# Impl 84 — Force Home book enter (ignore reduced-motion)

## Why

Impl 83 gated `.hero-book-enter` behind `prefers-reduced-motion: no-preference`, so Windows Animation effects / OS reduce-motion users never saw the slide. Product requirement: the enter plays for **everyone**.

## What shipped

- Moved `.hero-book-scene.hero-book-enter` animation + mobile offset **out** of the `no-preference` block
- Hover lift / shadow transition stay inside `no-preference`
- Reduce block does not set `animation: none` on `.hero-book-enter`

## Files

- `src/index.css`
- `wiki/conventions/hero-spotlight.md`
- `wiki/decisions/005-herobook3d-ux.md`

## Verify

`npm run check`

## Next

Impl **86**

---
title: Hero book hover straighten then lift
type: note
date: 2026-08-17
tags: [hero, herobook3d, hover, softgate]
impl: 88
---

# Impl 88 — Hero book hover straighten then lift

## Why

Hover used to keep the three-quarter yaw and nudge `translateY(-3px) scale(1.02)` together. Product ask: straighten first, then lift.

## What shipped

- Rest Euler unchanged on `.hero-book { transform }`; identity `translate: 0 0` always on
- Hover/focus-within: `rotateX/Y/Z(0deg)` then `translate: 0 -0.75rem` (no scale)
- Mouse-out: drop then tilt (transition delays swapped)
- Shadow opacity/`scaleX` delayed with the lift
- Home `.hero-book-enter` also runs `hero-book-enter-hit` (`pointer-events: none` for 0.8s)
- Still `no-preference` only

## Files

- `src/index.css`
- `wiki/conventions/book-cover-presentation.md`
- `wiki/conventions/hero-spotlight.md`
- `wiki/decisions/005-herobook3d-ux.md`

## Verify

`npm run check`

## Next

Impl **90**

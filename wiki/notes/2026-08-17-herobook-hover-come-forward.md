---
title: Hero book hover come-forward not lift
type: note
date: 2026-08-17
tags: [hero, herobook3d, hover, motion, softgate]
impl: 92
---

# Impl 92 — Hero book hover come-forward not lift

## Why

Impl 88/90 second beat used `translate: 0 -0.75rem` (screen-up). Product ask: after straighten, the book should come **toward the camera**, not lift up.

## What shipped

- Rest identity `translate: 0 0 0` on `.hero-book`
- Hover/focus-within second beat: `translate: 0 0 2rem` (individual Z, after identity rotate)
- Sequence delays unchanged (straighten first, then move; reverse on mouse-out)
- Still forced for every visitor; enter offsets / rest Euler / shadow delay / layout untouched

## Files

- `src/index.css`
- `wiki/conventions/hero-spotlight.md`
- `wiki/conventions/book-cover-presentation.md`
- `wiki/decisions/005-herobook3d-ux.md`

## Verify

`npm run check`

## Next

Impl **93**

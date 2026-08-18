---
title: About Our Story 3D valley and page turn
date: 2026-08-17
impl: 93
type: note
tags: [about, storybook, css3d, page-turn, softgate]
---

# About Our Story 3D valley and page turn (Impl 93)

Impl 91 fixed cover overflow by flattening the spread (`overflow: hidden` on leaves, no leaf `rotateY`). The object read as a split card. This Impl restores a desk-tilted open book and adds a real CSS page turn.

## Research (no new packages)

- CSS-Tricks: `perspective` + `preserve-3d` + `rotateY` with `transform-origin: left center` is the book hinge; `overflow` / `opacity` on the 3D parent flattens the scene.
- Chrome Developers / Codrops / CodeFronts flipbooks: departing sheet `0° → -180°`, back face pre-rotated `180°`, `backface-visibility: hidden`.
- Rest valley: verso `rotateY(+16deg)` origin right, recto `rotateY(-16deg)` origin left, volume `rotateX(12deg)`.

## What shipped

- Volume `rotateX(12deg)`, thicker spine/board/fore-edge, paper clip inside `.story-book-paper`
- `.story-book-flip` overlay on next/prev (index updates immediately so tests stay sync)
- Still no turn.js / Three.js / Framer on the volume

## Tests

- `StoryBook.test.tsx` — volume turns, flip sheet mounts then `transitionend` removes it, paging/keyboard unchanged

## Verify

`npm run check`

## Next

Impl **94**

---
title: Impl 51 — HeroBook3D fore-edge pose tune
type: note
date: 2026-08-11
tags: [herobook3d, css, pose, softgate]
impl: 51
---

# Impl 51 — HeroBook3D fore-edge pose tune

## Summary

CSS-only tune so the static closed `HeroBook3D` matches the reference hardcover: mild left yaw + clear **right white page stack (fore-edge)**. No open/hinge/fade revival (ADR 005 / Impl 46).

## Changes

- Pose: `rotateX(8deg) rotateY(-32deg) rotateZ(-3deg)` (was steeper / less right-edge readable).
- Pages: fixed **22px** thickness; `left: 100%` + `margin-left: -11px` + `rotateY(90deg)` so the block sits on the book’s right edge (not `translateX(100%)` of the thin face itself).
- Paper lines: horizontal `repeating-linear-gradient(to bottom, …)` so stripes read after the 90° yaw.
- Depth: cover `translateZ(12px)`, back `translateZ(-22px)`.
- Scene: slightly more right padding for fore-edge room; stronger float shadow.
- Reduced-motion: unchanged (flat cover; pages/back hidden).
- Test: assert `.hero-book-pages` present in static scene.

## Files

- `src/index.css` (`.hero-book*` block)
- `src/test/BookCard.test.tsx`

## Verify

`npm run check` (116 tests)

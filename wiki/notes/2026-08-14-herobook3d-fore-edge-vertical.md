---
title: HeroBook3D fore-edge vertical page lines
type: note
date: 2026-08-14
tags: [herobook3d, css, fore-edge, softgate]
impl: 79
---

# Impl 79 — HeroBook3D fore-edge vertical page lines

## Why

Impl 51 painted `.hero-book-pages` with `repeating-linear-gradient(to bottom, …)` so stripes would “read after rotateY(90deg)”. `rotateY` does not remap Y, so the visible right edge looked like **horizontal lined paper**, not a stack of sheets.

A real fore-edge shows vertical sheet edges (top-to-bottom of the book), packed along thickness (cover → back). That is a gradient along **X** (`to right`).

## What shipped

- One token change: `to bottom` → `to right` on `.hero-book-pages`
- Pose, thickness, overflow, Home width: unchanged

## Files

- `src/index.css`

## Verify

`npm run check` — Home/Detail: right page block shows vertical grain, not notebook lines.

## Next

Impl **80**

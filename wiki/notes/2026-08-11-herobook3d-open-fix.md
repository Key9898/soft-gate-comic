---
title: HeroBook3D open fix (flatten + reduced)
type: note
date: 2026-08-11
tags: [hero, book, css3d, a11y, softgate]
impl: 44
---

# Impl 44 — HeroBook3D open fix (A + B)

Plan file labeled “Impl 43”; wiki 43 was Home Genres chevron — this ships as **44**.

## What shipped

- B: `.hero-book-spread` `overflow: visible`; cover uses `translateZ` not `z-index`; softer shell lift so hinge is primary
- A: removed flat `book-media` early return; `hero-book--reduced` + 2D `translateX(-72%)` cover slide; open handlers work under reduced motion
- Tests: reduced path still `.hero-book-scene` + `.is-open` on hover

## Verify

`npm run check`

## Next

Impl **45**

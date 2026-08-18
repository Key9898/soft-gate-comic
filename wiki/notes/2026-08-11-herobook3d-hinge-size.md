---
title: HeroBook3D real hinge + size + reduced fade
type: note
date: 2026-08-11
tags: [hero, book, css3d, a11y, softgate]
impl: 45
---

# Impl 45 — HeroBook3D real hinge + size + reduced fade

## What shipped

- Full motion (`prefers-reduced-motion: no-preference`): hardcover hinge `rotateY(-155deg)`; `backface-visibility` on cover art
- Reduced: opacity cross-fade open — **deleted** `translateX(-72%)` fake slide
- Home/Detail wrappers: `w-56 sm:w-72 lg:w-80 xl:w-96`; tighter `.hero-book-scene` padding

## Verify

`npm run check`

## Next

Impl **46**

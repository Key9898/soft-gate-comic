---
title: HeroBook3D reliable 3D + reference tilt
type: note
date: 2026-08-11
tags: [hero, book, css3d, softgate]
impl: 42
---

# Impl 42 — HeroBook3D reliable 3D + reference tilt

## What shipped

- Home + Detail: plain `div` wrappers around `HeroBook3D` (no Framer `x`/`y` ancestors that flatten `preserve-3d`)
- Cover / leaf / shell poses driven by CSS classes (`is-open`, `is-flipped`) — no Framer `rotateY` inside the book
- Floating three-quarter rest tilt + stronger open pose; separate `.hero-book-float-shadow`
- Removed `.hero-book:hover` / `:focus-within` shell transforms (React phase is source of truth)

## Verify

`npm run check`

## Next

Impl **43**

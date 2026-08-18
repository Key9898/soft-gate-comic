---
title: Book-media presentation (spine grid + 3D hero)
type: decision
date: 2026-08-11
tags: [adr, book, cover, radius, softgate]
impl: 16
---

# ADR 004 — Book-media presentation

## Status

Accepted

## Context

Soft-Expressive radius (Impl 10) locked discovery covers inside `Card` + `rounded-2xl`, which reads as app tiles, not books. Product asked for full hardcover feel: grid = Apple-style spine; hero = 3D with page-flip tryout.

## Decision

1. Introduce `book-media` CSS role with hardcover radius `3px 10px 10px 3px` and spine overlay — explicit exception to Soft-Expressive `rounded-2xl` for **cover media only**.
2. Replace webtoon discovery `Card` shells with `BookCard` (whole tile is the book; meta below).
3. Hero / detail featured cover uses `HeroBook3D` (tilt + open + leaf flip). Reduced motion falls back to flat book-media.

## Consequences

- Controls/panels stay Soft-Expressive; only book covers diverge.
- Convention docs must list the exception so agents do not “normalize” book radii back to `2xl`.
- Full multi-page flip engine is out of scope; one leaf is enough for delight without Three.js.

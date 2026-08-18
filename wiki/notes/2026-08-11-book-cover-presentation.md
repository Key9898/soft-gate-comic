---
title: Impl 16 — Book covers (Hero 3D + Apple spine)
type: note
date: 2026-08-11
tags: [impl, book, cover, hero, softgate]
impl: 16
---

# Impl 16 — Book covers (Hero 3D + Apple spine)

## What shipped

- `BookCard` — whole-tile hardcover with Apple-style spine for discovery grids.
- `HeroBook3D` — perspective book, cover open on hover, page leaf flip on click; reduced-motion flat fallback.
- Wired: Home, Categories, Search webtoons, Library grid/list thumbs, Webtoon detail featured + related.
- CSS: `.book-media`, spine gradient, hero 3D scene in `src/index.css`.
- Radius convention exception + ADR 004.

## Verify

`npm run check`

## Follow-up

Polish leaf content / second page if product wants richer flip; optional Storybook stories.

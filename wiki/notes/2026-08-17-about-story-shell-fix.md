---
title: About Our Story shell fix
date: 2026-08-17
impl: 91
type: note
tags: [about, storybook, css3d, cover, a11y, softgate]
---

# About Our Story shell fix (Impl 91)

Impl 89’s open volume painted as a detached teal slab: chapter-1 cover used `position: absolute; width/height: auto` on a replaced SVG (intrinsic 240×320 ignored the leaf), then `rotateY(±8deg)` swung that overflow over Mission/Vision. Edge-turn hits were transparent teal-on-teal, so arrows were not readable on the book.

## What shipped

- Leaves share a fixed volume height; cover is `width/height: calc(...)` + `object-fit: cover` inside verso. Leaf `overflow: hidden` contains the plate. Book/stage stay `overflow: visible`.
- Dropped leaf `rotateY`. Rest pose is still volume `rotateX(6deg)` only.
- Prev/Next are circular chips on the **recto** (ink page), not a footer pager and not invisible full-height edge hits.
- `public/about/story-cover.svg` redrawn as a webtoon cover (phone strip, burst, OUR STORY) instead of abstract circles.

## Tests

- `StoryBook.test.tsx` — turns live in `.story-book-recto`; paging/keyboard contracts unchanged
- `AboutPage.test.tsx` — volume, cover, no pager, no HeroBook3D

## Files

- `src/features/info/components/StoryBook/StoryBook.tsx`
- `src/index.css` (`.story-book-*` only)
- `public/about/story-cover.svg`
- `src/test/StoryBook.test.tsx`
- `wiki/conventions/about-story-book.md`

## Verify

`npm run check`

## Next

Impl **92**

---
title: About Our Story open-book shell
date: 2026-08-17
impl: 89
type: note
tags: [about, storybook, css3d, a11y, softgate]
---

# About Our Story open-book shell (Impl 89)

Plan drafted as Impl 88; 88 was taken by Home/Detail hover straighten. This work is **Impl 89**.

Impl 87 shipped a paginated white card (grid + footer Previous/Next). This Impl replaces that shell with an always-open hardcover volume.

## What shipped

- `StoryBook` markup: stage / desk shadow / volume / board / spine / verso+recto leaves
- Edge turn buttons overlay the volume (not nested in verso) so mobile prev survives. No `.story-book-pager`. Keyboard arrows unchanged. No wrap
- CSS 3D rest pose `rotateX(6deg)` + leaf `rotateY(±8deg)`. Feathered gutter both sides. Fore-edge grain. Cream paper
- Framer removed from the book. Ink fade is CSS; reduced-motion freezes animation only, not the pose
- Chapter 1 verso: inset `story-cover.svg`. Folio once on recto

## Tests

- `StoryBook.test.tsx` — volume + spine present, pager absent, edge controls, arrows
- `AboutPage.test.tsx` — open volume, no HeroBook3D, no page-root `overflow-hidden`

## Files

- `src/features/info/components/StoryBook/StoryBook.tsx`
- `src/index.css` (`.story-book-*` only)
- `src/test/StoryBook.test.tsx`, `src/test/AboutPage.test.tsx`
- `wiki/conventions/about-story-book.md`

## Verify

`npm run check`

## Next

Impl **90**

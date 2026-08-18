---
title: About Our Story uses Home HeroBook3D
date: 2026-08-17
impl: 85
type: note
tags: [about, herobook3d, cover, a11y, softgate]
---

# About Our Story uses Home HeroBook3D (Impl 85)

Plan drafted as Impl 84; 84 was taken by Home book-enter force. This work is **Impl 85**.

## Why

Our Story sat beside a flat `story-book.svg` that drew its own spine, fore-edge, and shadow. Home featured books use `HeroBook3D`. Matching the hardcover meant replacing the illustration shell, not dropping a webtoon cover or nesting the old SVG inside 3D.

## What shipped

- `HeroBook3D` discriminated props: `href` + `ctaLabel` required together (Home/Detail Links unchanged); omit both for a decorative scene (`aria-hidden`, no `data-testid`)
- New wordless 3:4 cover `public/about/story-cover.svg` (brand teal field + inner abstract shapes). Deleted `public/about/story-book.svg`
- About Our Story: Home width ladder `w-56 sm:w-64 lg:w-72 xl:w-80`, plain wrapper, no `hero-book-enter`, no Framer on the book
- About page root no longer `overflow-hidden`; masthead wash clipped in its own layer

## Tests

- `BookCard.test.tsx` — decorative hardcover has no link, keeps pages/back, no `hero-book-enter`
- `AboutPage.test.tsx` — story section scene + `story-cover.svg`, no book link, root not `overflow-hidden`, no `story-book.svg`

## Files

- `src/components/HeroBook3D/HeroBook3D.tsx`
- `src/features/info/AboutPage.tsx`
- `public/about/story-cover.svg` (new)
- `public/about/story-book.svg` (deleted)
- `src/test/BookCard.test.tsx`, `src/test/AboutPage.test.tsx`

## Verify

`npm run check`

## Next

Impl **86**

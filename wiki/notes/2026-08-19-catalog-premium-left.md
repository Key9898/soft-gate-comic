---
title: Catalog Premium chip to top-left
type: note
date: 2026-08-19
tags: [catalog, bookcard, premium, softgate]
impl: 152
---

# Impl 152 — Catalog Premium chip to top-left

`CatalogBookCard` moves the series Premium label off the top-right stack (rating + age) into a top-left column with New. Gap is `gap-1`, same as the right stack. Premium-only occupies New’s slot. Neither New nor Premium → no left column. Chip stays a `span` (not a button). Hover and card click unchanged. Library, HeroBook3D, and Reader are untouched.

## Verify

`npx vitest run src/test/BookCard.test.tsx src/test/SeriesRating.test.tsx`

## Next

Impl **153**.

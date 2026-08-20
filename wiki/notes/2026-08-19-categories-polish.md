---
title: Categories polish search SEO empty recovery
type: note
date: 2026-08-19
tags: [categories, search, discovery, softgate]
impl: 132
---

# Impl 132 — Categories polish

The header field submits to `/search?q=` instead of filtering the grid in place. SEO uses `categories.seoDescription` and a path-only canonical (`/categories` or `/categories/:slug`). Genre paths without `?sort=` use the genre name as `h1`. The count line adds genre and status context. Empty grids get 404-class recovery plus Clear filters.

## Verify

`npx vitest run src/test/CategoriesBrowse.test.tsx src/test/CategoriesRanking.test.tsx`

## Next

Impl **133** (Reader chrome).

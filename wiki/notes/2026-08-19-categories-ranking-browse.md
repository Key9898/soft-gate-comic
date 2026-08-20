---
title: Categories browse IA and `/ranking` path
type: note
date: 2026-08-19
tags: [categories, ranking, a11y, seo, pagination, softgate]
impl: 141
---

# Impl 141 — Categories browse + `/ranking`

Closes Home/nav Categories, Popular, and New gaps: genre path `h1`, nav highlight on `/categories/:slug`, Browse vs numbered Popular, honesty decks, first-class `/ranking`, chip/sort a11y, unknown-genre 404, pagination logic hidden until more than 24 titles.

## Locks

- Home genre chips: `all` → `/categories`, others → `/categories/{slug}`. `?genre=` canonicalizes onto the path.
- `/ranking` is all-genre Popular (ranks, `ItemList` JSON-LD). Genre Popular stays `/categories/:slug?sort=popular`.
- `/categories` with no `sort` is Browse: `viewCount` order, no ranks, dropdown **Browse**.
- Pager: `PAGE_SIZE` 24, Popular cap 100. Mock 9 titles show no pager. Junk `?page=` is stripped when the list fits one page.
- Unknown `/categories/:slug` → `NotFoundPage` `variant="genre"` (HTTP 200 + React 404, same as series id miss). Valid genre with zero rows keeps empty recovery.

## Verify

`npx vitest run src/test/browseUrls.test.ts src/test/catalogPagination.test.ts src/test/CategoriesRanking.test.tsx src/test/CategoriesBrowse.test.tsx src/test/NavChrome.test.tsx`

## Next

Impl **142**.

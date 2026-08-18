---
title: Catalog discovery tiles
type: convention
date: 2026-08-17
tags: [catalog, bookcard, discovery, softgate]
impl: 96
impl_updated: 98
---

# Catalog discovery tiles

Admin-facing catalog chrome is the same on every discovery surface so title, description, genre, views, and public release date cannot drift per page.

## Fields

- Title — catalog `title[lang]`, overflow Hero-like: `line-clamp-2 lg:line-clamp-1 break-words`. No `truncate`. No `title=` tooltip.
- Description — catalog `description[lang]`, `line-clamp-2 min-h-2lh break-words`
- Category — first genre via `resolveGenreLabel`
- Views — `formatCount(viewCount)`
- Date — public release `createdAt` via `formatCatalogDate` (`15 Jan 2026` in both locales)

## New badge

Newest **6** published series (`createdAt` desc, `status !== 'draft'`) via `newestPublishedIds`. Badge is `bg-primary-600` (`t('webtoon.new')`) on **every** catalog tile those ids appear on (Home Trending/New, Categories, Search, Continue, Related). Library is not a catalog tile.

Home New rail and `/categories?sort=new` sort by `createdAt`. Hero stays top **5** by `viewCount`. Home Trending/New rails stay **6**.

Mock calendar is **2026 only**. Episode `createdAt` sits inside the parent series `createdAt`…`updatedAt` window. No published mock date after the current work day when last set (2026-08-17). Schema **7**. Stored `softgate-shared-data` catalogs are re-seeded on load (`applyCatalogSeed`) so a matching schema cannot keep 2023/2024 tile dates.

## Code

- [`src/components/BookCard/CatalogBookCard.tsx`](../../src/components/BookCard/CatalogBookCard.tsx)
- [`src/lib/catalog/`](../../src/lib/catalog/)
- Covers stay as shipped art; catalog titles follow cover lettering. See [discovery-honesty.md](discovery-honesty.md).

## Out of scope

Library grid/list (episode + last-read). Hero Spotlight copy (already Impl 82). Cover PNG files.

---
title: Catalog discovery tiles
type: convention
date: 2026-08-17
tags: [catalog, bookcard, discovery, softgate]
impl: 96
impl_updated: 177
---

# Catalog discovery tiles

Admin-facing catalog chrome is the same on every discovery surface so title, description, genre, views, and public release date cannot drift per page.

## Fields

- Title — catalog `title[lang]`, overflow Hero-like: `line-clamp-2 lg:line-clamp-1 break-words`. No `truncate`. No `title=` tooltip.
- Description — catalog `description[lang]`, `line-clamp-2 min-h-2lh break-words`
- Category — first genre via `resolveGenreLabel`
- Views — `formatCount(viewCount)`
- Date — public release `createdAt` via `formatCatalogDate` (`15 Jan 2026` in both locales), except Home Updated and Categories `?sort=recentlyUpdated`, which print `updatedAt`
- Community rating — dark chip, cover top-right: gold star + `formatRating(webtoon.rating)` (`4.8`). Not interactive. Not on HeroBook3D. Not in tile meta.
- Content rating — `ContentRatingBadge` under that chip (`All` / `13+` / `16+` / `18+`). 18+ is rose. Not a read gate on the tile.
- Premium — top-left column when `isPremium` (every catalog tile, not Categories-only). Under New when both apply (`gap-1`, same as the right stack). Occupies New’s slot when New is absent. Not a button.

Cover corners: **New (+ Premium under it)** top-left; **rating + age** top-right. Ranked Popular tiles keep a **full** 3:4 hardcover. `RankMark` is a child of `.book-media` at bottom-left: two copies of the same digit — a **white lip** (`scale-[1.2]`, `origin-center`) behind **white fill + primary-600 stroke** (`#0e9494`). `text-2xl sm:text-3xl`. Not a box, not a clipped pocket, not a wash, not a `text-shadow` kick. Home Popular and `/ranking` (or `/categories/:slug?sort=popular`) share the same mark. Title is not indented. Categories Completed/Hiatus stay bottom-left on unranked browse; when ranks show they move to **bottom-right**.

## New badge

Newest **6** published series (`createdAt` desc, `status !== 'draft'`) via `newestPublishedIds`. Badge is `bg-primary-600` (`t('webtoon.new')`) on **every** catalog tile those ids appear on (Home Ranking/Trending/Updated/New, Categories, Search, Continue, Related). Daily drop cards are not catalog tiles and do not show New. Library is not a catalog tile.

Home rails (Impl 104 + 106) use different sort keys and may overlap:

- Ranking / Popular — `viewCount` top 6 as a Home **ordered 6-up grid** (`HomeRankingChart` `<ol>`, same breakpoints as Trending). Rank is a **white digit + primary stroke** with a **glyph-shaped white lip** (`scale-[1.2]`) on the cover bottom-left (full art, no pocket). No fake ▲/▼ week deltas. View all `/ranking` continues ranks 1–N (cap 100, page size 24) as an `<ol>` catalog grid (same RankMark, **no** podium). `/categories` without `sort` is unranked Browse (`<div>` grid). Genre charts use `/categories/:slug?sort=popular` (`<ol>`).
- Trending — `weeklyViewCount` top 6 (not lifetime views). This-week description + heat icon. No View all. No rank numbers.
- Daily — unpublished `scheduledAt` drops (`src/lib/catalog/dailyDrops.ts`). Yangon weekday. Custom `DailyDropCard` (not `CatalogBookCard`, not a link). Countdown on the cover bottom lip. Ep + Yangon time under the cover. No View all. Not a restyle of Updated.
- Updated — `updatedAt` top 6 **excluding** New-rail ids. `Clock` icon + honesty desc. Tile date is `updatedAt`. View all `/categories?sort=recentlyUpdated` (full list, no id strip).
- New — `createdAt` top 6. `Sparkles` icon + honesty desc. Tile date is `createdAt`. View all `/categories?sort=new`

Hero is Spotlight flags, not `viewCount` top 5. Do not strip Hero ids from rails.

Mock calendar is **2026 only**. Episode `createdAt` sits inside the parent series `createdAt`…`updatedAt` window. No published mock date after the current work day when last set (2026-08-19). Schema **14**. Love in Seoul MM is literary `ဆိုးလ်မြို့က ချစ်ခြင်းတရား` (Impl 177); other cover-brand MMs stay Latin. Demo omits `uploadDay` (optional CMS field; Daily uses `scheduledAt`). Home Updated leftover titles are the older series with the latest `updatedAt`. Stored `softgate-shared-data` catalogs are **kept** on load (Impl 167). Refresh Demo browsers by bumping `SHARED_DATA_SCHEMA_VERSION` or clearing the key — do not wipe Admin catalog on every visit.

## Code

- [`src/components/BookCard/CatalogBookCard.tsx`](../../src/components/BookCard/CatalogBookCard.tsx)
- [`src/components/ContentRatingBadge.tsx`](../../src/components/ContentRatingBadge.tsx)
- [`src/components/SeriesRating/`](../../src/components/SeriesRating/)
- [`src/components/RankMark.tsx`](../../src/components/RankMark.tsx)
- [`src/features/home/components/HomeRankingChart.tsx`](../../src/features/home/components/HomeRankingChart.tsx)
- [`src/features/home/components/HomeDailyBoard.tsx`](../../src/features/home/components/HomeDailyBoard.tsx)
- [`src/features/home/components/DailyDropCard.tsx`](../../src/features/home/components/DailyDropCard.tsx)
- [`src/lib/catalog/`](../../src/lib/catalog/)
- Covers stay as shipped art; catalog titles follow cover lettering. See [discovery-honesty.md](discovery-honesty.md).

## Out of scope

Library grid/list (episode + last-read). Hero Spotlight copy (already Impl 82). Cover PNG files.

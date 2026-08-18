---
title: Catalog tile honesty
type: note
date: 2026-08-17
tags: [catalog, bookcard, mock, discovery, softgate]
impl: 96
---

# Impl 96 — Catalog tile honesty

## Why

Home Trending/New cards showed Title/Category/Views (and relative ages on New) while Hero used title+description. Cover lettering disagreed with catalog titles. New Releases sorted by `updatedAt`, dated `createdAt` as “3 years ago”, and painted every rail card with an accent New badge.

## What shipped

- Catalog EN titles follow cover lettering (covers untouched). MM keeps Latin for cover-brand names; literary MM stays where it already matches (`သွေးနက်လ`, `ရွှေခေတ်`, `တက္ကသိုလ်ဘဝ`). Descriptions/tags follow the cover setting (Seoul not Yangon; Ocean Dreams / Forest Spirit).
- Series `createdAt`/`updatedAt` all calendar **2026**, months staggered. High-view titles earlier; newest six by `createdAt` are the New set.
- `SHARED_DATA_SCHEMA_VERSION` **5**
- Shared `CatalogBookCard` + `src/lib/catalog` (`newestPublishedIds`, `formatCatalogDate`)
- Discovery surfaces: Home Continue/Trending/New, Categories, Search webtoons, Related
- New badge `primary-600` on those six ids everywhere they appear
- Title/description overflow matches Hero

## Title map

- The Last Cloud → The Last Horizon
- Love in Yangon → Love in Seoul
- Dark Hero → Shadow Knight
- Golden Era → Golden Age
- Cyber Dream → Cyber Dreams
- Dreams of the Sea → Ocean Dreams
- Mountain Spirit → Forest Spirit
- Blood Moon / Campus Life unchanged

## Verify

`npm run check`

## Next

Impl **98**

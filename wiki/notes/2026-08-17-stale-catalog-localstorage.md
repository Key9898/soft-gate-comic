---
title: Stale catalog localStorage froze 2023 dates
type: note
date: 2026-08-17
tags: [catalog, localStorage, dates, honesty, softgate]
impl: 98
---

# Impl 98 — Stale catalog localStorage

## Why

Impl 96 put series `createdAt` in 2026 in `@softgate/shared`. Impl 97 moved episode/user 2024 dates. The Home / Categories tiles still showed **10 Jun 2023** / **15 Jan 2024** because `DataContext` hydrates from `softgate-shared-data`. A matching schema version reused the old snapshot. Tests mock `localStorage.getItem` as `null`, so they never caught it.

## What shipped

- `applyCatalogSeed` — non-empty stored catalogs take current `mockWebtoons` / `mockEpisodes` / authors / genres
- `SHARED_DATA_SCHEMA_VERSION` **7**
- Detail page stats + episode rows show `formatCatalogDate`

## Verify

`npm run check`

Hard-refresh the portal (or clear `softgate-shared-data`) once. Tiles should read `8 Jan 2026`, `12 Mar 2026`, not 2023/2024.

## Next

Impl **99**

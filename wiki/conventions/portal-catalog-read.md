---
title: Portal catalog HTTP read
type: convention
date: 2026-08-24
updated: 2026-09-09
tags: [catalog, api, http, softgate]
impl: 195
---

# Portal catalog HTTP read

## Mock on (`VITE_USE_MOCK_API` is not `false`)

Portal `DataContext` reads and writes the schema-14 catalog envelope through `localStorage` (`loadFromLocalStorage` / `saveToLocalStorage`). Unset `VITE_USE_MOCK_API` (including Vitest and Vercel without the var) stays mock. Committed `.env.example` is `false`; Vite does not load it. Local `pnpm dev` HTTP uses gitignored `.env.development.local` plus `pnpm dev:api`.

## Mock off

Catalog **read** is `GET /api/catalog` → `{ data: PublishedCatalog }`. Unwrap with `unwrapApiData`. Do **not** `GET` or `PUT` whole `SharedData` at `/api/data`.

`PublishedCatalog` is authors, genres, webtoons, episodes, optional `coinPackages`. Field names unchanged (`spotlight`, `freeAt`, `imageSizes?`, …). Draft webtoons/episodes are omitted; `scheduled` episodes stay for Daily. HTTP catalog `fetch` uses `credentials: 'include'` (not `authFetch`). Locked premium episodes have `images: []` and keep `imageSizes` ([portal-wallet-http.md](portal-wallet-http.md)). Mock catalog still ships premium panel URLs.

When mock is off, `GET /api/catalog` source depends on persist: stub still uses `@softgate/shared` seed; Prisma maps Admin catalog tables (Impl 195). Omit `coinPackages` when Admin has no table (`undefined`, not `[]` — empty array would empty `/coins`). Unlock uses Admin ids, not seed `'1'` / `'2'`.

`applyCatalogSeed` is identity. Do not reintroduce a seed wipe.

Settings consume is Impl 173 (see [portal-settings-read.md](portal-settings-read.md)). Auth is 174 ([portal-auth-http.md](portal-auth-http.md)). Wallet / unlock / wait-for-free HTTP authority is 175 ([portal-wallet-http.md](portal-wallet-http.md)).
---

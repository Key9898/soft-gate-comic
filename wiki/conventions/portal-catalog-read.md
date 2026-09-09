---
title: Portal catalog HTTP read
type: convention
date: 2026-08-24
updated: 2026-09-10
tags: [catalog, api, http, softgate]
impl: 195
impl_updated: 202
---

# Portal catalog HTTP read

## Mock on (`VITE_USE_MOCK_API` is not `false`)

Portal `DataContext` reads and writes the schema-14 catalog envelope through `localStorage` (`loadFromLocalStorage` / `saveToLocalStorage`). Unset `VITE_USE_MOCK_API` (including Vitest and Vercel without the var) stays mock. Committed `.env.example` is `false`; Vite does not load it. Local `pnpm dev` HTTP uses gitignored `.env.development.local` plus `pnpm dev:api`.

## Mock off

Catalog **read** is `GET /api/catalog` → `{ data: PublishedCatalog }`. Unwrap with `unwrapApiData`. Do **not** `GET` or `PUT` whole `SharedData` at `/api/data`.

`PublishedCatalog` is authors, genres, webtoons, episodes, optional `coinPackages`. Field names unchanged (`spotlight`, `freeAt`, `imageSizes?`, …). Draft webtoons/episodes are omitted; `scheduled` episodes stay for Daily. HTTP catalog `fetch` uses `credentials: 'include'` (not `authFetch`). Locked premium episodes have `images: []` and keep `imageSizes` ([portal-wallet-http.md](portal-wallet-http.md)). Mock catalog still ships premium panel URLs.

When mock is off, `GET /api/catalog` source depends on persist: stub still uses `@softgate/shared` seed; Prisma maps Admin catalog tables (Impl 195) and Admin `CoinPackage` (Impl 201). Omit `coinPackages` when the packs table is missing (`undefined`, not `[]` — empty array would empty `/coins`). Empty table is `[]` (staff wipe). Unlock uses Admin ids, not seed `'1'` / `'2'`. Empty published `webtoons` is a successful empty catalog: portal discovery keeps live chrome (Impl 196, [loading-states.md](loading-states.md)). A **failed** catalog request is not that empty: live chrome + fail copy (Impl 198). Do not fall back to seed. Local HTTP: gitignored `VITE_USE_MOCK_API=false` plus `VITE_API_BASE_URL` when SoftGate API is not on `:3000` (do not steal Admin’s port). Impl **202** live join: SoftGate `GET /health` is `{ data.persist }`; Admin Express is not catalog.

`applyCatalogSeed` is identity. Do not reintroduce a seed wipe.

`applyCatalogSeed` is identity. Do not reintroduce a seed wipe.

Settings consume is Impl 173 (see [portal-settings-read.md](portal-settings-read.md)). Auth is 174 ([portal-auth-http.md](portal-auth-http.md)). Wallet / unlock / wait-for-free HTTP authority is 175 ([portal-wallet-http.md](portal-wallet-http.md)).
---

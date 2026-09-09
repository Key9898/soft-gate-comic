---
title: Impl 201 — Read Admin CoinPackage on catalog + /coins
type: note
date: 2026-09-10
tags: [api, catalog, coins, prisma, admin, softgate]
impl: 201
---

# Impl 201 — Read Admin CoinPackage on catalog + /coins

When persist is Prisma, `GET /api/catalog` includes Admin `CoinPackage` rows so portal `/coins` (`packagesFromBlob`, Impl 168) can consume them. Stub persist and mock-on unchanged. No website coin-package write. No coin-table migration.

## What shipped

- Prisma schema **appends** Admin `CoinPackage` (verbatim). No file under `apps/api/prisma/migrations/`.
- [`apps/api/src/catalog/fromAdmin.ts`](../../apps/api/src/catalog/fromAdmin.ts) — optional `coinPackages` on `publishedCatalogFromAdmin`; `coinPackagesFromAdminRows` (skip invalid; omit `bonus` 0; flags only if true); `P2021` helper.
- Prisma persist loads packs in an isolated try/catch (`orderBy createdAt asc`). Missing table → omit field. Empty table → `[]`. Other errors rethrow (catalog load-fail stays Impl 198).
- `/coins` UI and `deriveMetalGlow` unchanged.

## Honesty

- Missing `CoinPackage` table is **not** catalog load-fail and is **not** `[]` (that would empty the shop). Omit the field so 168 falls back to `coinData.ts`.
- `[]` means staff wiped the shop. Do not refill from `coinData.ts`.
- No `metalClass` / `glowClass` on the catalog payload.

## Out

- Admin git merge, website `CREATE` / migrate of Admin coin tables
- Hono coin-package PATCH
- Vercel `VITE_USE_MOCK_API=false`

Convention: [portal-catalog-read.md](../conventions/portal-catalog-read.md), [named-integrations.md](../conventions/named-integrations.md). API: [softgate-api.md](../references/softgate-api.md). Consume contract: [admin-coin-packages.md](../references/admin-coin-packages.md).

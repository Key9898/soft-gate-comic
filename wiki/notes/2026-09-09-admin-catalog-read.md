---
title: Impl 195 — Admin published catalog on GET /api/catalog
type: note
date: 2026-09-09
tags: [api, catalog, prisma, admin, softgate]
impl: 195
---

# Impl 195 — Admin published catalog on GET /api/catalog

When persist is Prisma, `GET /api/catalog` reads Admin tables `Author` / `Genre` / `Webtoon` / `WebtoonGenre` / `Episode` on the shared Postgres, maps to portal `PublishedCatalog`, then the existing paywall strip. Stub persist and mock-on stay `@softgate/shared` seed. No Admin git merge. No portal catalog migration. No Vercel mock-off.

## What shipped

- Portal Prisma schema **appends** Admin catalog enums/models (verbatim). No new file under `apps/api/prisma/migrations/`.
- [`apps/api/src/catalog/fromAdmin.ts`](../../apps/api/src/catalog/fromAdmin.ts) — `asBilingual` / `asImageSizes`, skip invalid `contentRating`, public non-draft `episodeCount`, omit `coinPackages` (unset, not `[]`).
- `PersistPort.getUnstrippedPublishedCatalog` is `Promise<PublishedCatalog>` (stub `async`; Prisma queries Admin tables). Unlock uses the same unstripped catalog.
- Mapper unit tests; stub catalog HTTP tests unchanged.

## Honesty

- Empty published rows are empty `webtoons` / `episodes` / `authors` (genres may still be present). Missing catalog tables are not an empty catalog — do not fall back to seed.
- This repo does not CREATE Admin catalog tables. Do not `migrate dev` / `db push` to “fix” schema-vs-migration drift.
- Unlock ids are Admin ids when mock is off, not seed `'1'` / `'2'`.
- Settings CMS still stub.

## Out

- Admin git merge
- Portal catalog `CREATE TABLE` migration
- `coinPackages` / settings tables
- Vercel `VITE_USE_MOCK_API=false`
- Prod keys, `R2_ENDPOINT`, rename `softgate-webtoon-dev`, `BREVO_FROM_NAME`

Convention: [named-integrations.md](../conventions/named-integrations.md), [portal-catalog-read.md](../conventions/portal-catalog-read.md). API: [softgate-api.md](../references/softgate-api.md).

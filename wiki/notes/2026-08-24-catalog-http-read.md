---
title: Impl 172 — Portal catalog HTTP read
type: note
date: 2026-08-24
tags: [catalog, api, http, softgate]
impl: 172
---

# Impl 172 — Portal catalog HTTP read

Portal catalog **read** over HTTP for the published catalog. Mock default still uses localStorage. Admin CMS writes stay in the Admin repo. Persist is still stub.

## What shipped

- `publishedCatalogFrom` in `@softgate/shared`; DOM storage helpers in `storage.ts`
- API `GET /api/catalog` → `{ data: PublishedCatalog }` from `publishedCatalogFrom(getSharedData())`
- `GET`/`PUT /api/data` stay 404
- `DataContext` consumes `/api/catalog` when `VITE_USE_MOCK_API=false`; no whole-blob PUT
- `applyCatalogSeed` remains identity

## Out

- Settings HTTP (173), auth/session (174), unlock / wait-for-free / paywall strip (175)
- Prisma / R2 / Brevo

---

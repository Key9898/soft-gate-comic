---
title: Impl 198 — Catalog load-fail vs success-empty
type: note
date: 2026-09-09
tags: [portal, catalog, empty-state, load-fail, home, search, categories, softgate]
impl: 198
---

# Impl 198 — Catalog load-fail vs success-empty

Two jobs: local HTTP must hit SoftGate `apps/api`, and portal copy must not treat a failed catalog request as “library not published yet.”

## Ops

Portal mock-off (`VITE_USE_MOCK_API=false` in gitignored `.env.development.local`) fetches `VITE_API_BASE_URL` or `http://localhost:3000`. SoftGate Hono returns `GET /health` persist payload, `GET /api/catalog` **200**, `GET /api/settings` **200** (never 401), `GET /api/auth/me` without cookie **401** not 404. If another app owns **3000**, do **not** steal the port. Start SoftGate API on a free `PORT` (gitignored `apps/api/.env`) and point portal `VITE_API_BASE_URL` at that origin. Retry already refetches; after ops it changes the page.

## Copy / UX

- `error` + `webtoons.length === 0` → load-fail chrome. Banner is the story (`errors.catalogLoad`). In-page decks use `errors.catalogUnavailable` and point at Retry. No Help/Creators.
- `!error` + `webtoons.length === 0` → Impl 196 unpublished copy (`home.emptyDesc` / `categories.catalogEmpty` / `search.catalogEmpty`) + Help/Creators on Hero, Categories catalog-empty, Search catalog-empty.
- `error` + titles still in memory → keep cards + banner only. Catch does not wipe `db`.

`CatalogEmptyPanel unavailable` forces `title={null}`, fail deck, no actions. Hero empty slides still paint `/banner/banner.png` + `home.pageHeading`; fail omits Help/Creators. Search splits `loadFailed` vs `catalogEmpty` (landing Go-here stays success-with-titles only). Rails / Daily / genres pass `unavailable={Boolean(error)}`. Retry stays only on `CatalogStatus`.

## Out

- Mock flag invert / Vercel `VITE_USE_MOCK_API=false` / portal `.env` / `.env.local`
- Seed fallback, fake covers, skeleton-as-empty, Retry on every rail
- Admin merge, Prisma catalog CREATE, comments Impl 197, Library tab empty, hub/Reader/Author 404

Convention: [loading-states.md](../conventions/loading-states.md), [discovery-honesty.md](../conventions/discovery-honesty.md), [hero-spotlight.md](../conventions/hero-spotlight.md), [portal-catalog-read.md](../conventions/portal-catalog-read.md).

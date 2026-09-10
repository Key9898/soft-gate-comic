---
title: Live join — SoftGate API must listen (catalog fail is not a mapper bug)
type: note
date: 2026-09-10
tags: [api, catalog, live-join, ops, softgate]
---

# Live join — SoftGate API must listen

Portal HTTP mode (`VITE_USE_MOCK_API=false`) with `VITE_API_BASE_URL` at SoftGate Hono. Banner **"The catalog request failed."** plus browser `net::ERR_CONNECTION_REFUSED` on that origin means **nothing is accepting TCP** on the SoftGate port. It is not empty catalog (Impl 196), not Prisma mapper failure, not CORS, not Admin Express.

## Ground truth

1. `GET ${VITE_API_BASE_URL}/health` must return `{ data: { ok, persist } }`.
2. A Cursor/terminal row that still says `pnpm dev:api` is **running** is not proof of listen. Probe health.
3. `127.0.0.1` vs `localhost` can disagree on Windows (Vite often binds `[::1]` only). Use the same host the portal uses (`localhost` when `VITE_API_BASE_URL` does).

## Do

- Keep mock **off** for live join.
- Keep portal pointed at SoftGate `PORT` (this machine **3001** in gitignored env). Do not steal Admin `:3000`.
- Restart `pnpm dev:api` until boot log `SoftGate API :<port> persist=<kind>` **and** health 200.
- After listen, catalog **200** with `webtoons: []` is success-empty chrome, not the fail banner.

## Do not

- Flip `VITE_USE_MOCK_API` back on to hide the banner.
- Point `VITE_API_BASE_URL` at Admin Express.
- Patch `CatalogStatus` / `DataContext` because refused — Retry is `loadCatalog` on the same origin by design (Impl 198).

Convention: [portal-catalog-read.md](../conventions/portal-catalog-read.md), [named-integrations.md](../conventions/named-integrations.md), [loading-states.md](../conventions/loading-states.md). API: [softgate-api.md](../references/softgate-api.md). Live join smoke: [2026-09-10-live-join-smoke.md](2026-09-10-live-join-smoke.md).

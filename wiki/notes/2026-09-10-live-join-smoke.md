---
title: Impl 202 — Live join smoke (catalog + settings + coins + reader)
type: note
date: 2026-09-10
tags: [api, catalog, settings, coins, reader, prisma, admin, softgate]
impl: 202
---

# Impl 202 — Live join smoke (catalog + settings + coins + reader)

Prove local HTTP join. 200/201 mappers unchanged. Admin Express keeps `:3000`. SoftGate Hono uses gitignored `PORT`. Portal mock-off + `VITE_API_BASE_URL` point at SoftGate. Same Postgres. No Admin table migrate.

## What shipped

- Gitignored `apps/api/.env` `PORT` (this machine **3001**) + `CLIENT_URL` portal origin. Portal `.env.development.local` `VITE_USE_MOCK_API=false` and `VITE_API_BASE_URL` at that origin.
- Committed `.env.example` comments only (numeric defaults stay 3000).
- [`apps/api/src/index.ts`](../../apps/api/src/index.ts) logs `SoftGate API :<port> persist=<kind>` after boot.

## Observed (this machine)

Identity: SoftGate `GET /health` `{ data: { ok: true, persist: "prisma" } }`. Admin `:3000` is not SoftGate catalog.

| Surface             | Result                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------ |
| Catalog             | 1 non-draft series, 1 published episode, 0 drafts                                          |
| Images              | cover + episode panel URLs use R2 `admin/` prefix                                          |
| `coinPackages`      | `[]` (empty shop, not omitted, not `coinData.ts` fallback)                                 |
| Settings `{ data }` | four fields present; values match seed shape (Admin 51 row vs fail-open not distinguished) |
| Home                | Impl 50 series chrome                                                                      |
| `/read/:id/1`       | Episode 1 reader chrome; one panel                                                         |
| `/coins`            | `ProtectedRoute` → login (shop would be empty from `[]`)                                   |

No live URLs or pack JSON in this note.

## Out

- 200/201 rewrite, Admin SPA / staff / PATCH, Vercel mock-off
- Comments desk / ReaderUser (52/53)
- Website `migrate` of Admin tables

Convention: [portal-catalog-read.md](../conventions/portal-catalog-read.md), [portal-settings-read.md](../conventions/portal-settings-read.md), [named-integrations.md](../conventions/named-integrations.md). API: [softgate-api.md](../references/softgate-api.md).

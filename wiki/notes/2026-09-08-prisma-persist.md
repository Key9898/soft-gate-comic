---
title: Impl 185 — Prisma persist for reader tables
type: note
date: 2026-09-08
tags: [api, prisma, persist, docker, softgate]
impl: 185
---

# Impl 185 — Prisma persist for reader tables

`apps/api` reader persist (users, refresh JTIs, wallet, unlocks) uses Prisma when `DATABASE_URL` is set and Postgres answers. Empty URL keeps the in-memory stub. A set URL with a down database fails boot. Catalog/CMS, R2, Brevo, and the portal stay unchanged.

## What shipped

- `apps/api/docker-compose.yml` — local Postgres 16 (`softgate` / `softgate` / `softgate` on 5432)
- Committed `prisma/migrations/20260908141700_reader_persist` + `migration_lock.toml`
- `PersistPort` explicit interface; stub + Prisma adapters; `openPersist` at boot
- `GET /health` `data.persist` is `"stub"` | `"prisma"` (live `healthPayload()`)
- `@prisma/client` + `prisma generate` in api `build`; api `test:run` depends on `build`
- `createApp` does not switch adapters (tests with a dummy URL stay stub)

## Honesty

- Catalog and settings still come from `@softgate/shared` mocks
- Admin shared-DB table names are unknown; this SQL is this repo’s reader tables
- Portal `VITE_USE_MOCK_API` default is still mock

## Out

- Catalog CMS / `coinPackages` Prisma tables
- R2 SDK, Brevo, forgot/reset, profile HTTP
- `migrate` / `db push` inside `pnpm check`
- Railway / Vercel prod wiring

Convention: [named-integrations.md](../conventions/named-integrations.md). ADR: [008-prisma-persist-boot.md](../decisions/008-prisma-persist-boot.md).

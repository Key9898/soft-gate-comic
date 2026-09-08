---
title: Prisma persist boot rule
type: decision
date: 2026-09-08
tags: [api, prisma, postgres, persist, softgate]
impl: 185
---

# Prisma persist boot rule

## Status

Accepted

## Context

Impl 176 named `DATABASE_URL` and a Prisma schema but kept runtime persist as an in-memory stub even when the URL was set. Impl 185 wires reader users, refresh JTIs, and wallet rows. A set URL with a down database could silently fall back to stub and look healthy. Leader’s stack is one shared Postgres; a lying health payload would hide that.

## Decision

- Empty / unset `DATABASE_URL` → stub persist. `GET /health` `{ persist: "stub" }`.
- Non-empty URL + successful Prisma `$connect` → Prisma persist. Health `{ persist: "prisma" }` (not `"postgres"`).
- Non-empty URL + connect failure → throw, `process.exit(1)`. Do not serve stub.
- Adapter choice lives in `openPersist` at process boot (`apps/api/src/index.ts`). `createApp` does not switch. Vitest and `pnpm check` stay on the default stub and do not need Docker.
- `prisma generate` (dummy URL) is allowed in api `build`. `migrate` / `db push` stay out of `pnpm check`.

## Consequences

- Local `.env` with `DATABASE_URL` will refuse to listen until Postgres is up.
- Catalog, settings, R2, and Brevo are unchanged in 185.
- Admin schema on a shared Railway database is unknown; this repo’s migration is reader tables only.

## Alternatives considered

- Silent stub when the URL is set but Postgres is down — rejected; health would lie.
- Health value `"postgres"` — rejected; the adapter is Prisma.
- Switching inside `createApp` from `env.DATABASE_URL` — rejected; unit tests pass unused URLs and must not boot Prisma.

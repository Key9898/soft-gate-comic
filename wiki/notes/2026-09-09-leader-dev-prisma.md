---
title: Impl 194 — Leader-dev Prisma persist + local mock-off
type: note
date: 2026-09-09
tags: [api, prisma, env, postgres, softgate]
impl: 194
---

# Impl 194 — Leader-dev Prisma persist + local mock-off

Set `DATABASE_URL` in gitignored `apps/api/.env` and run `prisma migrate deploy` once. Public proxy uses `sslmode=require`. `GET /health` reports `"prisma"` when Postgres answers. Live connection strings stay off git and wiki.

Portal mock-off for local `pnpm dev` is gitignored `apps/portal/.env.development.local` with `VITE_USE_MOCK_API=false`. Unset that line to use mock again. Do not put `false` in `.env` / `.env.local` (Vitest). Do not set `false` on Vercel.

## Out

- Catalog/CMS (shipped Impl 195 — [2026-09-09-admin-catalog-read.md](2026-09-09-admin-catalog-read.md))
- Migrate on every `pnpm check` / `pnpm dev`
- `prisma db push`
- Vercel Production = `development`
- Committed secrets

Convention: [named-integrations.md](../conventions/named-integrations.md). Auth HTTP: [portal-auth-http.md](../conventions/portal-auth-http.md).

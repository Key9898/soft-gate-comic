---
title: Impl 205 — Public GET /api/about
type: note
date: 2026-09-10
tags: [api, about, prisma, admin, softgate]
impl: 205
---

# Impl 205 — Public GET /api/about

Website Hono public read of Admin About CMS on shared Postgres. Portal `/about` stays hardcoded until 206–207. No website migrate. No Admin repo change.

## What shipped

- Prisma schema **appends** Admin `AboutHistory` / `AboutTeamMember` / `AboutTeamMeta` (verbatim). No file under `apps/api/prisma/migrations/`.
- [`apps/api/src/about/fromAdmin.ts`](../../apps/api/src/about/fromAdmin.ts) — `STUB_ABOUT`, published mappers, `ABOUT_TEAM_META_ID = about-team`, `P2021` helper. Reuses `asBilingual`.
- `PersistPort.getAbout()`. Stub returns seed copy. Prisma persist: three independent reads (`published: true`). Empty lists stay `[]`. Meta missing/`P2021` fail-opens. GET does not insert.
- `GET /api/about` → `{ data }`. Never 401. No `Set-Cookie`.

## Honesty

- Stub tests return four seed rows. Live Prisma with migrated empty tables returns `[]` lists until staff saves Admin CMS.
- Production path API year is `2026` month `12`. Portal i18n `"Next"` is display-only until 206.
- Missing one about table must not zero the other lists.

## Out

Portal History/Team UI; Hono writes; website CREATE of Admin about tables; Admin staff proxy.

Convention: [portal-about-read.md](../conventions/portal-about-read.md), [named-integrations.md](../conventions/named-integrations.md). API: [softgate-api.md](../references/softgate-api.md).

---
title: Impl 211 — Public GET /api/press + PressPage consume
type: note
date: 2026-09-10
tags: [press, api, prisma, admin, portal, softgate]
impl: 211
---

# Impl 211 — Public GET /api/press + PressPage consume

Website public read of Admin Press CMS on shared Postgres. Chrome/TOC/Copy stay on this repo. Admin writes are Admin Impl 63; this repo does **not** claim Impl 63. No website CREATE migrate.

## What shipped

- Prisma schema **appends** Admin `PressMeta` / `PressNews` / `PressStill` (verbatim). No file under `apps/api/prisma/migrations/`.
- [`apps/api/src/press/fromAdmin.ts`](../../apps/api/src/press/fromAdmin.ts) — `STUB_PRESS` = today’s kit copy with empty news/stills; published mappers; spokesperson from a published About member or omit; `P2021` helper.
- `PersistPort.getPress()`. Stub returns `STUB_PRESS`. Prisma persist: meta + news + stills + About members. Missing table / empty meta with empty lists → `STUB_PRESS`. GET does not insert.
- `GET /api/press` → `{ data }`. Never 401. No `Set-Cookie`.
- Portal [`PressPage.tsx`](../../apps/portal/src/features/info/PressPage.tsx): live (`VITE_USE_MOCK_API=false`) fetch; **on fail or mock, keep `t('press.*')`**. Empty published news → meta empty-news copy. Empty stills → stills note + empty grid (no fake screenshots). Palette/assets/zip from payload. JSON-LD email from payload. Theme tokens unchanged. ZIP files on disk stay (Impl 209).

## Honesty

- Mock portal keeps today’s i18n kit, including Demo stills and founder stand-in.
- Live empty news is not a fabricated release. Live empty stills is not Home/hub/Reader screenshots.
- Spokesperson follows About member publish. Do not duplicate founder name/photo on Press.

## Out

Hono writes; website CREATE of Admin press tables; Admin staff proxy; Media ZIP ingest; site `primary-*` from Press palette; fail-closed blank `/press`.

Convention: [portal-press-read.md](../conventions/portal-press-read.md), [info-page-chrome.md](../conventions/info-page-chrome.md), [named-integrations.md](../conventions/named-integrations.md). API: [softgate-api.md](../references/softgate-api.md).

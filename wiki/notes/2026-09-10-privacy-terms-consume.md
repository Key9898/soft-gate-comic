---
title: Impl 212 — Public GET /api/legal/privacy|terms consume
type: note
date: 2026-09-10
tags: [legal, privacy, terms, api, portal, impl-212]
impl: 212
---

# Impl 212 — Public GET /api/legal/privacy|terms + Privacy/Terms consume

Website public read of Admin Privacy + Terms CMS. Admin writes are Admin Impl 67; this repo does not claim 67.

## Pipe

Admin `/legal` saves on staff `/api/legal/*` → shared Postgres → Hono `GET /api/legal/privacy` and `GET /api/legal/terms` `{ data }` → portal `/privacy` `/terms`. Mock or fail keeps `t('static.*')`.

## API

- Schema copy of `PrivacyMeta` / `PrivacySection` / `TermsMeta` / `TermsSection`. No website migration. No writes.
- Stub persist returns `STUB_PRIVACY` / `STUB_TERMS` (today’s copy).
- Prisma persist reads published sections only and omits `published`. `P2021` → stub. GET does not insert. Never 401.

## Portal

`useLegal` like `usePress`. Live fetch when `VITE_USE_MOCK_API=false`. `LegalPageShell` accepts optional `lastUpdatedDate`; omit keeps `LEGAL_EFFECTIVE_DATE` (Cookies still “September 10, 2026”). `#glance` and `#contact` stay shell-owned. Privacy `#rights` hrefs stay code.

Convention: [portal-legal-read.md](../conventions/portal-legal-read.md), [legal-pages.md](../conventions/legal-pages.md).

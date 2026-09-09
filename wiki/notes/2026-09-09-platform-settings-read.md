---
title: Impl 200 — Read Admin PlatformSettings on GET /api/settings
type: note
date: 2026-09-09
tags: [api, settings, prisma, admin, maintenance, softgate]
impl: 200
---

# Impl 200 — Read Admin PlatformSettings on GET /api/settings

When persist is Prisma, `GET /api/settings` and `POST /api/auth/register` read Admin `PlatformSettings` (`id = platform`) on the shared Postgres. Envelope stays `{ data }`. Stub persist and portal mock-on stay Impl 173 seed / fail-open. No website PATCH. No settings-table migration.

## What shipped

- Prisma schema **appends** Admin `PlatformLanguage` + `PlatformSettings` (verbatim). No file under `apps/api/prisma/migrations/`.
- [`apps/api/src/settings/fromAdmin.ts`](../../apps/api/src/settings/fromAdmin.ts) — `portalSettingsFromAdminRow` via `parsePortalSettings`; null row → `STUB_PORTAL_SETTINGS`; `P2021` → same defaults. GET does not insert.
- `PersistPort.getPortalSettings` / `isRegistrationOpen` are async. `authFlags` overlay unchanged for tests.

## Honesty

- Four fields only: `maintenanceMode`, `allowRegistration`, `contactEmail`, `defaultLanguage`. Portal still does not `i18n.changeLanguage` from `defaultLanguage`.
- Missing settings table is fail-open (unlike catalog missing tables). Other Prisma errors rethrow; portal SettingsContext already fail-opens on HTTP 500.
- CoinPackage / catalog `coinPackages` is Impl **201**.

## Out

- Admin git merge, website `CREATE` / migrate of Admin settings tables
- Settings write on Hono; theme / siteName / email-verify
- Vercel `VITE_USE_MOCK_API=false`

Convention: [portal-settings-read.md](../conventions/portal-settings-read.md), [named-integrations.md](../conventions/named-integrations.md). API: [softgate-api.md](../references/softgate-api.md).

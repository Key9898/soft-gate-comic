---
title: Portal settings HTTP read
type: convention
date: 2026-08-24
updated: 2026-09-10
tags: [settings, api, http, maintenance, softgate]
impl: 173
impl_updated: 202
---

# Portal settings HTTP read

Admin list 17–18: `maintenanceMode`, `allowRegistration`, `contactEmail`. Shape also includes `defaultLanguage` (`en` | `mm`). Portal **does not** call `i18n.changeLanguage` from it.

## Mock on (`VITE_USE_MOCK_API` is not `false`)

`SettingsContext` uses local fail-open defaults: maintenance off, registration on, **contact email absent** → fallback `support@softgatecomic.com`. No fetch. Unset `VITE_USE_MOCK_API` stays mock. Committed `.env.example` is `false`; Vite does not load it. Local `pnpm dev` HTTP uses gitignored `.env.development.local` plus `pnpm dev:api`.

## Mock off

`GET /api/settings` → `{ data: PortalSettings }`. Unwrap with `unwrapApiData`, then `parsePortalSettings`.

API stub (`persist.getPortalSettings`) returns Admin seed:

```json
{
  "maintenanceMode": false,
  "allowRegistration": true,
  "contactEmail": "admin@softgatecomic.com",
  "defaultLanguage": "en"
}
```

Prisma persist (Impl 200) reads Admin `PlatformSettings` (`id = platform`). Envelope stays `{ data }` (never Admin `{ settings }`). Null row or missing table (`P2021`) returns the same seed. GET does not insert. Website does not `PATCH` settings. `POST /api/auth/register` uses the same read (`REGISTRATION_CLOSED` when closed or maintenance is on). `authFlags` still overlay for tests. Local join smoke is Impl **202**.

Do **not** `GET` or `PUT` whole `SharedData` at `/api/data`. Settings are not on portal `SharedData` (no schema 13 bump).

## Fail open

Missing payload, non-boolean flags, or HTTP error: `maintenanceMode=false`, `allowRegistration=true`, email fallback. A down settings endpoint must not close the site.

`maintenanceMode === true` only. `allowRegistration === false` only. Blank/non-string `contactEmail` → fallback.

## Contact mailto

Only [ContactPage](../../apps/portal/src/features/info/ContactPage.tsx) form + channel card consume `contactEmail`. Press `press@`, Creators, and Legal `SUPPORT_MAIL` stay hardcoded until a later Impl. Keep `translate="no"` on the address.

## Maintenance gate

When `maintenanceMode` is true, redirect off the allowlist to `/maintenance`:

Closed: Home, ranking/categories, search, hub, author, Reader, library, coins, profile, notifications, `/register`.

Open: `/maintenance`, `/login`, `/forgot-password`, `/reset-password`, `/about`, `/creators`, `/press`, `/help`, `/contact`, `/faq`, `/privacy`, `/terms`, `/cookies`.

`/maintenance` is not an `INFO_PAGES` entry (no Home › Support trail). SEO `noindex`. Host rewrite in `SPA_REWRITE_SOURCES` + `vercel.json`. Not on the public sitemap.

When maintenance is **off** and `allowRegistration` is false, `/register` stays routable with a closed panel.

CatalogStatus is hidden while maintenance is on.

## Imports

Portal imports parse helpers from `@softgate/shared` (Vite alias). API imports `@softgate/shared/settings` only. Portal must not import `/settings`.

Auth is 174 ([portal-auth-http.md](portal-auth-http.md)). Wallet / unlock / wait-for-free is 175.
---

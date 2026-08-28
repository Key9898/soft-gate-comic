---
title: Impl 173 — Portal settings HTTP read
type: note
date: 2026-08-24
tags: [settings, api, http, maintenance, softgate]
impl: 173
---

# Impl 173 — Portal settings HTTP read

Portal **consumes** platform settings (Admin list 17–18). Admin CMS stays in the Admin repo. Persist is still stub.

## What shipped

- `PortalSettings` + `parsePortalSettings` in `@softgate/shared` (`./settings` export for API)
- API `GET /api/settings` → `{ data }` from `STUB_PORTAL_SETTINGS`
- Portal `SettingsContext`: mock fail-open + missing email fallback; HTTP unwrap + parse
- Maintenance gate, `/maintenance` page, `/register` closed panel, Contact mailto from settings
- Host rewrite `/maintenance`

## Honesty

- Mock Contact stays `support@softgatecomic.com` (email absent)
- HTTP stub Contact uses Admin seed `admin@softgatecomic.com`
- Fallback only when the field is missing or blank
- `defaultLanguage` is unused
- Maintenance is a product flag, not live infra status

## Out

- Admin settings UI
- Auth/session (174), wallet/unlock (175)
- Encrypt settings; `/api/data` blob

---

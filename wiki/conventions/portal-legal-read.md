---
title: Portal legal HTTP read
type: convention
date: 2026-09-10
tags: [legal, privacy, terms, api, http, prisma, admin, softgate]
impl: 212
---

# Portal legal HTTP read

Public `GET /api/legal/privacy` and `GET /api/legal/terms` return published Privacy/Terms copy from Admin CMS tables on shared Postgres. Envelope is `{ data }` (never Admin `{ meta }` / `{ sections }`). Optional reader cookie is ignored. Never 401. No `Set-Cookie`. GET does not insert or SQL-seed.

## Mock on (`VITE_USE_MOCK_API` is not `false`)

Portal `/privacy` `/terms` keep today’s `t('static.*')`. **No fetch.** Unset `VITE_USE_MOCK_API` stays mock. Shell chrome stays.

## Mock off (Impl 212)

`GET ${VITE_API_BASE_URL || http://localhost:3000}/api/legal/privacy` and `/api/legal/terms`. Unwrap `{ data }` via `unwrapApiData`. Pick `en`/`mm` from the payload with the active language.

| HTTP result                         | Page                                                                                        |
| ----------------------------------- | ------------------------------------------------------------------------------------------- |
| 200 with copy                       | Live SEO, glance, effective date, published sections. TOC = `#glance` + slugs + `#contact`. |
| Fail (network, non-OK, unwrap null) | Keep `t('static.*')`. Never a blank legal page.                                             |

`privacy-rights` labels come from CMS; hrefs stay `/profile?tab=security` and `/contact`. Cookies consume is Impl 213.

## Stub persist

No `DATABASE_URL`. Returns `STUB_PRIVACY` / `STUB_TERMS`: today’s copy, published sections without `published`.

## Prisma persist

Reads Admin Privacy/Terms tables. Schema copy only — no website legal migration. Website does not write legal.

| Condition                     | Result        |
| ----------------------------- | ------------- |
| Missing legal table (`P2021`) | matching stub |
| Null meta and empty sections  | matching stub |
| Other Prisma errors           | rethrow (500) |

Published rows only. Omit `published`. Hono is not Admin Express. Admin staff routes stay `/api/legal`.

## Out

Hono writes; website `migrate` of Admin legal tables; WYSIWYG HTML; fail-closed blank `/privacy` `/terms`.

API: [softgate-api.md](../references/softgate-api.md). Note: [2026-09-10-privacy-terms-consume.md](../notes/2026-09-10-privacy-terms-consume.md).

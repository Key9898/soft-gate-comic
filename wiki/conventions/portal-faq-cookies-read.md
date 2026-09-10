---
title: Portal FAQ and Cookie Policy HTTP read
type: convention
date: 2026-09-10
tags: [faq, cookies, api, http, prisma, admin, softgate]
impl: 213
---

# Portal FAQ and Cookie Policy HTTP read

Public `GET /api/faq` and `GET /api/cookies` return published FAQ / Cookie Policy copy from Admin CMS tables on shared Postgres. Envelope is `{ data }` (never Admin `{ items }` / `{ meta, rows }`). Optional reader cookie is ignored. Never 401. No `Set-Cookie`. GET does not insert or SQL-seed.

HTTP session cookies live in `apps/api/src/cookies.ts`. Cookie Policy CMS mappers live in `apps/api/src/cookiePolicy/`. Do not mix the two.

## Mock on (`VITE_USE_MOCK_API` is not `false`)

Portal `/faq` keeps `faqCatalog` + `t('faq.*')`. Portal `/cookies` keeps `t('static.*')` + the hardcoded 16 storage rows. **No fetch.** Unset `VITE_USE_MOCK_API` stays mock. Help hub `FAQ_POPULAR_IDS` stays catalog i18n.

## Mock off (Impl 213)

`GET ${VITE_API_BASE_URL || http://localhost:3000}/api/faq` and `/api/cookies`. Unwrap `{ data }` via `unwrapApiData`. Pick `en`/`mm` from the payload with the active language.

| HTTP result                         | `/faq`                                                                            | `/cookies`                                                                                       |
| ----------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 200 with copy                       | Live items (published only). Search/filter/vote stay. Empty list is honest empty. | Live copy, glance, rows, `lastUpdatedDate` from `effectiveDate`. TOC labels from live copy keys. |
| Fail (network, non-OK, unwrap null) | Keep `faqCatalog` + `t('faq.*')`. Never a blank FAQ page.                         | Keep `t('static.*')` + 16 storage rows. Never a blank Cookie Policy.                             |

`#contact` on Cookies stays `t('static.contactUs')`. Shell related strip / mailto stay. Do not CMS analytics-on. Do not invent a 17th storage key.

## Stub persist

No `DATABASE_URL`. Returns `STUB_FAQ` / `STUB_COOKIES`: today’s i18n copy, FAQ without `published`.

## Prisma persist

Reads Admin `FaqMeta` / `FaqItem` / `CookieMeta` / `CookieStorageRow`. Schema copy only — no website FAQ/Cookies migration. Website does not write FAQ/Cookies.

| Condition                          | Result                                          |
| ---------------------------------- | ----------------------------------------------- |
| Missing FAQ/cookie table (`P2021`) | matching stub                                   |
| Null meta and empty lists          | matching stub                                   |
| Meta present and empty lists       | `{ items: [] }` / empty `rows` (not stub 20/16) |
| Other Prisma errors                | rethrow (500)                                   |

FAQ public rows: `published === true` only; omit `published`. Drop unknown `relatedTo` / unknown `storageKey` / unknown FAQ category (do not 500). Cookie rows have no published flag. Glance length must be 5 or the mapper uses stub glance.

Hono is not Admin Express. Admin staff `/api/faq` `/api/cookies` stay cookie-auth.

## Out

Hono writes; website `migrate` of Admin FAQ/Cookies tables; Help-hub `FAQ_POPULAR_IDS` live fetch; cookie CMP; Privacy/Terms; Admin public GET.

API: [softgate-api.md](../references/softgate-api.md). Note: [2026-09-10-faq-cookies-consume.md](../notes/2026-09-10-faq-cookies-consume.md).

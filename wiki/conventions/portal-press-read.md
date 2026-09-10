---
title: Portal press HTTP read
type: convention
date: 2026-09-10
tags: [press, api, http, prisma, admin, softgate]
impl: 211
---

# Portal press HTTP read

Public `GET /api/press` returns published Press kit copy from Admin CMS tables on shared Postgres. Envelope is `{ data }` (never Admin `{ meta }` / `{ news }`). Optional reader cookie is ignored. Never 401. No `Set-Cookie`. GET does not insert or SQL-seed.

## Mock on (`VITE_USE_MOCK_API` is not `false`)

Portal `/press` keeps today’s `t('press.*')` kit, Demo stills, and founder stand-in. **No fetch.** Unset `VITE_USE_MOCK_API` stays mock. Chrome/TOC/Copy control stay.

## Mock off (Impl 211)

`GET ${VITE_API_BASE_URL || http://localhost:3000}/api/press`. Unwrap `{ data }` via `unwrapApiData`. Pick `en`/`mm` from the payload with the active language.

| HTTP result                         | Press page                                                                                                                                          |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| 200 with copy                       | Live boilerplate, facts, palette, assets, zip, email. Published news/stills only. Spokesperson from a published About member or omit person fields. |
| 200 empty news                      | Meta empty-news title/body (not a fabricated release).                                                                                              |
| 200 empty stills                    | Stills note + empty grid (no fake Home/hub/Reader screenshots).                                                                                     |
| Fail (network, non-OK, unwrap null) | Keep `t('press.*')`. Never a blank page.                                                                                                            |

ZIP default `/press-kit/softgate-comic-press-kit.zip`. Do not delete `public/press-kit/*`. Palette on `/press` does not drive site `primary-*`.

## Stub persist

No `DATABASE_URL`. Returns `STUB_PRESS`: today’s kit copy, empty news/stills, default zip + `press@softgatecomic.com`.

## Prisma persist

Reads Admin `PressMeta` (`id = press`), `PressNews`, `PressStill`, and published `AboutTeamMember` for spokesperson. Schema copy only — no website press migration. Website does not write press.

| Condition                       | Result                                     |
| ------------------------------- | ------------------------------------------ |
| Missing press table (`P2021`)   | `STUB_PRESS`                               |
| Null meta and empty news/stills | `STUB_PRESS`                               |
| Missing About member table      | omit spokesperson; still return press copy |
| Other Prisma errors             | rethrow (500)                              |

Published rows only. Omit `published`. Hono is not Admin Express. Admin staff routes stay `/api/press`.

## Out

Hono writes; website `migrate` of Admin press tables; Media ZIP ingest; fail-closed blank `/press`.

API: [softgate-api.md](../references/softgate-api.md). Named integrations: [named-integrations.md](named-integrations.md). Note: [2026-09-10-press-cms-consume.md](../notes/2026-09-10-press-cms-consume.md).

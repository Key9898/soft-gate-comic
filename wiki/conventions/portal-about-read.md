---
title: Portal about HTTP read
type: convention
date: 2026-09-10
tags: [about, api, http, prisma, admin, softgate]
impl: 207
---

# Portal about HTTP read

Public `GET /api/about` returns published About History + Team from Admin CMS tables on shared Postgres. Envelope is `{ data }` (never Admin `{ histories }` / `{ members }`). Optional reader cookie is ignored. Never 401. No `Set-Cookie`. GET does not insert or SQL-seed.

## Mock on (`VITE_USE_MOCK_API` is not `false`)

Portal `/about` History is the four i18n rows (`history1–4`), including `"Next"` / `"နောက်"` on row 4 and first-row `/about/team/studio-workspace.jpg`. Team is the four i18n portraits (`team-founder.jpg` / editorial / product / creators) plus `about.teamDeck` and always-on `about.teamStandInNote`. **No fetch.** Unset `VITE_USE_MOCK_API` stays mock. Committed `.env.example` is `false`; Vite does not load it. Mission, Values, and Our Story stay hardcoded i18n.

## Mock off (Impl 206 History + Impl 207 Team)

One `GET ${VITE_API_BASE_URL || http://localhost:3000}/api/about` with `credentials: 'include'` (shared `AboutProvider`). Unwrap `{ data }` via `unwrapApiData`. History uses **`histories` only**. Team uses **`members` + `meta`**. Client fetch only — no SSR about seed. Do not put Press on this provider (Impl 211 uses `GET /api/press`).

| HTTP result                                      | History section                                                                                                                                                                                                                      | Team section                                                                                                                                                                                                                                                                                                                                                                                                         |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 200 with rows                                    | Group by `year` ASC. Year label is `String(year)` (Western digits). Month names `about.month1`–`month12`. Bilingual title/desc (`lang` then `.en`). `photoUrl` only when present; never `studio-workspace.jpg`. Never i18n `"Next"`. | Heading stays i18n `about.ourTeam`. 2-col / `lg:4-col`. `parseAboutMembers` sorts `sortOrder` then `id` ASC. Bilingual name/role. `photoUrl` only when present; **never** `team-*.jpg`; **never** initials well. Alt = `name, role`. Deck = `pickBilingual(meta.deck)`; missing/invalid meta fail-opens to `about.teamDeck` and treats `standInVisible` as false. Stand-in note only when `standInVisible === true`. |
| 200 empty array                                  | Heading + `about.historyDeck` stay. Honest `about.historyEmpty`. No seed fallback.                                                                                                                                                   | Heading stays. Honest `about.teamEmpty`. No Nandar Aye seed. No portraits. Stand-in note still follows `standInVisible`.                                                                                                                                                                                                                                                                                             |
| Fail (network, non-OK, unwrap null / non-object) | Heading + deck stay. `about.historyUnavailable` + in-section Retry (`a11y.retry`). Both sections error; both Retry buttons call the same `load()`.                                                                                   | Heading stays. Deck fail-opens to i18n `about.teamDeck`. `about.teamUnavailable` + in-section Retry. Do not reuse `errors.catalogUnavailable`.                                                                                                                                                                                                                                                                       |
| Missing / non-array `histories` only             | History error + Retry.                                                                                                                                                                                                               | Members still parse.                                                                                                                                                                                                                                                                                                                                                                                                 |
| Missing / non-array `members` only               | Histories still parse.                                                                                                                                                                                                               | Team error + Retry.                                                                                                                                                                                                                                                                                                                                                                                                  |
| Loading                                          | History **and** Team section skeletons. Mission / Values / Story / Get involved stay live. After 200, slices diverge. Do not conflate with empty. Pulse may still respect reduced motion.                                            | Same GET in flight.                                                                                                                                                                                                                                                                                                                                                                                                  |

Out-of-range `month` (not 1–12): show `String(month)`, do not crash. Types live in `apps/portal/src/lib/about/history.ts` and `apps/portal/src/lib/about/team.ts` (do not import `@softgate/api`).

## Stub persist

No `DATABASE_URL`. Returns `STUB_ABOUT`: four seed histories (year 2026, months 1 / 3 / 6 / 12), four people, portal deck + stand-in copy. Production path is integer `year`/`month`, not i18n `"Next"`. `photoUrl` omitted. `published` omitted.

## Prisma persist (Impl 205)

Reads Admin `AboutHistory`, `AboutTeamMember`, `AboutTeamMeta` (`id = about-team`). Schema copy only — no website about migration. Website does not write about.

| Condition                                     | Result                                     |
| --------------------------------------------- | ------------------------------------------ |
| Empty published histories / members           | `[]`                                       |
| Missing list table (`P2021`)                  | that list is `[]`; other tables still read |
| Null meta row or missing meta table (`P2021`) | stub meta                                  |
| Other Prisma errors                           | rethrow (500)                              |

Published rows only. Omit `published`. Omit empty `photoUrl`. History sort: year, month, sortOrder, id ASC. Members: sortOrder, id ASC.

Hono is not Admin Express. Admin staff routes stay `/api/about/history` and `/api/about/team`.

## Out

Mission/Values/Our Story/JSON-LD; Hono writes; website `migrate` of Admin about tables; Press founder (Impl 211 `GET /api/press`).

API: [softgate-api.md](../references/softgate-api.md). Named integrations: [named-integrations.md](named-integrations.md). Notes: [2026-09-10-about-history-ui.md](../notes/2026-09-10-about-history-ui.md), [2026-09-10-about-team-ui.md](../notes/2026-09-10-about-team-ui.md).

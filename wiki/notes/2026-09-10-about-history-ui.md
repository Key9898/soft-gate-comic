---
title: Impl 206 — Portal Our history from GET /api/about
type: note
date: 2026-09-10
tags: [about, history, portal, http, softgate]
impl: 206
---

# Impl 206 — Portal Our history from GET /api/about

Website-only. Portal Our history consumes `GET /api/about` `histories`. Mock keeps the i18n timeline. HTTP uses year groups + month names, honest empty, and in-section Retry. Team stays hardcoded until **207**. Admin dashboard and `GET /api/about` shape are unchanged.

## What shipped

- `apps/portal/src/lib/about/history.ts` — portal-owned types, `parseAboutHistories`, `groupHistoriesByYear`, bilingual pick, month keys.
- `useAboutHistories` — `mock` \| `loading` \| `ready` \| `empty` \| `error` + `retry`. Mock: no fetch. HTTP: Settings-style `unwrapApiData`.
- `AboutHistorySection` — heading + `about.historyDeck` stay i18n chrome. Mock: four rows, `"Next"`, studio jpg. HTTP: year once per group; month name + title/desc/`photoUrl`.
- i18n EN + MM: `about.historyEmpty`, `about.historyUnavailable`, `about.month1`–`about.month12`.
- Tests: `AboutPage.test.tsx` mock still has `2026` / `Next` / studio jpg; Team unchanged. `AboutPage.http.test.tsx` seed / `[]` / 500+Retry / reject.

## Honesty

- HTTP `[]` is empty copy, not Founded/Portal/Demo/Production seed.
- HTTP fail is not catalog Retry at the top of the page (`a11y.retry` in this section).
- Live Prisma lists stay empty until staff saves Admin History CMS. Shared Postgres still needs Admin `about_history` migration.

## Out

Team UI (207); Mission/Values/Our Story/JSON-LD; Press founder i18n; Admin repo; Hono writes; website migrate; seed fallback; SSR about bootstrap.

Convention: [portal-about-read.md](../conventions/portal-about-read.md).

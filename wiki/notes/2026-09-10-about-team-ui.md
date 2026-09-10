---
title: Impl 207 — Portal Our team from GET /api/about
type: note
date: 2026-09-10
tags: [about, team, portal, http, softgate]
impl: 207
---

# Impl 207 — Portal Our team from GET /api/about

Website-only. Portal Our team consumes `GET /api/about` `members` + `meta`. One shared GET with History (1A). Mock keeps the four i18n portraits. HTTP uses CMS deck/note, honest empty, fail+Retry, and omits `img` when `photoUrl` is missing (2A). Admin dashboard and `GET /api/about` shape are unchanged. Next free Impl is **212**.

## What shipped

- `apps/portal/src/lib/about/team.ts` — portal-owned `PortalAboutMember` / `PortalAboutMeta`, `parseAboutMembers`, `parseAboutMeta`. Reuses `pickBilingual`.
- `AboutProvider` — one `load()`, one in-flight GET, shared `retry`. Unwrap once; independent parse (missing `histories` fails History only; missing `members` fails Team only).
- Thin `useAboutHistories` / `useAboutTeam` slices. `AboutHistorySection` UI unchanged.
- `AboutTeamSection` — mock: four i18n rows + `team-*.jpg` + always-on stand-in note. HTTP: 2-col / `lg:4-col` grid; no `img` without `photoUrl`; never initials well.
- i18n EN + MM: `about.teamEmpty`, `about.teamUnavailable`.
- Tests: `AboutPage.test.tsx` mock portraits unchanged. `AboutPage.http.test.tsx` seed names without jpgs / `[]` / two Retries / stand-in flag / independent parse.

## Honesty

- HTTP `members: []` is empty copy, not Nandar Aye seed or founder jpg.
- HTTP fail is not catalog Retry (`a11y.retry` in History and Team; same `load()`).
- Live Prisma members stay empty until staff saves Admin Team CMS. Shared Postgres still needs Admin `about_team` / `about_team_meta` migration.

## Out

Press founder / `GET /api/press` (Impl 211 already shipped); Mission/Values/Our Story/JSON-LD; Admin repo; Hono writes; website migrate; seed fallback; initials well; second `/api/about` fetch; SSR about bootstrap.

Convention: [portal-about-read.md](../conventions/portal-about-read.md).

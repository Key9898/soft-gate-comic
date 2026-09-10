---
title: Impl 213 — Public GET /api/faq /api/cookies consume
type: note
date: 2026-09-10
tags: [faq, cookies, api, portal, impl-213]
impl: 213
---

# Impl 213 — Public GET /api/faq /api/cookies + FAQ/Cookies consume

Website public read of Admin FAQ + Cookie Policy CMS. Admin writes are Admin Impl 66; this repo does not claim 66.

## Pipe

Admin `/faq` `/cookies` saves on staff `/api/faq` `/api/cookies` → shared Postgres → Hono `GET /api/faq` and `GET /api/cookies` `{ data }` → portal `/faq` `/cookies`. Mock or fail keeps today’s i18n. Delete-all (meta present + empty lists) stays empty, not stub 20/16.

## API

- Schema copy of `FaqMeta` / `FaqItem` / `CookieMeta` / `CookieStorageRow` after PressStill, before PrivacyMeta. No website migration. No writes.
- Stub persist returns `STUB_FAQ` / `STUB_COOKIES` (today’s copy).
- Prisma persist: per-table `P2021` → null/`[]`; `!meta && empty list` → stub; other Prisma errors rethrow.
- FAQ public: published only; omit `published`. Drop unknown `relatedTo`. Cookie rows: drop unknown `storageKey`. Folder `cookiePolicy/` is CMS, not HTTP `cookies.ts`.

## Portal

`useFaq` / `useCookies` like `usePress` / `useLegal`. Live fetch when `VITE_USE_MOCK_API=false`. FAQ view model `{ id, category, question, answer, related? }`. Cookies `lastUpdatedDate={parseLegalDate(live.effectiveDate)}`. Help hub stays catalog. Privacy/Terms unchanged.

Convention: [portal-faq-cookies-read.md](../conventions/portal-faq-cookies-read.md), [legal-pages.md](../conventions/legal-pages.md).

---
title: Legal pages layered notice + honesty
type: note
date: 2026-08-19
tags: [legal, privacy, terms, cookies, layered-notice, softgate]
impl: 126
---

# Impl 126 — Legal pages layered notice + honesty

Plan drafted as Impl 125; 125 was taken by the Popular rank kick. Ships as **126**.

## Why

Privacy / Terms / Cookies already had TOC + readability + localStorage honesty, but no ICO-style at-a-glance layer, no in-page related-policy strip, an incomplete storage table after Impl 114 ratings, unlinked rights, a hardcoded 1 Jan 2026 date, and chrome that did not match Help/FAQ.

## What shipped

- Shared `LegalPageShell` + `LEGAL_EFFECTIVE_DATE` (19 August 2026).
- Glance (4–5 facts) as first TOC section. Related strip Privacy | Terms | Cookies (current is `aria-current="page"`).
- Contact: `mailto:support@softgatecomic.com` (`translate="no"`) + `/contact`.
- Cookies `dl`: session, accounts, wallet, library, engagement (history/likes/ratings/scroll), comments, notifications, searches, readability, catalog (`softgate-shared-data`). Retired the duplicate Reading progress row.
- Privacy rights: `/profile?tab=security` + Clear site data + guests have no account. Reading activity includes series ratings.
- Terms: Changes section, guest vs signed-in, thickened stubs. Myanmar law. No arbitration.
- `ProfilePage` reads `?tab=` (`profile|settings|preferences|security`).
- `radial-wash-primary` like Support. No cookie CMP / GPC / Do Not Sell.

## Files

- `src/lib/info/legalEffectiveDate.ts`
- `src/features/info/components/LegalPageShell.tsx`
- `src/features/info/{PrivacyPage,TermsPage,CookiesPage}.tsx`
- `src/features/profile/ProfilePage.tsx`
- `src/lib/i18n/locales/{en,mm}/translation.json`
- `src/test/LegalPages.test.tsx`
- `src/test/ProfilePage.test.tsx`

## Verify

`npm run check`

## Next

Impl **127**

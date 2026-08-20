---
title: Help / FAQ / Contact support funnel
type: note
date: 2026-08-18
tags: [help, faq, contact, footer, support, honesty, info, softgate]
impl: 108
---

# Impl 108 — Help / FAQ / Contact support funnel

Plan file said Impl 107; that number was already taken by Creators intake. This ships as **108**.

## Why

Support existed as three thin, equal pages. WEBTOON exiles Help to Zendesk. SoftGate keeps Help on-portal. Missing client FAQ copy is not a reason to stay thin — honest catalog + mailto is the prelaunch bar.

## What shipped

- Shared catalog `src/lib/info/faqCatalog.ts` (`q1`–`q14`, categories, related links). Help search and FAQ render from the same list.
- Honest `faq.a1` (portal + demo) and `faq.a3` (web now; no fake app-store URLs).
- `/help`: search (2+ chars → `/faq#qN`), topic cards `/faq?cat=`, popular hashes, Creators line, Need More `min-h-11`.
- `/faq`: hash open + `?cat=`, `aria-expanded` / `aria-controls`, related links, always-on Still need help → `/contact`.
- `/contact`: clickable `support@`, Try Help first, Creators / Press path cards, Yangon time, no phone. Creators `intent=submit` prefill unchanged.
- Footer Support: Help Center + Contact only. `/faq` route and sitemap loc kept.

## Files

- `src/lib/info/faqCatalog.ts`
- `src/features/info/HelpPage.tsx`, `FAQPage.tsx`, `ContactPage.tsx`
- `src/components/Footer/Footer.tsx`
- `src/lib/i18n/locales/{en,mm}/translation.json`
- `src/test/HelpPage.test.tsx`, `FAQPage.test.tsx`, `ContactPage.test.tsx`, `Footer.test.tsx`

## Verify

`npm run check`

## Next

Impl **109**

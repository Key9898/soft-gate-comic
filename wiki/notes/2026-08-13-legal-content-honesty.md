---
title: Legal content honesty rewrite (webtoon-standard)
type: note
date: 2026-08-13
tags: [legal, privacy, terms, cookies, i18n, honesty, seo, softgate]
impl: 60
---

# Impl 60 — Legal content honesty (webtoon-standard)

## Why

Legal copy was generic boilerplate that contradicted reality: the Cookies page declared analytics/marketing cookies that do not exist (the portal uses localStorage only, no cookies at all), Terms had no coins / age / comments clauses despite the portal selling coin unlocks and hosting comments, and Privacy implied server-side data collection when nothing leaves the browser.

## What shipped (all copy EN + MM)

- **Terms** — new sections modeled on WEBTOON/Tapas patterns: `eligibility` (13+, guardians for minors), `userContent` (comments stay user-owned, display license, moderation right), `coinsVirtual` (4 bullets: no ownership, no real-world value, non-transferable, demo top-up simulated / no refunds). `prohibited` gained anti-piracy scraping/re-upload item. `useLicenseDesc` / `premiumContentDesc` tightened.
- **Privacy** — top-of-page honesty callout (`privacyLocalNote`: demo portal sends nothing to servers); new `readingActivity` sub-section (history/bookmarks/likes power Continue Reading + Library); `dataSharingDesc` rewritten (no third-party sharing, data never leaves device); `yourRightsDesc` explains clearing site data deletes everything; new `childrenPrivacy` (13+) section.
- **Cookies → Cookies & Local Storage truth** — `noCookiesNote` callout (no tracking cookies at all); Essential/Functional renamed to Storage with honest descriptions; Analytics + Marketing sections now explicitly "None"; new `storageDetails` dl grid of 9 real localStorage categories (language, session, wallet, library, progress, comments, notifications, searches, readability); managing section = clear-site-data + consequences; third-party = none; updates note mentions future backend.
- **SEO** — page-specific descriptions (`privacySeoDesc` / `termsSeoDesc` / `cookiesSeoDesc`) replace shared `footer.description`.
- **Test** — new `src/test/LegalPages.test.tsx` (11 cases): h1 + TOC anchors per page, honesty text assertions (coins demo line, no-cookies note, storage grid), no raw i18n keys.

## Files

- `src/features/info/{PrivacyPage,TermsPage,CookiesPage}.tsx`
- `src/lib/i18n/locales/{en,mm}/translation.json` (static legal block rewritten, ~45 new keys)
- `src/test/LegalPages.test.tsx` (new)

## Coordination

Impl numbers collided with a parallel thread again (its Support & recovery pages took 58). This work renumbered to **59 (shell) + 60 (content)**; index deduped, next → 61.

## Verify

`npm run check`

## Next

Impl **61** — free

---
title: Support & recovery pages revamp (FAQ/Help/404/Contact)
type: note
date: 2026-08-13
impl: 58
tags: [faq, help, 404, contact, i18n, a11y, softgate]
---

# Support & recovery pages revamp

FAQ + Help ကို webtoon-reader help center စံ (WEBTOON/Tapas funnel: Help landing → FAQ → Contact) အတိုင်း ပြင်ဆင်ပြီး 404 ကို recovery-flow page အသစ်ဆောက်၊ Contact ကို shell + i18n ပြင်။ Plan drafted as Impl 57 — 57 was taken by Press kit (parallel session) → shipped as **Impl 58**.

## FAQ (`src/features/info/FAQPage.tsx`)

- Shell `max-w-4xl` → `max-w-7xl` + `max-w-3xl` left-aligned content column (Container standard)
- Hardcoded → i18n: search placeholder, `All FAQs` tab, feedback widget (`faq.wasHelpful|yes|no|feedbackThanks`), empty state (`faq.noResults|noResultsDesc` + Contact link)
- Search input: `type="search"` + `aria-label`
- **Honesty rewrite**: `faq.a5` (password reset = device-only demo flow), `faq.a8` (demo top-up only, no real payments)
- New webtoon Q&A (content category): `q12` premium unlock with coins, `q13` Continue Reading, `q14` publish your webtoon → Publish with Us page

## Help (`src/features/info/HelpPage.tsx`)

- Shell → `max-w-7xl` + inner `max-w-3xl` blocks
- Topic cards + all links: `focus-visible:ring-2` (WCAG 2.4.7)
- **Popular Articles** section — FAQ question links (`faq.q2/q7/q12/q13/q14`) → `/faq` (WEBTOON funnel pattern), previously dead `help.popularArticles` key now used
- **Need More Help** CTA card → `/contact` (`help.needMore|needMoreDesc` now used)
- Dead keys deleted: `help.searchPlaceholder, browseByCategory, appSettings, articles, article1–5`

## 404 (`src/features/info/NotFoundPage.tsx` — new)

- `path="*"` route moved **inside MainLayout** (nav/footer preserved — 404 UX best practice); inline JSX in `App.tsx` deleted
- i18n `notFound.*` (EN/MM), SEO `noindex`, client-side `Link`s (no full-reload `<a>`)
- Actions: primary Home + Search webtoons CTA + popular links (Categories / Library / Contact), all hover + focus-visible

## Contact (`src/features/info/ContactPage.tsx`)

- Shell `max-w-5xl` → `max-w-7xl`
- Validation messages ×7 → `contact.errors.*` (EN/MM)
- Honest copy: `contact.formHint` ("opens your email app"), `contact.successTitle|successDesc` (mailto flow အမှန်အတိုင်း — "Message Dispatched" fake ticket copy ဖျက်)

## Tests

New: `FAQPage.test.tsx` (7), `HelpPage.test.tsx` (5), `NotFoundPage.test.tsx` (4), `ContactPage.test.tsx` (3) — 19 cases.

## Verify

- `npm run check`
- Manual QA: `/faq` search + empty state + MM mode; `/help` popular articles; bad URL → 404 with nav/footer; `/contact` empty submit errors in MM

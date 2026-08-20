---
title: Help, FAQ, Contact support pages perfect
type: note
date: 2026-08-19
tags: [help, faq, contact, support, honesty, info, prelaunch, softgate]
impl: 111
---

# Impl 111 — Help, FAQ, Contact support pages perfect

Plan drafted as Impl 109; 109 was Categories sort labels and 110 was Creators intake polish. This ships as **111**.

## Why

Impl 108 built the funnel. Help still dumped kinds into four FAQ cats only, coins/refund copy implied live checkout, thumbs sounded like a received vote, Contact deck was thin, and page-root `overflow-hidden` clipped chrome. Incomplete FAQ copy is not a reason to stay thin — six more kinds + About chrome is the prelaunch bar.

## What shipped

- Help: six topic cards (keep Getting Started / Payments / Account Security hrefs; add Library `#q16` and Safety `#q18`). Need More copy matches the Contact button. `min-h-11` on topics, popular, CTAs. About `SECTION_RULE` + heading dot, copied locally.
- FAQ catalog `q15`–`q20` (guest, Library, notifications, report, language, this-device data). `q1`–`q14` hashes unchanged. Four categories only. `faq.a7` / `faq.a9` match demo top-up. Thumbs: local-only copy. Tabs / accordion / thumbs `min-h-11`.
- Contact: Help/FAQ-first deck, writer checklist (display only), HQ `Insein, Yangon, Myanmar`, no source comments, no page-root `overflow-hidden`. `intent=submit` still prefills `creators.pitchSubject` + `creators.pitchMessageTemplate` when empty. Send stays `Button` `min-h-[44px]`. Mailto `support@softgatecomic.com`.
- No Zendesk, chat, tickets, extra form fields, street number, or `creators@`. `/creators` not edited.

## Files

- `src/lib/info/faqCatalog.ts`
- `src/features/info/HelpPage.tsx`, `FAQPage.tsx`, `ContactPage.tsx`
- `src/lib/i18n/locales/{en,mm}/translation.json`
- `src/test/HelpPage.test.tsx`, `FAQPage.test.tsx`, `ContactPage.test.tsx`
- `wiki/conventions/info-page-chrome.md`

## Verify

`npm run check`

## Next

Impl **112**

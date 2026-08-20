---
title: Contact Demo inbox hours and fuller FAQ a6 a10 a11
type: note
date: 2026-08-19
tags: [contact, faq, hours, honesty, support, softgate]
impl: 113
---

# Impl 113 — Contact Demo inbox hours + FAQ a6 a10 a11

Plan drafted as Impl 112; Contact pitch fields already used 112. This ships as **113**.

## Why

Help / FAQ / Contact were already Perfect (Impl 111). Two polish leftovers: inbox hours as a Demo/client-swap line, and three thin FAQ answers (`a6`, `a10`, `a11`).

## What shipped

- Contact `contact.hoursInbox`: weekdays, Yangon time, Demo — studio replaces. No clock window. Existing `contact.hours` (timezone + no SLA) kept.
- FAQ `a6`: Profile → Security, password confirm, this device/browser, guests have no account.
- FAQ `a10`: Home New Releases; per-series rhythm; no portal-wide drop day. Related Home `/`.
- FAQ `a11`: Contact with series name + why; not a license/publish promise.
- Still 20 FAQs. No `q21`. Creators and `intent=submit` pitch fields unchanged.

## Files

- `src/lib/i18n/locales/{en,mm}/translation.json`
- `src/features/info/ContactPage.tsx`
- `src/lib/info/faqCatalog.ts`
- `src/test/ContactPage.test.tsx`, `FAQPage.test.tsx`
- `wiki/conventions/info-page-chrome.md`

## Verify

`npm run check`

## Next

Impl **114**

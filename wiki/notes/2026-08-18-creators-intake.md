---
title: Publish with Us — complete creator intake
type: note
date: 2026-08-18
tags: [creators, contact, i18n, honesty, info, softgate]
impl: 107
---

# Impl 107 — Publish with Us (complete creator intake)

Plan file said Impl 106; that number was already taken by the ranking chart. This ships as **107**.

## Why

`/creators` had a correct 3-step skeleton but missing international intake kinds (handbook specs, pitch contents, after-submit, rights/earnings, FAQ). CTA said Contact Admin. Page-root `overflow-hidden` drifted from About chrome.

## What shipped

- Fact chips: Editorial intake / Myanmar / EN+MM / Demo portal.
- Why publish here, format handbook (800px default, **3:4** cover, ≥3 episodes), pitch checklist, after you send (Demo SLA), rights + payouts not live, four always-visible FAQ items.
- H1 / breadcrumb / SEO stay **Publish with Us**. Eyebrow is **Creators**.
- CTA **Send your pitch** → `/contact?intent=submit`. Contact prefills subject + template when that query is present. Mailto remains `support@softgatecomic.com`.
- No fake uploader, no `creators@`, no fabricated split.

## Files

- `src/features/info/CreatorsPage.tsx`
- `src/features/info/ContactPage.tsx`
- `src/lib/i18n/locales/{en,mm}/translation.json`
- `src/test/CreatorsPage.test.tsx`
- `src/test/ContactPage.test.tsx`

## Verify

`npm run check`

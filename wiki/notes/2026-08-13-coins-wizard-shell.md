---
title: Coins wizard shell — mobile scroll, dialog semantics, dead dark CSS strip
date: 2026-08-13
impl: 72
type: note
tags: [coins, a11y, mobile, theme, cleanup]
---

# Coins wizard shell + cleanup (Impl 72)

Batch 3b of the six-batch audit overhaul. Structural fixes on `src/features/coins/CoinsPage.tsx`.

## What changed

- **Mobile overflow fixed**: wizard panel now `flex max-h-[85dvh] flex-col`; the content box is
  `flex-1 overflow-y-auto overscroll-contain` — card/QR sheets scroll internally instead of
  overflowing short viewports (header, breadcrumbs, demo banner, and footer buttons stay pinned).
- **Dialog semantics**: wizard gets `role="dialog"` + `aria-modal="true"` +
  `aria-labelledby` (package h3 via `useId`), `useScrollLock(showPaymentModal)`,
  `useFocusTrap(wizardRef, showPaymentModal)` (Impl 70 hooks), and an Escape handler that closes
  the wizard unless `isProcessing`.
- **Dead dark-mode CSS deleted**: the 6 `.dark .metal-*` rules in the inline style block (portal is
  light-only; `.dark` never exists) — light `.metal-*` rules kept.
- **~63 legacy `dark:` utility classes stripped** from CoinsPage (never fired). Zero visual change.
- **`text-[10px]` ×8 → `text-2xs`** (token from Impl 64); decorative `text-[8px]`/`text-[9px]`
  card-art sizes kept.
- **Page h1 added**: `<h1 className="sr-only">{t('coinsPage.title')}</h1>` (page had no h1/h2).

## Files

- `src/features/coins/CoinsPage.tsx`
- `src/test/CoinsCheckout.test.tsx` — +3 cases (dialog semantics + internal scroll, Escape close,
  page h1)

## Verify

`npm run check`; manual: open wizard on a short viewport → internal scroll; Escape closes; no
visual diff in light mode.

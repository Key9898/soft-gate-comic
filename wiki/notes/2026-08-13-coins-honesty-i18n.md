---
title: Coins checkout honesty + i18n copy
date: 2026-08-13
impl: 71
type: note
tags: [coins, honesty, i18n, demo]
---

# Coins checkout honesty + i18n (Impl 71)

Batch 3a of the six-batch audit overhaul. Copy-only pass on `src/features/coins/CoinsPage.tsx` —
no flow changes.

## What changed

- **Demo framing**: persistent amber banner inside the wizard modal (below the step breadcrumbs, so
  it stays visible on the method step and all detail sheets): `coinsPage.demoCheckoutNote` —
  "Simulation — no real payment happens; coins are credited locally on this device."
- **Fake merchant ID de-faked**: "Transaction Merchant ID / TXN-8472910-MM" → label
  `coinsPage.merchantIdLabel` ("Demo transaction ID") + value `DEMO-TXN-8472910` (copy button kept,
  clipboard writes the same demo value).
- **i18n — 23 new `coinsPage.*` keys EN+MM**: 6 payment-method descriptions, `backToMethods`
  (replaces inline mm/en ternary), `totalPrice`, `payAmount` ("Pay {{price}}"), `perCoin`
  ("{{amount}} MMK per coin"), 3 phone errors (`phoneStart09/TooShort/TooLong` — replace inline
  ternaries), card-art strings (`cardBrandName`, `cardholderLabel/Placeholder`,
  `expiryLabel/Placeholder`, `signatureLabel`, `cardNetworkLabel`), `demoCheckoutNote`,
  `merchantIdLabel`.
- **Price locale**: `formatPrice` now `Intl.NumberFormat(lang === 'mm' ? 'my-MM' : 'en-US')`.

## Files

- `src/features/coins/CoinsPage.tsx`
- `src/lib/i18n/locales/{en,mm}/translation.json`
- New `src/test/CoinsCheckout.test.tsx` (5 cases: demo note on both wizard steps, phone error keys,
  no raw English descs under mm, mm-locale price formatting)

## Verify

`npm run check`; manual: open Coins → pick package → banner visible on every step; switch to MM →
method descriptions and price numerals localized.

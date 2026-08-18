---
title: App pages shell alignment (Profile / Notifications / Coins)
type: note
date: 2026-08-13
impl: 61
tags: [layout, container, profile, notifications, coins, softgate]
---

# App pages shell alignment (Impl 61)

## Why

Navigation and Footer cap content at `max-w-7xl`, but the app task pages used narrower shells (Profile `max-w-6xl`, Notifications `max-w-3xl`, Coins `max-w-4xl`), so their left edges did not align with the nav logo on wide screens. Same rationale as the Impl 56 info-page container standard (wide shell + narrow left-aligned inner columns); validated against GC Design System `layout="page"` guidance.

## What changed

| Page                                               | Before            | After                                                                                                                                                                             |
| -------------------------------------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/features/profile/ProfilePage.tsx`             | `max-w-6xl` shell | `max-w-7xl` shell — `lg:grid-cols-4` grid + sticky sidebar fill it naturally                                                                                                      |
| `src/features/notifications/NotificationsPage.tsx` | `max-w-3xl` shell | `max-w-7xl` shell + left-aligned `max-w-3xl` inner column (header, filters, feed card, clear-read action)                                                                         |
| `src/features/coins/CoinsPage.tsx`                 | `max-w-4xl` shell | `max-w-7xl` shell + left-aligned `max-w-4xl` inner column (balance card, tabs, buy/history panels); fixed-position confetti, wizard modal, snackbar stay outside the inner column |

Inner columns have **no `mx-auto`** — content stays left-aligned with the nav logo.

## Bonus fix — raw i18n keys

New smoke tests caught two pre-existing missing keys rendering raw on Profile:

- `common.demo` → EN "Demo" / MM "ဒီမို"
- `profilePage.localStatsNote` → EN "Stored on this device — {{balance}} coins · {{unlocks}} unlocked episodes" / MM equivalent

## Tests

New suites (9 cases total): `src/test/ProfilePage.test.tsx` (seeds `softgate_user` session via localStorage override — setup.ts mock always returns null, so the test file redefines it like `useAuth.test.tsx`), `src/test/NotificationsPage.test.tsx`, `src/test/CoinsPage.test.tsx`. Each asserts heading render, `mx-auto max-w-7xl` shell + inner column class (no `mx-auto`), and no raw i18n keys.

## Intentional exclusions

- **Reader** — `max-w-2xl` is the vertical-strip reading measure; ReaderLayout has no nav to align with.
- **Auth pages** — AuthLayout centered card is deliberate.

Documented in [info-page-chrome.md](../conventions/info-page-chrome.md).

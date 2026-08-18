---
title: Chrome polish — safe areas, 44px targets, nav shortcuts, CTA honesty
date: 2026-08-13
impl: 73
type: note
tags: [chrome, mobile, safe-area, touch-targets, navigation]
---

# Chrome polish (Impl 73)

Batch 4 of the six-batch audit overhaul.

## What changed

- **`viewport-fit=cover`** added to the `index.html` viewport meta — without it every
  `env(safe-area-inset-*)` resolves to 0, so the existing `safe-top`/`safe-bottom` utilities never
  did anything on notched phones.
- **Safe-area wiring** (existing utilities now actually applied): Navigation sticky bar
  (`safe-top`), Reader fixed header (`safe-top`), Reader fixed footer + settings bottom sheet
  (`safe-bottom`). Floating pills (Library edit bar, Library/Coins toasts) use
  `bottom-[calc(1.5rem+env(safe-area-inset-bottom))]` instead of padding so the pill shape stays
  intact.
- **44px touch targets** on primary chrome (WCAG 2.2 best practice; 38px content chips stay —
  AA-compliant): nav search/bell/menu/logout icon buttons + new Library/Coins links get
  `flex min-h-11 min-w-11 items-center justify-center`; mobile menu rows get
  `flex min-h-11 items-center`; Modal close button `p-1` → `p-2` + min sizes; decorative lucide
  icons in nav get `aria-hidden`.
- **LanguageSwitcher compact**: label `hidden sm:inline` (mobile shows Globe only — frees header
  space), `min-h-11`, `aria-label` keeps the full language name.
- **Nav discoverability**: authenticated users get Library + Coins icon links next to the bell on
  desktop (`sm:flex`), and a Coins row beside the existing Library row in the mobile menu. Guests
  unchanged per [guest-access.md](../conventions/guest-access.md).
- **Wrong CTAs fixed**: Home bottom banner now `isAuthenticated ? /categories + home.browseNow :
/register + home.getStartedFree` (was always "Get Started for Free" → /register, a dead end for
  members); NotificationsPage row link label `nav.home` ("Home") → new `notificationsPage.view`
  ("View" / "ကြည့်ရန်") — the link goes to the episode, not home.

## Files

- `index.html`; `src/components/Navigation/Navigation.tsx`;
  `src/components/LanguageSwitcher/LanguageSwitcher.tsx`; `src/components/Modal/Modal.tsx`;
  `src/features/reader/ReaderPage.tsx`; `src/features/library/LibraryPage.tsx`;
  `src/features/coins/CoinsPage.tsx`; `src/features/home/HomePage.tsx`;
  `src/features/notifications/NotificationsPage.tsx`
- i18n en+mm: `home.browseNow`, `notificationsPage.view`
- New `src/test/NavChrome.test.tsx` (8 cases: guest vs authed nav links, safe-top, 44px targets,
  compact switcher, Home CTA per auth state, view label locales)

## Verify

`npm run check`; manual on a notched device/simulator: nav and reader bars clear the notch/home
indicator; mobile header no longer crowded (Globe-only switcher).

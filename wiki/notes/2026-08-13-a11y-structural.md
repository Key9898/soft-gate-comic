---
title: A11y structural — headings, keyboard cards, live regions, label wiring
date: 2026-08-13
impl: 76
type: note
tags: [a11y, aria, keyboard, headings, forms]
---

# A11y structural (Impl 76)

Batch 6b (final) of the six-batch audit overhaul: structural accessibility fixes that screen-reader
and keyboard users hit on every page — heading hierarchy, keyboard-operable cards, live regions for
async feedback, real label wiring on floating inputs, and decorative-icon hygiene.

## What changed

### Headings

- **ProfilePage**: display-name `h2` → `h1` (same classes — visual identical).
- **SearchPage**: new `<h1 className="sr-only">{t('nav.search')}</h1>` (page had no h1).
- **LibraryEmptyState**: `h3` → `h2` (fixes h1→h3 skip under the Library h1).
- Coins `sr-only` h1 already landed in Impl 72.

### Keyboard access (cards with nested interactive children — cannot be `<button>`)

- **LibraryPage** grid + list card divs: `role="button"` + `tabIndex={0}` + Enter/Space `onKeyDown`
  → `handleCardClick`, plus `focus-visible:ring-2` ring.
- **NotificationsPage** rows: same pattern → `markNotificationRead`, ring inset.

### Live regions

- `role="status"`: Library delete toast, Coins purchase success toast, Profile save status line.
- `role="alert"`: Reader unlock error, FloatingInput/Input/Contact form field errors.

### Label wiring

- **FloatingInput** (Profile) + **ContactPage** floating fields + textarea: `useId`-based
  `htmlFor`/`id`, `aria-invalid` + `aria-describedby` → error id.
- Password eye toggles (Input + FloatingInput): `aria-label` via new `auth.showPassword` /
  `auth.hidePassword` keys (en+mm), icons `aria-hidden`.

### Icon hygiene

`aria-hidden="true"` added to remaining decorative lucide icons in LibraryPage, LibraryEmptyState,
SearchPage, CoinsPage, CoinPackageCard, TransactionHistoryRow, Comments, FAQPage, Input,
FloatingInput.

## Tests

- New [`src/test/A11yStructure.test.tsx`](../../src/test/A11yStructure.test.tsx) (6 cases): h1 on
  Profile/Search/Coins, Library card Enter-key activation, delete toast `role="status"`,
  FloatingInput error `role="alert"` + `aria-invalid`.
- **Gotcha — AnimatePresence `mode="wait"` in jsdom**: Library cards mount inside
  `<AnimatePresence mode="wait">` keyed on `items.length`; when bookmarks hydrate after first
  paint, the empty-state child must exit-animate before cards mount. Synchronous queries see the
  stale empty state — tests must `await waitFor(...)` for the card. (The tab badge count lives
  outside the animation and updates immediately, which makes the mismatch confusing.)
- **Selector fallout**: `getByLabelText(/password/i)` now matches the "Show password" toggle too —
  LoginPage/Input tests tightened to `/^password$/i`, toggle asserted via accessible name.

Suite: 243 tests green (`npm run check` full gate).

## Files

`ProfilePage.tsx`, `SearchPage.tsx`, `LibraryPage.tsx`, `LibraryEmptyState.tsx`,
`NotificationsPage.tsx`, `CoinsPage.tsx`, `ReaderPage.tsx`, `FloatingInput.tsx`, `Input.tsx`,
`ContactPage.tsx`, `Comments.tsx`, `FAQPage.tsx`, `CoinPackageCard.tsx`,
`TransactionHistoryRow.tsx`, locales en+mm, tests (new A11yStructure + LoginPage/Input updates).

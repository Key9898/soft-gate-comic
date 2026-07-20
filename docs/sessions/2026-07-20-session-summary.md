---
title: Session summary 2026-07-20
date: 2026-07-20
phases: []
wiki_mirror: wiki/notes/2026-07-20-brand-theme-color-palette.md
wiki_mirror_extra:
  - wiki/notes/2026-07-20-default-en-force-light.md
---

# Session summary 2026-07-20

## Phase 1 — Logo theme token calibration (token-only)

### Goal

Align portal `@theme` colors to the **live website logo** (`public/logo/logo.jpg`) without touching component classes — zero layout/UX structure change.

### Changes

| File | Change |
| ---- | ------ |
| `src/index.css` | Recalibrated `--color-primary-50…950` (anchor `primary-400` = logo `#64c8c8`; CTA `primary-600` = `#0e9494`). Recalibrated `--color-accent-500/600/700` (anchor `accent-600` = logo burst `#e63264`). |
| `wiki/notes/2026-07-20-brand-theme-color-palette.md` | Documented logo samples + Phase 1 |
| `wiki/conventions/brand-color-tokens.md` | New convention: teal = primary, magenta = accent |

### Not changed

- No `src/features/**` or `src/components/**` class edits
- No routing, auth, data, or layout changes

### QA

- Token-only cascade; existing `primary-*` utilities update automatically
- `npm run test:run` → **68 passed** (7 files)

### Next (not in this phase)

- Phase 2: selective `accent-*` on badges / notification dots
- Phase 3: remove leftover indigo/purple gradients (e.g. Profile chart)

## Phase 2 — Selective accent (badges / dots / promo)

### Goal

Apply logo magenta (`accent-*`) only to premium/NEW badges, notification dots, and promo highlights. Keep primary CTAs, nav active, and focus rings teal.

### Changes

| Area | File | Change |
| ---- | ---- | ------ |
| NEW badge | `HomePage.tsx` | `bg-green-500` → `bg-accent-600` |
| Premium badge | `CategoriesPage.tsx` | `bg-yellow-500` → `bg-accent-600` |
| Premium episode chips | `WebtoonDetailPage.tsx` | amber → accent |
| Premium lock icon | `ReaderPage.tsx` | amber → accent (unlock Button stays primary) |
| Bell unread dot | `Navigation.tsx` | `bg-red-500` → `bg-accent-600` |
| Unread dots / promo | `NotificationsPage.tsx` | accent + `Button variant="accent"` for promo CTA |
| Popular / Best Value | `CoinsPage.tsx` | amber/purple promo ribbons → accent |
| Button API | `Button.tsx` | new `accent` variant |
| CSS util | `index.css` | `.tag-accent` |
| Test | `Button.test.tsx` | accent variant case |

### QA

- `npm run test:run` → **69 passed** (7 files)
- Visual: Home NEW, Categories Premium, Nav bell, Notifications promo, Coins package badges; confirm Login/primary buttons still teal

## Phase 3 — Leftover indigo/purple cleanup

### Goal

Remove legacy indigo/purple/fuchsia decorative colors; map to primary (teal) or accent (magenta). No layout changes.

### Changes

| File | Change |
| ---- | ------ |
| `ProfilePage.tsx` | Chart bar gradient → primary only |
| `CoinsPage.tsx` | Headers, glow, metal, MMQR, card mock → primary/accent |
| `ReaderPage.tsx` | Progress glow + mock panels + blur → brand family |
| `AboutPage.tsx` / `ContactPage.tsx` / `CareersPage.tsx` | Icon chips + radial wash → primary/accent |

### Intentionally kept

- Wallet brand colors (KBZ/Wave/A+), danger red, gold/amber coin metallics

### QA

- `src/` grep: zero `indigo|purple|violet|fuchsia`
- `npm run test:run` → **69 passed** (7 files)

## Phase 4 — Visual QA + `npm run check`

### Automation

- `npm run check` → **pass** (lint warnings only pre-existing; format fixed; 69 tests; production build OK)
- Prettier fix: `ProfilePage.tsx`, `brand-color-tokens.md`, `2026-07-20-brand-theme-color-palette.md`

### Browser visual path (`http://localhost:5182`)

| Page | Result |
| ---- | ------ |
| Home | Teal login/genre chips; NEW badge `accent-600` `#e63264` |
| Categories | Active genre teal; Premium badge accent |
| Detail `/webtoon/1` | Premium coin chips accent; CTAs teal |
| Reader `/read/1/1` | Dark chrome OK; progress `primary→accent`; no purple panels |
| Auth `/login` | Soft primary wash; primary submit |
| Library | Auth OK; tabs/progress teal |
| Coins | Balance primary gradient; Popular/Best Value accent ribbons |
| Profile | Chart bars primary only; nav teal |
| Mobile 390×844 | Hamburger + search + bell (accent unread dot) |

### Token verify (computed)

- `--color-primary-600` = `rgb(14 148 148)`
- `--color-primary-400` = `rgb(100 200 200)` (logo letter)
- `--color-accent-600` = `rgb(230 50 100)` (logo burst)
- Bell unread dot = `rgb(230, 50, 100)`

### Notes

- Pre-existing ESLint warnings only (no new errors)
- No theme-related bugs found; no further code changes required beyond Prettier

## Default EN + force light theme (2026-07-20)

### Goal

First visit defaults to English; portal chrome stays light even when OS is dark (About/Coins/etc. match Home).

### Changes

| File | Change |
| ---- | ------ |
| `src/lib/i18n/index.ts` | `lng`/`fallbackLng` → `en`; detection `order: ['localStorage']` only (no `navigator`) |
| `src/index.css` | `@custom-variant dark (&:where(.dark, .dark *))`; `html { color-scheme: light }` |
| `wiki/notes/2026-07-20-default-en-force-light.md` | Decision note |
| `wiki/conventions/portal-light-and-i18n-defaults.md` | Convention |

### Not changed

- LanguageSwitcher still toggles MM/EN and caches `i18nextLng`
- Reader local reading `darkMode` chrome (not root `.dark`)
- Did not strip existing `dark:` utility classes

### QA notes

- Clear `localStorage.i18nextLng` (or use fresh profile) to verify EN default
- With OS dark enabled, About/Coins/Profile should stay light
- Existing `i18nextLng=mm` still shows Myanmar until switched

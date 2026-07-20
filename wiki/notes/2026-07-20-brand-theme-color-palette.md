---
title: Brand logo theme color palette (Phase 1 token calibration)
type: note
date: 2026-07-20
tags: [brand, theme, tailwind, colors, logo]
---

# Brand Logo Theme Color Palette

## Context

Portal UI must match the live brand mark used in the app: [`public/logo/logo.jpg`](../../public/logo/logo.jpg) (Navigation, Footer, AuthLayout). Earlier the same day, purple primary was replaced with a generic teal scale. **Phase 1** calibrates `@theme` tokens to **sampled logo hex anchors** only — no component class changes.

## Logo color anchors (sampled)

| Role                    | Sample hex | RGB                |
| ----------------------- | ---------- | ------------------ |
| Letter fill (SOFT GATE) | `#64c8c8`  | `rgb(100 200 200)` |
| Burst / starburst       | `#e63264`  | `rgb(230 50 100)`  |
| Hot pink highlight      | `#fa326e`  | `rgb(250 50 110)`  |
| Ink / outline           | `#000000`  | black              |
| Ground                  | `#ffffff`  | white              |

## Phase 1 action (`src/index.css` `@theme`)

1. **Primary (teal/cyan)** — full `50–950` scale; **`primary-400` = logo letter `#64c8c8`**; **`primary-600` = `#0e9494`** (`rgb(14 148 148)`) for CTA/link contrast (slightly cyan-shifted vs prior `#0d9488`).
2. **Accent (magenta)** — **`accent-600` = logo burst `#e63264`**; `accent-500` / `accent-700` stepped from logo hot pink.

Component TSX classes untouched — all `primary-*` / CSS `.btn-primary` / etc. pick up tokens automatically.

## Phase 3 — Leftover indigo/purple cleanup (2026-07-20)

Replaced legacy indigo / purple / fuchsia / violet accents with **primary** (teal) or **accent** (magenta). Layout and structure untouched.

| Area                          | Change                                                    |
| ----------------------------- | --------------------------------------------------------- |
| Profile weekly chart          | indigo/purple bar tip → `primary-400`                     |
| Coins balance / modal headers | `to-indigo-800` → `to-primary-800`; blur → accent         |
| Coins package glow            | `purple-glow` → `accent-glow` (logo magenta RGBA)         |
| Coins metal-ruby / platinum   | purple stops → accent / primary                           |
| Coins MMQR + card mock        | indigo/purple → primary scale                             |
| Reader progress glow          | purple → `to-accent-600`                                  |
| Reader mock panels            | purple/indigo/fuchsia → primary/cyan/teal/rose/pink       |
| About / Contact / Careers     | purple icon chips + indigo radial wash → accent / primary |

**Still intentional non-brand colors:** wallet brand marks (KBZ blue, Wave yellow, A+ orange), semantic red (danger/errors), gold/amber coin metallics.

## Phase 4 — Visual QA (2026-07-20)

- `npm run check` passed (format fix + 69 tests + build).
- Browser QA on Home → Categories → Detail → Reader → Auth → Library → Coins → Profile + mobile nav.
- Computed tokens match logo anchors; unread bell = accent; reader progress primary→accent; zero purple leftovers on audited pages.

Applied `accent-*` only to brand-highlight surfaces (logo burst role):

| Surface                            | Files                                                                                                |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------- |
| NEW badge                          | `HomePage`                                                                                           |
| Premium badge / locks / coin chips | `CategoriesPage`, `WebtoonDetailPage`, `ReaderPage` (lock icon only)                                 |
| Notification dots / unread count   | `Navigation`, `NotificationsPage`                                                                    |
| Promo highlights                   | `NotificationsPage` (promotion icon + `Button variant="accent"`), `CoinsPage` (Popular / Best Value) |

**Unchanged (stay teal):** primary buttons, nav active, focus rings, filter tabs.

Also: `Button` gained `variant="accent"`; `.tag-accent` utility in `index.css`.

## Related

- Convention: [brand-color-tokens.md](../conventions/brand-color-tokens.md)
- Asset: `public/logo/logo.jpg` (active); `logo-v2.jpg` unused in `src/`

---
title: Brand color tokens (logo-aligned)
type: convention
date: 2026-08-11
updated: 2026-08-13
tags: [brand, theme, tailwind, colors, spark, semantic]
---

# Brand color tokens

Source of truth: live logo [`public/logo/logo.svg`](../../public/logo/logo.svg) (in-app) + [`logo.png`](../../public/logo/logo.png) (OG/social) + `@theme` in [`src/index.css`](../../src/index.css).

## Live logo anchors

| Role              | Hex       | Token                                 |
| ----------------- | --------- | ------------------------------------- |
| Ink / outline     | `#010101` | gray/black text (no ink scale)        |
| Letter fill       | `#69c9ca` | `primary-400`                         |
| Magenta burst     | `#ee3968` | `accent-600`                          |
| Tip / flame       | `#ef4124` | `spark-500`                           |
| CTA / theme-color | `#0e9494` | `primary-600` (WCAG-safe action fill) |

## Mapping

| Brand role                        | Token family | Hero stop             | Hex       |
| --------------------------------- | ------------ | --------------------- | --------- |
| Letter display / soft chrome      | `primary-*`  | `primary-400`         | `#69c9ca` |
| Default CTA / links / focus / nav | `primary-*`  | `primary-600` / `700` | `#0e9494` |
| Burst highlight                   | `accent-*`   | `accent-600`          | `#ee3968` |
| Rare heat (sale / Best Value)     | `spark-*`    | `spark-500` / `600`   | `#ef4124` |

**WCAG note:** `#69c9ca` is a display tint — never use it as solid white-on-fill primary button. Use `primary-600` for filled CTAs.

## Semantic palette (allowed raw Tailwind colors — documented decisions, not drift)

| Meaning               | Family    | Where                                                      |
| --------------------- | --------- | ---------------------------------------------------------- |
| Success / positive    | `emerald` | toasts, bonus coins, success states                        |
| Warning / demo        | `amber`   | demo banners/badges, gold coin art, star ratings           |
| Info                  | `sky`     | informational chips (Coins "instant delivery")             |
| Danger                | `red`     | destructive buttons, validation errors, QR countdown       |
| Gamification art      | rainbow   | Achievements badge tiers (Profile) — decorative reward art |
| Vendor brands         | fixed hex | KBZ `#0062b1`, Wave `#fdd835`, A+ `#ff5722`, CB `#01579b`  |
| Legal reading (sepia) | `sepia-*` | `--color-sepia-50/200/900` in `@theme` — legal pages only  |

Anything outside this table plus `primary/accent/spark/gray` counts as drift — fix it or add it
here with a reason (Impl 74 sweep baseline).

## Utilities

- `.radial-wash-primary` — soft brand radial wash behind info-page mastheads (About / Press /
  Contact / Creators). Do not hand-write `bg-[radial-gradient(...rgba(14,148,148...))]` again.

## Do

- Keep ~70% neutrals (white / `gray-50` / gray text) so cover art stays the hero.
- Use `primary-600` / `primary-700` for buttons, links, focus rings, active nav, filters.
- Use `accent-*` sparingly for NEW / Premium / unread / promo (`Button variant="accent"`).
- Use `spark-*` only for rare heat (Coins Best Value / sale urgency) — max one strong spark moment per screen.
- Prefer `.tag-accent` / `.tag-spark` utilities; change brand hue via `@theme` first.

## Don't

- Do not make magenta or coral the default CTA fill.
- Do not use `#69c9ca` as solid primary button fill.
- Do not replace semantic `danger` / `red-*` with spark coral.
- Do not recolor wallet vendor brands (KBZ / Wave / A+) or coin metallics to brand tokens.
- Do not paint full-page teal/pink washes (soft auth radial tint is the exception).
- Do not sprinkle spark on every badge.
- Do not use purple / indigo / violet / fuchsia as brand chrome.

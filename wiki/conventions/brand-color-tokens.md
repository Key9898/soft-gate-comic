---
title: Brand color tokens (logo-aligned)
type: convention
date: 2026-07-20
tags: [brand, theme, tailwind, colors]
---

# Brand color tokens

Source of truth: live logo [`public/logo/logo.jpg`](../../public/logo/logo.jpg) + `@theme` in [`src/index.css`](../../src/index.css).

## Mapping

| Brand role            | Token family | Hero stop                                       | Hex                   |
| --------------------- | ------------ | ----------------------------------------------- | --------------------- |
| Letter fill / main UI | `primary-*`  | `primary-400` (logo match), `primary-600` (CTA) | `#64c8c8` / `#0e9494` |
| Burst / highlight     | `accent-*`   | `accent-600`                                    | `#e63264`             |

## Do

- Use `primary-600` / `primary-700` for buttons, links, focus rings, active nav.
- Use `accent-*` sparingly for **premium / NEW badges**, **notification dots**, and **promo highlights**.
- Promo CTAs may use `Button variant="accent"`; default primary actions stay teal.
- Change brand hue via `@theme` only when possible (token-first).

## Don't

- Do not use purple / indigo / violet / fuchsia as brand or decorative chrome (cleaned in Phase 3 — use `primary-*` / `accent-*`).
- Do not make pink the default CTA fill (`variant="primary"` stays teal).
- Do not recolor gray page surfaces to teal/pink washes except soft auth chrome (`primary-50/100`).
- Do not replace focus rings or nav active states with accent.
- Wallet vendor brand colors (KBZ / Wave / A+) and semantic red/danger may remain.

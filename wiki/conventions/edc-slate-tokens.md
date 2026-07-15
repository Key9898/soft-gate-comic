---
title: EDC Slate Color Tokens
type: convention
date: 2026-07-07
tags: [tailwind, dark-mode, tokens]
---

# EDC Slate Color Tokens

## Valid `@theme` tokens (`src/index.css`)

These `edc-slate-*` classes **work** — they are defined in `@theme`:

| Token           | Use                                |
| --------------- | ---------------------------------- |
| `edc-slate-50`  | Light backgrounds                  |
| `edc-slate-100` | Light panels                       |
| `edc-slate-200` | Borders, dividers (light)          |
| `edc-slate-600` | Borders (dark), muted accents      |
| `edc-slate-700` | Dark surfaces (panels, cards)      |
| `edc-slate-800` | Dark canvas (page background)      |
| `edc-slate-900` | Avoid on large surfaces — too dark |

## NOT defined — do not use

| Invalid class   | Use instead |
| --------------- | ----------- |
| `edc-slate-300` | `slate-300` |
| `edc-slate-400` | `slate-400` |
| `edc-slate-500` | `slate-500` |

**Discovered in Impl Phase 32:** `dark:text-edc-slate-300` generated no CSS, so inactive category tabs fell back to `text-edc-slate-600` on dark backgrounds — nearly invisible.

## Rule

Before using `edc-slate-*` in a Tailwind class, verify the token exists in `src/index.css` `@theme`. If not, use default `slate-*` or add the token explicitly.

## Related

- [dark-mode-surfaces.md](dark-mode-surfaces.md)
- [Implementation Phase 32](../architecture/implementation-phases.md#impl-phase-32)

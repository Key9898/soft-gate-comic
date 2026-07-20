---
title: Default English + force light portal theme
type: note
date: 2026-07-20
tags: [i18n, theme, light-mode, tailwind]
---

# Default English + force light portal theme

## Decisions

1. **Default language = English** (`en`), not Myanmar (`mm`).
2. **Portal UI is light-only** — OS `prefers-color-scheme: dark` must not flip page chrome to dark.

## i18n (`src/lib/i18n/index.ts`)

| Setting               | Value                           | Why                                              |
| --------------------- | ------------------------------- | ------------------------------------------------ |
| `lng` / `fallbackLng` | `en`                            | First visit + missing keys → English             |
| Detection `order`     | `['localStorage']` only         | Do not auto-pick from browser/`navigator` locale |
| Cache                 | `localStorage` key `i18nextLng` | LanguageSwitcher still persists MM/EN choice     |

**Note:** Existing `localStorage.i18nextLng === 'mm'` still overrides until cleared or switched.

## Force light (`src/index.css`)

Tailwind v4 default `dark:` uses OS media query. Pages with many `dark:` classes (About, Coins, Profile, Library, Categories, info) went dark under OS dark while Home stayed light.

Fix:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

- `dark:` utilities only apply under an explicit `.dark` ancestor.
- Portal never sets `.dark` on `<html>` → all portal pages stay light.
- Also `html { color-scheme: light; }` for native form controls.

**Out of scope:** Reader local reading chrome (`darkMode` state in `ReaderPage`) is component-local styling, not the Tailwind `.dark` class — left intact.

## Related

- Convention: [portal-light-and-i18n-defaults.md](../conventions/portal-light-and-i18n-defaults.md)
- Supersedes OS-auto-dark behavior described in older [2026-07-06-tailwind-v4-dark-mode.md](2026-07-06-tailwind-v4-dark-mode.md) for the current portal

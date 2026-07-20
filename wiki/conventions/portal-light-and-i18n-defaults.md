---
title: Portal light theme and i18n defaults
type: convention
date: 2026-07-20
tags: [i18n, theme, light-mode, tailwind]
---

# Portal light theme and i18n defaults

## Language

- Default / fallback: **English** (`en`).
- Detection: **`localStorage` only** (`i18nextLng`) — never auto from `navigator`.
- Myanmar remains available via `LanguageSwitcher`.

## Theme

- Portal is **light-only**.
- Keep `@custom-variant dark (&:where(.dark, .dark *));` in `src/index.css` so OS dark mode does not activate `dark:` utilities.
- Do **not** put `class="dark"` on `<html>` / app shell.
- Existing `dark:` classes may remain (harmless while light-forced); do not rely on them for portal chrome.
- Reader in-panel reading dark toggle is separate (local state, not `.dark` on root).

## Do not

- Re-enable `navigator` in i18n detection without an explicit product decision.
- Remove `@custom-variant dark` without replacing it with another force-light strategy.
- Confuse EDC-era [dark-mode-surfaces.md](dark-mode-surfaces.md) (legacy immersive) with current Soft-Gate portal rules.

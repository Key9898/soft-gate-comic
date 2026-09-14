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

### Why the reader is the exception (Impl 220 / Phase 5)

The split is deliberate, not drift. Browsing a catalog and reading a comic are different
use scenes: the catalog is scanned in short bursts, usually in daylight, against covers
whose own colour does the work; a chapter is read for twenty minutes, often at night,
where a bright surround is the thing between the reader and the art. A light-only
catalog plus a dark-capable reading room serves both. That is why the reader carries a
persisted `darkMode` preference and the rest of the portal does not.

Consequences to keep in mind:

- The reader's own components (`ReaderSheet`, `ReaderSettingsSheet`, `ReaderEpisodeSheet`,
  `ReaderCompletePortal`, `ReaderAdSlot`, the paywall) must branch on `darkMode` for
  every colour they set, including muted text — `text-muted` is tuned for light
  surfaces only. Tokens are not theme-aware; the branch is.
- Shared components rendered inside the reader take a `darkMode` prop rather than
  reading a theme context, because there is no theme context by design.
- Do not extend `dark:` utilities to portal chrome to "match" the reader. The reader is
  a scene, not a theme.

Revisit this only as a deliberate product decision, not as a consistency clean-up.

## Do not

- Re-enable `navigator` in i18n detection without an explicit product decision.
- Remove `@custom-variant dark` without replacing it with another force-light strategy.
- Confuse EDC-era [dark-mode-surfaces.md](dark-mode-surfaces.md) (legacy immersive) with current SoftGate portal rules.

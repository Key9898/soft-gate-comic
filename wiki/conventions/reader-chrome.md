---
title: Reader chrome
type: convention
date: 2026-08-19
tags: [reader, chrome, prefs, softgate]
impl: 133
---

# Reader chrome

Episode reader chrome for `/read/:webtoonId/:episodeNumber`. Unpublished episodes still 404 as in [series-hub.md](series-hub.md).

## Episode sheet

Footer **Episode List** opens the existing `Modal` (`size="lg"`). It lists **published** episodes only, with Demo thumbs, title, and number. Locked premium rows (coins still required, wait not elapsed) show a lock icon. The current row has `aria-current`. Choosing a row calls `goToEpisode` and closes. A text **Back to series** link stays inside the sheet. Do not navigate away via the List control itself.

## Prefs

Device-level key `softgate_reader_prefs_v1`: `{ schemaVersion: 1, darkMode, brightness, fontSize, imageFit }`. Load on mount; write on change. Not auth-gated. Profile → Preferences writes the **same** key (reader strip, brightness, type size, image fit). Chip: this device. No portal light/dark toggle; language stays the header switcher. Cookies `dl` lists this row as **Reader display**. Do not add a second “Reading progress” row — progress stays in `softgate_engage_v1`.

## Keyboard

`ArrowLeft` / `ArrowRight` go prev/next when that published neighbor exists. Ignore when the target is `input`, `textarea`, `select`, or `contenteditable`, or when settings, comments, or the episode sheet is open.

## Gestures

Pure helpers in [`src/lib/reader/gestures.ts`](../../src/lib/reader/gestures.ts): `swipeEpisodeDelta`, `clampPinchScale`. Wired on `data-testid="reader-strip-stack"`.

- Swipe (touch/pen only; mouse keeps arrows): right → prev, left → next. `SWIPE_DX_MIN` 64, `SWIPE_DY_MAX` 48. Vertical or `|dy| > |dx|` is ignored.
- Same overlay/editable ignore as arrows.
- Pinch: CSS `transform: scale` on the strip wrapper (not font-size / img width), origin at the pinch midpoint, clamped `[1, 3]`. Double-tap resets to 1. Session-only — do not write `softgate_reader_prefs_v1`.
- After a swipe or pinch, do not toggle chrome via the main tap handler.
- Do not gate on `prefers-reduced-motion`. Guests keep gestures. Continue/history stays auth-only.

## Comments count

The header comments button shows `listComments(episodeCommentKey(webtoonId, episodeNum)).length` beside the icon. Zero is allowed.

## Image fit

Settings **Fit** keeps the strip stack at `max-w-2xl`. **Full width** is `w-full` on the strip stack. Do not scale `<img>` strips with font-size. Font-size may still style HUD and celebration text.

## Related

- [guest-access.md](guest-access.md) — Continue/history stays auth-only
- [series-hub.md](series-hub.md) — unpublished 404
- [legal-pages.md](legal-pages.md) — Cookies storage table

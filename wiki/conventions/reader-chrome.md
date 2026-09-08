---
title: Reader chrome
type: convention
date: 2026-08-19
tags: [reader, chrome, prefs, softgate, impl-165, impl-166, impl-167]
impl: 167
---

# Reader chrome

Episode reader chrome for `/read/:webtoonId/:episodeNumber`. Unpublished episodes still 404 as in [series-hub.md](series-hub.md).

## Episode sheet

Footer **Episode List** opens the existing `Modal` (`size="lg"`). It lists **published** episodes only, with Demo thumbs, title, and number. Locked premium rows (coins still required, wait not elapsed) show a lock icon. The current row has `aria-current`. Choosing a row calls `goToEpisode` and closes. A text **Back to series** link stays inside the sheet. Do not navigate away via the List control itself.

## Prefs

Mock and HTTP guests use device-level key `softgate_reader_prefs_v1`: `{ schemaVersion: 1, darkMode, brightness, fontSize, imageFit }`. Load on mount; write on change. Mock logged-in still uses this key. HTTP logged-in SoT is `/api/prefs` ([portal-prefs-http.md](portal-prefs-http.md)) — do not write the device key. Profile → Preferences writes the same mock key or POSTs the HTTP snapshot (reader strip, brightness, type size, image fit). Mock chip: this device. HTTP chip: this account. No portal light/dark toggle; language stays the header switcher. Cookies `dl` lists the device key as **Reader display**. Do not add a second “Reading progress” row — progress stays in `softgate_engage_v1`. While `authLoading`, do not write the device key. HTTP persist only after `prefsHydrated` and only when chrome differs from the snapshot.

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

## Image loading (Impl 165)

Live panels after catalog JSON: index **0** is `loading="eager"` plus `fetchPriority="high"` (LCP). Index **1** is eager without high. Index **2+** stay `loading="lazy"`. Every successful `<img>` uses `decoding="async"` and `h-auto w-full`. Prefetch of URLs 3–5 and per-panel Retry stay.

## Panel sizes (Impl 166)

Optional `Episode.imageSizes?: Array<{ width: number; height: number } | null>`. Keep `images: string[]`. Demo omits `imageSizes`. `panelPixelSize` sets HTML `width`/`height` only when the array length matches `images` and that index has both finite integers **> 0**. Catalog `isLoading` skeleton still has no guessed strip height (`aspect-ratio` / `h-[60vh]`). Admin **Impl 27** persists sizes (wiki item 21). Impl **167** keeps a schema-matching stored catalog (`applyCatalogSeed` is identity) so those sizes survive a typical portal load. CLS ≤ 0.1 is **not** claimed until QA measures a Reader episode that has persisted sizes. Do not claim from Demo `/read/1/1`. Canonical Admin list: [`website-integration.md`](../../../soft-gate-comic-admin-dashboard/wiki/references/website-integration.md) item 21.

## Related

- [guest-access.md](guest-access.md) — Continue/history stays auth-only
- [series-hub.md](series-hub.md) — unpublished 404
- [legal-pages.md](legal-pages.md) — Cookies storage table
- [portal-prefs-http.md](portal-prefs-http.md) — HTTP logged-in reader prefs

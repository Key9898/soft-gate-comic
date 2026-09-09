---
title: Reader chrome
type: convention
date: 2026-08-19
updated: 2026-09-09
tags: [reader, chrome, prefs, softgate, impl-165, impl-166, impl-167, impl-199]
impl: 199
---

# Reader chrome

Episode reader chrome for `/read/:webtoonId/:episodeNumber`. Unpublished episodes still 404 as in [series-hub.md](series-hub.md).

## Layout

[`ReaderLayout`](../../apps/portal/src/layouts/ReaderLayout.tsx) is `min-h-screen` with **no** page background — the reader paints `bg-gray-950` / `bg-gray-50`. Brightness is a `fixed` black overlay at **`z-40`**. Header and footer stay **`z-50`**. Do not put brightness at `z-[100]`.

When chrome is visible, `main` keeps `pt-20 pb-16` (`md:pt-24`). When chrome is hidden, padding drops to `pt-2 pb-2`. The strip stack has `gap-0` and **no** `rounded-2xl` / `shadow-xl` on the art.

Header close and settings are `min-h-11`. Header/footer enter is forced product motion — do not gate on `prefers-reduced-motion`.

## Episode sheet

Footer **Episode List** opens [`ReaderSheet`](../../apps/portal/src/features/reader/components/ReaderSheet.tsx) (mobile bottom sheet / `md+` right drawer), not `Modal`. Pass `darkMode`. It lists **published** episodes only, with Demo thumbs, title, and number. **First** / **Last** jump the published min/max. Locked premium rows show a lock icon. The current row has `aria-current`. Choosing a row calls `goToEpisode` and closes. A text **Back to series** link stays inside the sheet. Do not navigate away via the List control itself.

Settings use the same sheet: light/dark, brightness, Fit/Full. Font-size stays on Profile → Preferences — do not expose it in the reader. Unselected light-mode buttons use gray borders, not `border-white/5`.

## Prefs

Mock and HTTP guests use device-level key `softgate_reader_prefs_v1`: `{ schemaVersion: 1, darkMode, brightness, fontSize, imageFit }`. Load on mount; write on change. Mock logged-in still uses this key. HTTP logged-in SoT is `/api/prefs` ([portal-prefs-http.md](portal-prefs-http.md)) — do not write the device key. Profile → Preferences writes the same mock key or POSTs the HTTP snapshot (reader strip, brightness, type size, image fit). Mock chip: this device. HTTP chip: this account. No portal light/dark toggle; language stays the header switcher. Cookies `dl` lists the device key as **Reader display**. Do not add a second “Reading progress” row — progress stays in `softgate_engage_v1`. While `authLoading`, do not write the device key. HTTP persist only after `prefsHydrated` and only when chrome differs from the snapshot.

## Keyboard

`ArrowLeft` / `ArrowRight` go prev/next when that published neighbor exists. Ignore when the target is `input`, `textarea`, `select`, or `contenteditable`, or when settings, comments, or the episode sheet is open. Desktop (`md+`) also has side prev/next chevrons.

## Gestures

Pure helpers in [`src/lib/reader/gestures.ts`](../../apps/portal/src/lib/reader/gestures.ts): `swipeEpisodeDelta`, `clampPinchScale`, `clampPanOffset`. Wired on `data-testid="reader-strip-stack"`.

- Swipe (touch/pen only; mouse keeps arrows): right → prev, left → next. `SWIPE_DX_MIN` 64, `SWIPE_DY_MAX` 48. Vertical or `|dy| > |dx|` is ignored.
- Same overlay/editable ignore as arrows.
- Pinch: CSS `transform: translate + scale` on the strip wrapper (not font-size / img width), origin at the pinch midpoint, scale clamped `[1, 3]`. When scale > 1, one-finger drag pans (`clampPanOffset`). Swipe episode is off while zoomed or while panning. Double-tap resets scale **and** pan to 0. Session-only — do not write `softgate_reader_prefs_v1`.
- After a swipe, pinch, or pan, do not toggle chrome via the main tap handler.
- Do not gate on `prefers-reduced-motion`. Guests keep gestures. Continue/history stays auth-only.

## Comments count

The header comments button shows the live thread length (all rows, including replies) from `useCommentsThread` — the same list as the last-panel teaser and `CommentsSheet`. Do not call `listComments()` as a second source of truth (HTTP mode would stay 0). Zero is allowed. Overlay title is `readerPage.episodeComments`. Locked premium episodes keep comments chrome.

## Image fit

Settings **Fit** keeps the strip stack at `max-w-2xl`. **Full width** is `w-full` on the strip stack. Do not scale `<img>` strips with font-size. Font-size may still style HUD and celebration text.

## Ads (Impl 199)

In-flow Demo slots only — never overlay, splash, autoplay, or an ad network. Label Advertisement + Demo. Locked / empty episodes have none.

- **End:** after the last panel, before chapter-end. Always when panels exist.
- **Mid:** only when `images.length >= 6`, after index `Math.floor(n / 2) - 1` (`readerMidAdAfterIndex`). Demo `/read/1/1` has four panels → end only.

## Chapter-end

Quiet complete card (no party emoji / bounce). Rating, comments teaser, creator-note Demo, next episode or same-genre related (hub filter, max 6, hide when empty), guest nudge, episode report. Report is `softgate_episode_reports_v1` (`id:n`), auth + confirm, no API. Share copies locale-prefix-free `/read/:id/:n`. Footer shows published `n / total` and catalog `likeCount` (Demo, same honesty as the hub).

Clicks inside the complete card `stopPropagation` so they do not toggle chrome.

## Image loading (Impl 165)

Live panels after catalog JSON: index **0** is `loading="eager"` plus `fetchPriority="high"` (LCP). Index **1** is eager without high. Index **2+** stay `loading="lazy"`. Every successful `<img>` uses `decoding="async"` and `h-auto w-full`. Prefetch of URLs 3–5 and per-panel Retry stay.

## Panel sizes (Impl 166)

Optional `Episode.imageSizes?: Array<{ width: number; height: number } | null>`. Keep `images: string[]`. Demo omits `imageSizes`. `panelPixelSize` sets HTML `width`/`height` only when the array length matches `images` and that index has both finite integers **> 0**. Catalog `isLoading` skeleton reserves `min-h-[50dvh]` as **loading chrome**, not a guessed panel aspect. CLS ≤ 0.1 is **not** claimed until QA measures a Reader episode that has persisted sizes. Do not claim from Demo `/read/1/1`. Canonical Admin list: [`website-integration.md`](../../../soft-gate-comic-admin-dashboard/wiki/references/website-integration.md) item 21.

## Related

- [guest-access.md](guest-access.md) — Continue/history stays auth-only; share is open; report is gated
- [series-hub.md](series-hub.md) — unpublished 404
- [legal-pages.md](legal-pages.md) — Cookies storage table
- [portal-prefs-http.md](portal-prefs-http.md) — HTTP logged-in reader prefs
- [forced-product-motion.md](forced-product-motion.md) — header/footer and ReaderSheet enter

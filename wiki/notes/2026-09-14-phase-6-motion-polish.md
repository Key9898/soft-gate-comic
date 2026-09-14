---
title: Impl 219 — Phase 6 motion and polish
type: note
date: 2026-09-14
tags: [motion, performance, polish, reader, coins, portal, softgate]
impl: 219
---

# Impl 219 — Phase 6 motion and polish

Phase 6 of the [UI/UX improvement plan](2026-09-14-uiux-improvement-plan.md), GitHub epic #23. The last phase that could be done without a product decision.

## Motion that was costing frames

**The reading progress bar animated `width`.** It updates on every scroll event, and animating `width` relayouts the bar each frame. `@utility progress-bar` now animates `transform` with `transform-origin: left center`, and `ReaderPage` sets `scaleX()` instead of a percentage width. This was the Impeccable detector's one genuine finding out of four.

Verified live: computed `transition-property: transform`, inline `transform: scaleX(0)`.

**`CoinPackageCard` ignored reduced motion for its hover transform.** The component already consulted `prefersReducedMotion` two lines below, for its shimmer — the `whileHover={{ scale: 1.03, y: -4 }}` and `whileTap` did not. Both are now gated.

## Things that were quietly broken

**`fetchPriority` was dropped on every reader panel.** React 18 does not accept the camelCase prop on `<img>`: it warns once per panel image and discards the hint, so the LCP priority never reached the browser. Passing `fetchpriority` lowercase lets it through. Verified on a fresh tab: the attribute is on the DOM and the console is empty.

**The library progress bar could render zero-width.** `getProgressWidthClass` fell back to `` `w-[${progress}%]` `` — an interpolated class Tailwind's JIT never emits. Any value that missed the rounding map produced no width class at all. The input is clamped and the fallback is a real `w-0`.

**The brightness scrim sat under the chrome.** Scrim at `z-40`, toolbars at `z-50`, so at 25% brightness the toolbars stayed fully bright over a near-black page and read as a rendering fault. The scrim is `z-[60]`.

**The reader's prev/next chevrons were near-invisible.** ~16px glyphs on `bg-gray-950/50` over a near-black page — in dark mode, which is the reader's default. They now carry an opaque plate, a ring and a shadow.

**A title-less `Modal` had no accessible name.** `aria-labelledby` was set only when `title` was passed. There is an `ariaLabel` prop for that case.

**The checkout modal header had no way out.** The only exits were the footer Cancel, the backdrop, and Escape — and Escape is suppressed while processing, and on step 1 the footer is a lone Cancel. There is a header close now, disabled during processing.

**Ledger digits jumped row to row.** `TransactionHistoryRow` amounts and running balances are `tabular-nums`.

**Below-the-fold imagery loaded eagerly.** `loading="lazy"` + `decoding="async"` on catalog covers, comment avatars, library and search thumbs, and the episode sheet. Logos, auth art and the first reader panel stay eager.

## Two more review findings that did not survive

That makes six across the six phases. Both of this phase's headline items were wrong.

**"Replace `CatalogBusyPanel` — `SkeletonBookCard` already exists and is unused, and the single pulsing circle causes compounding CLS."**

`SkeletonBookCard` is unused on catalog surfaces **on purpose**. [loading-states](../conventions/loading-states.md) (Impl 210) says, in as many words: _"Do not paint `SkeletonBookCard` grids, rank marks, Daily lip cards, Continue covers, Hero 3:4 bones, Search 6/12 cards…"_ — because painting six card bones claims six titles exist before the catalog has answered. `SkeletonStates.test.tsx` enforces it with `expectNoInventoryBones`. The convention knowingly trades layout stability for not inventing inventory. Reserving a guessed height would be the same lie in a different unit, so `CatalogBusyPanel` is unchanged.

**"19 images missing `width`/`height` — CLS risk on the primary card component."**

Checked each. `BookCard`'s image is `absolute inset-0 h-full w-full` inside a `book-media aspect-[3/4]` box; the library cover is `h-full w-full` inside a fixed `h-22 w-16`; avatars are `shape-circle h-10 w-10`. The boxes are pinned by CSS, so there is no shift to prevent and the attributes would be redundant. The genuinely useful half of the finding — lazy loading — is done above.

## Verification

`pnpm check` green: 0 lint errors (16 pre-existing warnings), prettier clean, 774 portal + 165 API tests, both builds.

Live at `/read/3/1`: progress bar transitions `transform` with an inline `scaleX`, `fetchpriority="high"` is on the first panel, and a fresh tab logs nothing to the console.

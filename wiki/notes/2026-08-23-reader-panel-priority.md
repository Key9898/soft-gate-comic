---
title: Impl 165 — Reader first-panel fetchpriority + async decode
type: note
date: 2026-08-23
tags: [reader, lcp, fetchpriority, decoding, softgate]
impl: 165
---

# Impl 165 — Reader first-panel fetchpriority + async decode

Portal-only live strip hints (track A). Catalog `isLoading` still paints chrome-only `ReaderSkeleton`. This does **not** make CLS ≤ 0.1. Dimensions with Admin stay **166**.

## What shipped

- Panel 0: `loading="eager"` + `fetchPriority="high"`.
- Panel 1: eager, no high (does not contend with LCP).
- Panel 2+: `loading="lazy"`.
- Every successful `<img>`: `decoding="async"`, `className="block h-auto w-full"`.
- No `width`/`height` attributes. No guessed skeleton strip height. Prefetch `urls.slice(2, 5)` and Retry unchanged.

## Files

- `src/features/reader/ReaderPage.tsx`
- `src/test/ReaderChrome.test.tsx`
- `wiki/conventions/reader-chrome.md`
- `wiki/notes/2026-08-23-reader-panel-priority.md` (this note)
- `wiki/architecture/implementation-phases.md`
- `wiki/README.md`, `wiki/00-overview.md`, `wiki/02-workflow.md`

## Verify

`npx vitest run src/test/ReaderChrome.test.tsx src/test/SkeletonStates.test.tsx src/test/ReaderGuestNudge.test.tsx` then `npm run check` if the tree allows.

## Next

Impl **167**. Genre overflow chevron and guessed strip bones stay parked. Admin measure/save is Admin item 21 code (not this repo).

## Related

- [reader-chrome.md](../conventions/reader-chrome.md)
- [loading-states.md](../conventions/loading-states.md)
- [2026-08-22-search-reader-skeleton-chrome.md](2026-08-22-search-reader-skeleton-chrome.md) (162)

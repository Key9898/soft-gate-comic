---
title: Impl 164 — Categories skeleton live chrome
type: note
date: 2026-08-22
tags: [skeleton, loading, categories, ranking, chrome, catalog, softgate]
impl: 164
---

# Impl 164 — Categories skeleton live chrome

Polish of the 155b Categories skeleton. Catalog `isLoading` stays the trigger. Search 162/163 and Reader strip stay untouched. No overflow chevron.

## Chrome

URL-known chrome paints live from `getBrowseMasthead` in `src/features/categories/browseMasthead.ts` (same helper as the live page):

- Ranked: `radial-wash-primary` at `inset-0`, `categories.rankingEyebrow` (“Numbered chart”), h1 `home.ranking` (“Popular”).
- Other sort jobs: New / Recently Updated / Highest Rated title + deck + icon.
- Browse all-genre: `categories.browseByGenre`. Genre slug with unknown name: **title bone**, not a Browse-by-Genre lie. Deck stays `browseDesc`.
- Status chips and sort stay live via `catalogHref`. Garbage `?status=` whitelists to `all` on live and skeleton.

Bones: **8** genre chip slots (`flex-nowrap`, `scrollbar-hide`, **no** chevron). Count line reserved. **24** `SkeletonBookCard` with `rankOnPage` when ranked. No pager. No empty Search / Go here (loading ≠ empty).

Busy islands wrap genre bones and the grid only — not masthead, status, or sort. Outer page is not a full-page `SkeletonSection`.

## Files

- `src/features/categories/browseMasthead.ts`
- `src/features/categories/CategoriesPage.tsx`
- `src/features/categories/components/CategoriesPageSkeleton.tsx`
- `src/test/SkeletonStates.test.tsx`
- `wiki/conventions/loading-states.md`
- `wiki/conventions/categories-browse.md`
- `wiki/notes/2026-08-22-categories-skeleton-chrome.md` (this note)
- `wiki/architecture/implementation-phases.md`
- `wiki/README.md`, `wiki/00-overview.md`, `wiki/02-workflow.md`

## Verify

`npx vitest run src/test/SkeletonStates.test.tsx src/test/CategoriesRanking.test.tsx src/test/CategoriesBrowse.test.tsx` then `npm run check` if the tree allows.

## Next

Impl **166**. Optional per-panel width/height with Admin. Genre overflow chevron and guessed strip bones stay parked.

## Later (Impl 169)

Reserved inert genre-rail chevron slot on Categories / Home Genres / Search landing. Skeletons still have no working Show more genres button. Continue rail still conditional.

## Related

- [loading-states.md](../conventions/loading-states.md)
- [categories-browse.md](../conventions/categories-browse.md)
- [2026-08-22-search-query-skeleton-chrome.md](2026-08-22-search-query-skeleton-chrome.md) (163)

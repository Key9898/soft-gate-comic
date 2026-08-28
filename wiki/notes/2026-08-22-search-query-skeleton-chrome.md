---
title: Impl 163 — Search query live chrome
type: note
date: 2026-08-22
tags: [skeleton, loading, search, query, chrome, catalog, softgate]
impl: 163
---

# Impl 163 — Search query live chrome

Polish of the 155b / 162 Search **hasQuery** skeleton. Catalog `isLoading` stays the trigger. Landing 162, Categories wash/chevron, Reader strip, and 161 stay untouched.

## Query chrome

URL-known chrome paints live: `SEO` `resultsFor`, h1, `SearchAutocomplete` with `defaultQuery`, Clear X, three tabs **without** `(N)`, status chips, All genres, sort. Named genre chips are **8** reserved `flex-wrap` slots (`GENRE_SKELETON_CAP`). Results heading is `t('search.resultsFor', { query })` with **no** leading count.

Result bones: `QUERY_WEBTOON_CARD_CAP` **12** cards, or `QUERY_HIT_ROW_CAP` **6** author / episode rows — reserved caps, not promised hits. Do not paint `SearchNoResults` / Go here / Popular recover during load.

`SkeletonSection` wraps named-genre bones and the result list only. The working search field, tabs, status, All genres, and sort stay outside `aria-busy`.

Shared URL parse / patch lives in `src/features/search/searchParams.ts` (`tab` / `status` whitelist garbage → default). Input classes live beside destinations.

## Files

- `src/features/search/searchParams.ts`
- `src/features/search/searchDestinations.ts`
- `src/features/search/SearchPage.tsx`
- `src/features/search/components/SearchPageSkeleton.tsx`
- `src/test/SkeletonStates.test.tsx`
- `wiki/conventions/loading-states.md`
- `wiki/notes/2026-08-22-search-query-skeleton-chrome.md` (this note)
- `wiki/architecture/implementation-phases.md`
- `wiki/README.md`, `wiki/00-overview.md`, `wiki/02-workflow.md`

## Verify

`npx vitest run src/test/SkeletonStates.test.tsx src/test/SearchDestination.test.tsx src/test/SearchAutocomplete.test.tsx src/test/A11yStructure.test.tsx` then `npm run check` if the tree allows.

## Next

Impl **165**. Genre overflow chevron and reader strip aspect-ratio stay parked.

## Related

- [loading-states.md](../conventions/loading-states.md)
- [2026-08-22-search-reader-skeleton-chrome.md](2026-08-22-search-reader-skeleton-chrome.md) (162)

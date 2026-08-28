---
title: Impl 162 — Search landing live chrome + Reader chrome
type: note
date: 2026-08-22
tags: [skeleton, loading, search, reader, chrome, catalog, softgate]
impl: 162
---

# Impl 162 — Search landing live chrome + Reader chrome

Polish of 155b Search / Reader skeletons. Catalog `isLoading` stays the trigger. Categories, query-result 12-card bones, 155a, and 161 stay untouched.

## Search landing (no query)

Chrome that does not need `/api/data` paints live: `SEO`, h1, `SearchAutocomplete`, demo chips (`DEMO_SEARCH_CHIPS`), recent from `getRecentSearches()` (or live `search.noRecent`), Go here destinations. Genre **heading** live; **8** reserved chip bones (no overflow chevron). Popular / New Releases headings and View all `Link`s live; cards are `DISCOVERY_RAIL_CAP` (**6**) each.

Do **not** wrap the working search field in `SkeletonSection`. Only genre chips and rail **cards** sit in `role="status"`. Do not paint live `HomeCatalogRail` titles during load.

Shared `SEARCH_DESTINATIONS` / `SEARCH_DEST_LINK` live in `src/features/search/searchDestinations.ts` so page and skeleton cannot drift.

Query `hasQuery` skeleton stays a full-page `SkeletonSection` (copy-less bones). The 12-card grid is a reserved cap, not “12 results exist.”

## Reader chrome

`ReaderSkeleton` matches live header/footer from `loadReaderPrefs()` once (default dark). Close is a native `<a href=/webtoon/:id>` when `webtoonId` is set (no `Link`, so `renderPlain` needs no router). Title stack is two `SkeletonText` bones. Settings / comments / like / bookmark / list are inert. Prev / next disabled. Progress fill `0%`. Main column width follows `imageFit`; **no** strip height guess (`aspect-ratio` / `h-[60vh]` stay parked). Static chrome; pulse on bones only.

## Files

- `src/features/search/searchDestinations.ts`
- `src/features/search/components/SearchPageSkeleton.tsx`
- `src/features/search/SearchPage.tsx`
- `src/features/reader/components/ReaderSkeleton.tsx`
- `src/features/reader/ReaderPage.tsx`
- `src/test/SkeletonStates.test.tsx`
- `wiki/conventions/loading-states.md`
- `wiki/notes/2026-08-22-search-reader-skeleton-chrome.md` (this note)
- `wiki/architecture/implementation-phases.md`
- `wiki/README.md`, `wiki/00-overview.md`, `wiki/02-workflow.md`

## Verify

`npx vitest run src/test/SkeletonStates.test.tsx src/test/SearchDestination.test.tsx src/test/SearchAutocomplete.test.tsx src/test/ReaderChrome.test.tsx src/test/A11yStructure.test.tsx` then `npm run check` if the tree allows. Do not mass-format unrelated CRLF dirt.

## Next

Impl **164**. Categories wash/chevron and reader strip aspect-ratio stay parked. Search query chrome landed in 163.

## Later (Impl 169)

Search landing genre rail reserves an inert chevron slot and uses live overflow classes. hasQuery wrap still has no this slot. Reader strip height stays unguessed.

## Related

- [loading-states.md](../conventions/loading-states.md)
- [2026-08-21-account-skeleton-triggers.md](2026-08-21-account-skeleton-triggers.md) (161)
- [2026-08-21-skeleton-production-contract.md](2026-08-21-skeleton-production-contract.md) (155b)

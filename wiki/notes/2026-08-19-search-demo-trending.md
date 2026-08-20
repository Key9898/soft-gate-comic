---
title: Search Demo searches chips
type: note
date: 2026-08-19
tags: [search, discovery, honesty, softgate]
impl: 145
---

# Impl 145 — Search Demo searches

Empty `/search` adds a **Demo searches** row above Browse genres. Chips are a frozen list in `src/lib/search/demoSearches.ts`. Click runs `?q=` (same as recent). Copy says they are example queries, not live trends. Heading is not Trending Searches.

Browse genres, recent, Go here, Popular, and New stay. Home Trending (`weeklyViewCount`) is unchanged. Daily, wait-for-free, and Author Follow are not in this Impl.

## Verify

`npx vitest run src/test/SearchDestination.test.tsx src/test/searchLib.test.ts src/test/SearchAutocomplete.test.tsx src/test/SkeletonStates.test.tsx`

## Next

Impl **146**.

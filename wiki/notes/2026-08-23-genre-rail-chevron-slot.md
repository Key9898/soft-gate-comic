---
title: Impl 169 — Reserved genre-rail chevron slot
type: note
date: 2026-08-23
tags: [categories, home, search, skeleton, chevron, overflow, softgate]
impl: 169
---

# Impl 169 — Reserved genre-rail chevron slot

Right genre chevron no longer mounts/unmounts. `GenreRailChevron` always occupies the min-size slot. The Show more genres button paints only when `canScrollRight`. Skeletons always use the inert slot (`data-testid="genre-rail-chevron-slot"`) and never that button.

Home Continue rail still mounts/unmounts (`canScrollContinueRight`). Search hasQuery genre wrap has no this slot. Guessed Reader strip bones stay parked. CLS ≤ 0.1 is **not** claimed.

## Surfaces

- Categories live + skeleton (`size="md"`, `min-h-11`)
- Home `Genres:` live + skeleton (`size="sm"`)
- Search landing `!query` live + skeleton (`size="sm"`); landing skeleton uses live overflow classes

## Files

- `src/components/GenreRailChevron.tsx`
- `src/features/categories/CategoriesPage.tsx`
- `src/features/categories/components/CategoriesPageSkeleton.tsx`
- `src/features/home/HomePage.tsx`
- `src/features/home/components/HomePageSkeleton.tsx`
- `src/features/search/SearchPage.tsx`
- `src/features/search/components/SearchPageSkeleton.tsx`
- `src/test/GenreRailChevron.test.tsx`
- `src/test/SkeletonStates.test.tsx`

## Next

Impl **170**. Continue rail chevron still conditional. Guessed strip bones parked.

## Related

- [categories-browse.md](../conventions/categories-browse.md)
- [loading-states.md](../conventions/loading-states.md)

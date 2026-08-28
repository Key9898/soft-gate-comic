---
title: Impl 159 — Match Home hero skeleton chrome
type: note
date: 2026-08-21
tags: [skeleton, loading, hero, banner, home, softgate]
impl: 159
---

# Impl 159 — Match Home hero skeleton chrome

Home hero skeleton now uses the same always-on brand chrome as live `HeroSpotlight`. Catalog rails stay white. Daily (158) and Continue / For You are untouched.

## Contract

- Two layers before `.hero-landscape-adjust`: static `/banner/banner.png` (`bg-cover bg-center`) plus `from-gray-950/70 via-gray-950/30 to-gray-950/45`.
- `bg-gray-950` lives on the **banner node** as fallback only. The hero `<section>` is not a solid black fill and not a white band.
- Copy column is `relative z-10`. Book stays a flat `book-media` bone (`tone="dark"`). Do not mount `HeroBook3D`.
- Do not add Pause / Next extra circles in this Impl.

## Files

- `src/features/home/components/HomePageSkeleton.tsx`
- `src/test/SkeletonStates.test.tsx`
- `wiki/conventions/loading-states.md`
- `wiki/conventions/hero-spotlight.md` (one-liner)
- `wiki/notes/2026-08-21-hero-skeleton-chrome.md` (this note)
- `wiki/architecture/implementation-phases.md`
- `wiki/README.md`, `wiki/00-overview.md`, `wiki/02-workflow.md`

## Verify

`npm run check`. This Impl’s `src/` diff is `HomePageSkeleton.tsx` + `SkeletonStates.test.tsx` only.

## Next

Impl **161**. Pause / Next extra skeleton circles stay out unless asked. Home Continue / For You skeleton split locked in 160.

## Related

- [loading-states.md](../conventions/loading-states.md)
- [hero-spotlight.md](../conventions/hero-spotlight.md)
- [2026-08-21-page-skeletons-match-live.md](2026-08-21-page-skeletons-match-live.md) (155a bones)
- [2026-08-21-daily-skeleton-cap.md](2026-08-21-daily-skeleton-cap.md) (158)
- [2026-08-21-home-skeleton-auth-rails.md](2026-08-21-home-skeleton-auth-rails.md) (160)

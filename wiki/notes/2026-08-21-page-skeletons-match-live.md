---
title: Impl 155 — Page skeletons match live layout (155a layout)
type: note
date: 2026-08-21
tags: [skeleton, loading, home, hub, library, author, 155a, softgate]
impl: 155
---

# Impl 155 — Page skeletons match live layout (155a layout)

**Same-day pass A (155a).** Frontmatter stays `impl: 155`. The later same-day pass is **155b** ([production contract](2026-08-21-skeleton-production-contract.md)). Docs truth: [2026-08-21-skeleton-docs-truth.md](2026-08-21-skeleton-docs-truth.md).

This pass mirrored live Home, series hub, Library, and Author layouts. No loading page. Nav + Footer stay. Daily / Updated / New selectors and CMS are unchanged. Primitive was `animate-pulse`.

The original hub bullet listed **one other-works rail**. That line is **stale**. After 155b, current code omits Other works / You may also like (`length > 0` gated). Do not re-add that rail from this note.

## What shipped

- `SkeletonDailyDropCard` — cover + bottom lip + episode/time lines (not `SkeletonBookCard`).
- Home skeleton is the guest shape: dark hero pair (flat cover, no `HeroBook3D`), 16 genre chips, Start here, Ranking + View all, Trending, Daily (7 weekday chips + 6 lip tiles), Updated, New, CTA. Omit Continue and For You.
- Hub skeleton: 6 stats, `hub-next-drop-slot`, rating height, 3 CTAs, 3 episode tabs, bordered episode list, comments bones. **No** Other works / You may also like (as shipped after 155b). Live `hub-next-drop` / `hub-comments` test ids are not reused.
- Library: 3 tabs + compact BookCard bones. Author: works heading + `SkeletonBookCard` grid.

## Files

- `src/components/Skeleton/{Skeleton.tsx,index.ts}`
- `src/features/home/components/HomePageSkeleton.tsx`
- `src/features/webtoon/components/WebtoonDetailSkeleton.tsx`
- `src/features/library/components/LibraryPageSkeleton.tsx`
- `src/features/author/components/AuthorPageSkeleton.tsx`
- `src/test/SkeletonStates.test.tsx`

## Verify

`npm run check` — **506** tests at ship; later **511** after 155b/156.

## Next

Impl **158** — free (157 locked docs to current code)

## Related

- [2026-08-21-hero-skeleton-chrome.md](2026-08-21-hero-skeleton-chrome.md) — Impl 159 Home hero skeleton chrome

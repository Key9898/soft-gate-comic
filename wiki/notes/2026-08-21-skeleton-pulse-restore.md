---
title: Impl 156 — Restore skeleton pulse, remove sheen
type: note
date: 2026-08-21
tags: [skeleton, loading, pulse, sheen-removed, softgate]
impl: 156
---

# Impl 156 — Restore skeleton pulse, remove sheen

Sheen (`skeleton-sheen` / `coverSheenClass`) is removed. Skeleton bones and cover-load overlays use Tailwind `animate-pulse` again.

**155a** section order (guest Home, Daily lip, hub comments, Library/Author bones) is unchanged. **155b** extras stayed: CatalogStatus, cover `imageLoaded` setters, Profile / Coins / Notifications / Reader skeletons, Categories/Search extras, reader prefetch. Docs map: [2026-08-21-skeleton-docs-truth.md](2026-08-21-skeleton-docs-truth.md).

## Why

155a locked pulse. 155b swapped the primitive to a Facebook-style sheen and exported `coverSheenClass`. That export then vanished from the barrel while `BookCard` / `DailyDropCard` still imported it → Vite ESM `SyntaxError` → white screen. Plan-pure lock is pulse, not sheen.

## What shipped

- `Skeleton` is `animate-pulse rounded-2xl` + tone fill. No `coverSheenClass`, no `SkeletonLibraryCard`.
- Barrel exports: `Skeleton`, `SkeletonText`, `SkeletonBookCard`, `SkeletonDailyDropCard`, `SkeletonSection`, `SkeletonTone`.
- BookCard, DailyDropCard, HeroBook3D, Author avatar overlays: `animate-pulse bg-gray-200`.
- `src/index.css`: sheen keyframes and `.skeleton-sheen*` rules deleted. Reduce/print still kill `.animate-pulse`. `skeleton-appear` 200ms stays.
- Convention [loading-states.md](../conventions/loading-states.md) documents pulse as canonical.

## Not in this Impl

Home / hub / Library / Author section order. Guest vs Continue / For You. Daily 6-pack vs Demo 1–3. Profile / Coins / Notifications. Categories / Search / Reader. Daily / CMS / selectors.

## Files

- `src/components/Skeleton/{Skeleton.tsx,index.ts}`
- `src/components/BookCard/BookCard.tsx`
- `src/features/home/components/DailyDropCard.tsx`
- `src/components/HeroBook3D/HeroBook3D.tsx`
- `src/features/author/AuthorPage.tsx`
- `src/index.css`
- `wiki/conventions/loading-states.md`

## Verify

`npm run check` — **511** tests. Hard-refresh or restart `npm run dev` so Vite is not serving a stale barrel.

## Next

Impl **157** locked docs. Following free number: **158**.

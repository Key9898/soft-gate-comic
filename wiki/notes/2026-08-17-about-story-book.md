---
title: About Our Story readable book
date: 2026-08-17
impl: 87
type: note
tags: [about, storybook, herobook3d, shared, a11y, softgate]
---

# About Our Story readable book (Impl 87)

Plan drafted as Impl 86; 86 was taken by Home book-enter-from-copy. This work is **Impl 87**.

## Why

The Impl 85 HeroBook3D beside icon-row copy left a canyon and a hero pose that did not belong in an editorial section. Our Story is now the book: an open spread with a pager.

## What shipped

- `StoryChapter` + `mockStoryChapters` (6 published, 1 unpublished) in `@softgate/shared` — **not** on `SharedData`; schema stays **4**
- `getPublishedStoryChapters()` in `src/lib/info/storyChapters.ts`
- About-only `StoryBook`: paper spread, chapter 1 flat `story-cover.svg` plate, Prev/Next without wrap, keyboard when focused
- Removed `HeroBook3D` from About. Home/Detail unchanged. No 3D flip / `hero-book-enter`
- i18n chrome keys; deleted `about.storyP1`–`storyP3`

## Tests

- `storyChapters.test.ts` — 6 published, unpublished dropped
- `StoryBook.test.tsx` — pager, cover, arrows, no link / no hero-book-scene
- `AboutPage.test.tsx` — heading + pager + origin copy; no HeroBook3D; root not `overflow-hidden`

## Files

- `packages/shared/src/types.ts`, `packages/shared/src/data.ts`
- `src/lib/info/storyChapters.ts`
- `src/features/info/components/StoryBook/`
- `src/features/info/AboutPage.tsx`
- `src/index.css` (`.story-book-*` only)
- `src/lib/i18n/locales/en/translation.json`, `mm/translation.json`
- `src/test/StoryBook.test.tsx`, `src/test/AboutPage.test.tsx`, `src/test/storyChapters.test.ts`

## Verify

`npm run check`

## Next

Impl **88**

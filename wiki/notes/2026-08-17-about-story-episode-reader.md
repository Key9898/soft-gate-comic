---
title: About Our Story episode reader
date: 2026-08-17
impl: 94
type: note
tags: [about, storybook, episode-reader, softgate]
---

# About Our Story episode reader (Impl 94)

Impl 87–93 tried to make Our Story read as a CSS 3D open hardcover. The object stayed a flat card or a detached cover. This Impl **replaces** that module in place with the locked episode-list + cream reader mock.

## What shipped

- `StoryBook.tsx` rewritten in the same folder/export. No `StoryReader` twin. No Verso/Recto/flip.
- Every `.story-book-*` rule deleted from `src/index.css`. Only `.story-reader-*` added. `.hero-book-*` untouched.
- Optional `StoryChapter.coverImage`. Origin only: `/about/our-story-splash.jpg`. Splash renders iff the field is set.
- i18n: `storyChapterOf` retargeted to Episode n of total; added `storyEpisodes` / `storyNowReading`; `a11y.storyBook` = Our Story; removed unused `about.storyPrev` / `storyNext`.
- Schema stays 4. Six published chapter bodies unchanged. `story-cover.svg` left on disk for BookCard/HeroBook3D tests.

## Tests

- `StoryBook.test.tsx` — reader rail, splash on ep 1 gone after Next, no wrap, focused arrows, empty → null, no `.story-book-*` / HeroBook3D
- `AboutPage.test.tsx` — region + origin copy; no `story-cover.svg` in the story section; page root not `overflow-hidden`

## Verify

`npm run check`

## Next

Impl **95**

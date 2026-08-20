---
title: About Our Story episode reader
type: convention
date: 2026-08-17
tags: [about, storybook, info, i18n, a11y, softgate]
impl: 87
updated: 2026-08-17
impl_updated: 95
---

# About Our Story episode reader

`/about` Our Story is a **two-pane episode reader** — not a 3D book, spine, valley, page-flip, footer pager, or closed `HeroBook3D`.

## Component

`src/features/info/components/StoryBook/` — About-only. Same folder and `StoryBook` export so About keeps `<StoryBook chapters={getPublishedStoryChapters()} />`. Do not lift it to `src/components/` unless Home/Detail reuse it. Do **not** nest `HeroBook3D`. Do **not** wrap this module in Framer `motion.*`.

## Panel (Impl 94)

- White `rounded-3xl` `.story-reader` (`tabIndex={0}`, `aria-label` = `a11y.storyBook` → “Our Story”).
- Desktop (`lg+`): left rail ~280px, white pane. One white panel; rail/pane split is the divider only. Splash supplies color — no cream/`#f7f4ee`/sepia paper.
- Left rail: `about.storyEpisodes`; rows `01`–`06` from published chapters. Selected row has teal left bar `#0e9494`, pale teal wash, `about.storyNowReading`.
- Right pane: toolbar `about.storyChapterOf` (`Episode {{n}} of {{total}}`, `aria-live="polite"`) + circular Prev/Next (`a11y.storyPrevChapter` / `storyNextChapter`). Turns sit in the toolbar, not over the splash.
- Splash `img.story-reader-splash` (`alt=""`) **iff** `chapter.coverImage` is set. Origin uses `/about/our-story-splash.jpg`. Later client art is a field edit, not a component rewrite.
- Then `h3` title + body paragraphs (`\n\n` split).
- Below `lg`: horizontal episode chips, then the same reader pane. No two-column canyon.
- Class prefix is **`.story-reader-*` only**. After ship, `rg story-book` in `src/` must be tests asserting absence, or nothing. Do not edit `.hero-book-*`.
- No `overflow: hidden` on the About page root.

## Turns

- No wrap. First prev and last next `disabled`.
- ArrowLeft / ArrowRight only while the region is focused.
- Empty `chapters` → `null`. No `<a>` inside the reader.

## Data

Chapters are `StoryChapter` + `mockStoryChapters` in `@softgate/shared`, **outside** `SharedData`. Optional `coverImage?: string`. Do not bump `SHARED_DATA_SCHEMA_VERSION` for story copy (catalog schema is independent; currently **13**). Portal reads via `getPublishedStoryChapters()` (`published === true`, `sortOrder` asc).

Chrome strings stay in i18n (`storyEpisodes`, `storyNowReading`, `storyChapterOf`). Chapter title/body are bilingual fields on the chapter records — do not change the six published strings for chrome work.

`public/about/story-cover.svg` remains a HeroBook3D / BookCard test fixture. About must not reference it.

Admin CRUD is a later sibling-repo Impl. Do not fake an edit control on the portal.

## Honesty

Thematic chapters only (2026 + what the demo actually ships). Do not revive a fake 2024–2026 year rail (Impl 53).

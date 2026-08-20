---
title: Popular rank is a white glyph on the cover
type: note
date: 2026-08-19
tags: [home, ranking, popular, rankmark, softgate]
impl: 124
---

# Impl 124 — Popular rank is a white glyph on the cover

The Impl 122 square pocket (`--rank-pocket` / `.book-rank-notch`) read as a teal box cut out of the hardcover. Rank is only the numeral again: **white fill in the digit’s glyph shape** plus a **primary-600** outline (`#0e9494`). No rectangle, no WEBTOON hang, no title indent.

Supersedes [Impl 122 pocket](2026-08-19-popular-rank-pocket.md). Layout still follows [Impl 119](2026-08-19-popular-rank-on-cover.md) (6-up grid, mark on the cover).

## What shipped

- Deleted `.book-rank-frame`, `--rank-pocket`, `.book-rank-notch`.
- `RankMark` shrink-wraps: `absolute bottom-0 left-1`, `text-white`, `[-webkit-text-stroke:3px_#0e9494]`, `[paint-order:stroke_fill]`, `text-2xl sm:text-3xl`. No `translate-y`.
- Ranked `BookCard` is always one full `.book-media.book-media-shadow.aspect-[3/4]`; `RankMark` is a child so `overflow: hidden` keeps the glyph on the book.
- Home Popular skeleton uses the same geometry (white digit on the grey cover).
- Categories `?sort=popular` matches. Status stays bottom-right while ranked. Title is not indented.
- No fake ▲/▼. Gist 3 not started.

## Verify

`npm run check`

Home / Categories Popular: full 3:4 cover; digit is white with a teal outline, bottom-left on the art, not a clipped well. Skeleton Popular still shows 1–6. Unranked `/categories` still has no `1. Shadow Knight`.

Followed by [Impl 125](2026-08-19-popular-rank-glyph-kick.md): same glyph plus a hard offset white `text-shadow` kick.

## Next

Impl **126**

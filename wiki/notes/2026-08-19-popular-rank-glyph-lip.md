---
title: Popular rank white lip follows digit geometry
type: note
date: 2026-08-19
tags: [home, ranking, popular, rankmark, softgate]
impl: 127
---

# Impl 127 — Popular rank white lip follows the digit geometry

Impl 125’s `text-shadow` never showed: the 3px teal stroke swallowed a 1px/2px kick. Rank is two copies of the same digit. A larger white glyph sits behind (`scale-[1.2]`, `origin-center`, no stroke). The current white fill + primary stroke sits in front. The lip follows the glyph (`1` stays `1`), not a box and not a one-sided kick.

Supersedes [Impl 125 kick](2026-08-19-popular-rank-glyph-kick.md). Layout still follows [Impl 124](2026-08-19-popular-rank-glyph.md) (full cover, mark on the book).

## What shipped

- `RankMark` wrapper stays `absolute bottom-0 left-1`, `data-testid="rank-mark"`, `aria-hidden`.
- Back span: `text-white`, `scale-[1.2]`, `origin-center`. No stroke. No `text-shadow`.
- Front span: `text-white`, `[-webkit-text-stroke:3px_#0e9494]`, `[paint-order:stroke_fill]`.
- `.book-media` `overflow: hidden` clips extra below the cover so the mark does not hang. Gist 3 not started.

## Verify

`npm run check`

Home / Categories Popular: white lip around the digit shape; teal outline on top. Not a wash. Not a square well.

## Next

Impl **128**

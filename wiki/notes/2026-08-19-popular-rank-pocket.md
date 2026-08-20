---
title: Popular rank bottom-left cover pocket
type: note
date: 2026-08-19
tags: [home, ranking, popular, rankmark, softgate]
impl: 122
---

# Impl 122 — Popular rank bottom-left cover pocket

**Superseded by [Impl 124](2026-08-19-popular-rank-glyph.md):** the pocket looked like a square cut out of the hardcover. Rank is now a white glyph + primary stroke on a full cover.

A corner wash on the digit only showed on skeleton; on cover art it disappeared. Rank is no longer painted on the photo.

## What shipped

- Wash layer removed.
- Ranked covers clip an L-shape (`.book-rank-notch`) so the **bottom-left** `--rank-pocket` (2.5rem) square is not art.
- `RankMark` is a sibling in that pocket (primary + white stroke, `text-2xl sm:text-3xl`). Hover lifts frame + number together.
- Home Popular skeleton uses the same hole.
- Categories `?sort=popular` matches. Status stays bottom-right while ranked.
- No fake ▲/▼. Gist 3 not started.

## Verify

`npm run check`

Home / Categories Popular: cover does not occupy the bottom-left square; the digit sits in that well on skeleton and loaded art.

## Next

Superseded. Next after 124 is Impl **125**.

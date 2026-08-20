---
title: Series rating star hit cells 44 by 24
type: note
date: 2026-08-19
tags: [rating, a11y, tap-target, softgate]
impl: 115
---

# Impl 115 — Series rating star hit cells 44 by 24

Follow-on to Impl 114. Logic unchanged.

`SeriesRatingControl` star cells went from `h-8 w-8` (~16px halves) to `h-11 w-12` (44×48). Each left/right radio is `w-1/2` → 24px wide, 44px tall. The Lucide glyph stays `h-11 w-11` so the star is not stretched. Cover `RatingChip` stays small.

## Verify

`npm run check`

Detail and chapter-complete stars are easier to tap. 0.5 steps, gates, community score unchanged.

## Next

Impl **116**

---
title: Popular rank white offset kick
type: note
date: 2026-08-19
tags: [home, ranking, popular, rankmark, softgate]
impl: 125
---

# Impl 125 — Popular rank white offset kick

**Superseded by [Impl 127](2026-08-19-popular-rank-glyph-lip.md):** the 3px stroke hid the 1px/2px shadow. Rank is now a scaled white glyph behind the stroked digit.

Impl 124’s concentric stroke (`text-white` + 3px primary outline) read as an outlined font sticker. White still follows the digit, but a **hard offset** `text-shadow` (`1px 2px 0 #fff`, zero blur) adds a down-right kick so the mark sits on the cover with a little more weight.

Does not replace the glyph. Does not clip a pocket. Does not hang. Does not glow.

## What shipped

- `RankMark` keeps white fill, `[-webkit-text-stroke:3px_#0e9494]`, `[paint-order:stroke_fill]`.
- Adds `[text-shadow:1px_2px_0_#fff]` only. Offset is down-right so `.book-media` `overflow: hidden` does not clip a left hang.
- No `drop-shadow`, no blur glow, no four-way halo, no `box-shadow` (that would read as a box).
- Layout unchanged: `bottom-0 left-1`, `text-2xl sm:text-3xl`, full 3:4 cover, 6-up Popular grid. Gist 3 not started.

## Verify

`npm run check`

Home / Categories Popular: white digit + teal outline, plus a 1px/2px white kick — not a wash and not a square well.

## Next

Superseded. Next after 127 is Impl **128**.

---
title: Home hero optical vertical center
type: note
date: 2026-08-11
tags: [hero, layout, optical, softgate]
impl: 48
---

# Impl 48 — Home hero optical vertical center

Plan draft labeled “Impl 47”; wiki number **48** because Impl 47 was already Scroll chrome.

## What shipped

- Home hero shell: `min-h-[22rem]…xl:min-h-[36rem]` + `flex flex-col justify-center` + modest `py`
- Sibling row keeps `lg:items-center`; book widths unchanged; `lg:translate-y-2` optical nudge
- `.hero-book-scene` padding equalized to `1.25rem`
- Not `100vh` (SoftGate burst logo clash)

## Verify

`npm run check`

## Next

Impl **49**

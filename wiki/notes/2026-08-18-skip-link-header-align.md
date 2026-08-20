---
title: Skip link vertically centers in the nav bar
type: note
date: 2026-08-18
tags: [a11y, skip-link, nav, chrome, softgate]
impl: 101
---

# Impl 101 — Skip link vertically centers in the nav bar

## Why

Impl 100 showed the skip chip on Tab as `position: fixed; top: 1rem`. That sat higher than the logo and Login in the sticky nav (`safe-top` + inner `h-16` with `items-center`).

## What shipped

`.skip-link:focus` in `src/index.css` only:

- `top: calc(max(0px, env(safe-area-inset-top)) + 2rem)` — `2rem` is half of nav `h-16`
- `transform: translateY(-50%)` — chip center matches the logo vertical center

Left, colors, ring, clip-until-Tab, `MainLayout` markup, Navigation flex, Hero Pause, and i18n are unchanged. The control stays outside the nav row so focus does not shove the logo.

## Verify

`npm run check`

Tab: Skip to content appears over the left of the header, vertically aligned with the logo — not flush to the viewport top.

## Next

Impl **102**

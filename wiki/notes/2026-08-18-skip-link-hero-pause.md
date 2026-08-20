---
title: Skip link + sticky Hero Pause
type: note
date: 2026-08-18
tags: [a11y, skip-link, hero, carousel, wcag, softgate]
impl: 100
---

# Impl 100 — Skip link + sticky Hero Pause

## Why

Keyboard and screen-reader users had to tab through the sticky nav (WCAG 2.4.1). Hero autoplay ran every 5s with only hover/focus pause, which resumes on leave (WCAG 2.2.2 needs an on-page control).

## What shipped

- Native `<a href="#main-content" className="skip-link">` as the first child of `MainLayout` (not `Link`; not Auth/Reader). `#main-content` + `tabIndex={-1}`; click focuses main without `preventDefault`.
- `.skip-link` / `:focus` in `src/index.css` (off-screen until Tab; then `fixed` `z-index: 50`). Not Tailwind `sr-only` + `focus:fixed`. Focus vertical align is Impl **101**.
- Hero `hoverPaused` vs sticky `userPaused`. Pause/Play sits between dots and next. Hidden when `prefers-reduced-motion` (autoplay already off). Book enter/hover unchanged.

## Verify

`npm run check`

Tab: Skip to content appears over the nav and lands in `<main>`. Hero Pause stays paused after the pointer leaves; Play resumes. Reduce-motion: no Pause button; dots + next remain.

## Next

Impl **101** (skip chip vertically centered in the nav bar).

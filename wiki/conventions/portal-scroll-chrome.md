---
title: Portal scroll chrome
type: convention
date: 2026-08-11
tags: [scroll, a11y, layout, softgate]
impl: 47
---

# Portal scroll chrome

## Document scrollbar

The viewport scrollbar on `html` is **visually hidden** (`scrollbar-width: none`, `-ms-overflow-style: none`, `::-webkit-scrollbar { display: none }`). Scrolling still works via wheel, trackpad, touch, and keyboard.

Do **not** use `overflow: hidden` on `html`/`body` to hide the bar — that disables scroll. The
horizontal axis carries `overflow-x: clip` (Impl 77) as a page-level overflow guard; `clip` is
required over `hidden` because `hidden` creates a scroll container and breaks the sticky nav. See
[responsive-chrome.md](responsive-chrome.md).

Horizontal rails (genres, Continue) keep using `@utility scrollbar-hide` independently.

## Scroll to top

- Component: `src/components/ScrollToTop/`
- Mounted in **MainLayout only** (Home, Categories, Library, Info, …)
- **Not** on ReaderLayout or AuthLayout
- Appears after `scrollY > 300` (default); brand `primary-600` + `.shape-circle`
- Respects `prefers-reduced-motion` for `window.scrollTo` behavior
- `z-40` (below Modal `z-50`)

---
title: Portal scroll chrome
type: convention
date: 2026-08-11
tags: [scroll, a11y, layout, softgate]
impl: 47
impl_updated: 143
---

# Portal scroll chrome

## Document scrollbar

The viewport scrollbar on `html` is **visually hidden** (`scrollbar-width: none`, `-ms-overflow-style: none`, `::-webkit-scrollbar { display: none }`). Scrolling still works via wheel, trackpad, touch, and keyboard.

Do **not** use `overflow: hidden` on `html`/`body` to hide the bar — that disables scroll. The
horizontal axis carries `overflow-x: clip` (Impl 77) as a page-level overflow guard; `clip` is
required over `hidden` because `hidden` creates a scroll container and breaks the sticky nav. See
[responsive-chrome.md](responsive-chrome.md).

Horizontal rails (genres, Continue) keep using `@utility scrollbar-hide` independently.

## Sticky below nav (Impl 143)

Nav is `safe-top sticky top-0 z-40` with an inner `h-16`. Catalog filters stick with `@utility sticky-below-nav`: `top: calc(4rem + max(0px, env(safe-area-inset-top)))` and `z-index: 30`. Do **not** use `top-16` alone — `safe-top` padding sits above the `h-16` row, so a bare `4rem` offset slides under the nav on notched phones.

The sticky band must be a sibling of the scrolling results, not a child of a short masthead section (otherwise it unsticks when that section leaves). Band `z-30` is below nav `z-40`; sort menus inside the band cannot cover the nav. Do not add `overflow: hidden` on `html`/`body` to hide the document scrollbar — that also breaks sticky.

## Nested legal TOC (Impl 128)

The Legal Table of Contents pane (`LegalTocSidebar` `nav`, `max-h-[50vh] overflow-y-auto`) is the exception: it uses `@utility scrollbar-thin-primary` (thin rounded `primary-*` thumb) so overflow is visible. Do **not** apply `scrollbar-hide` there. The document `html` bar stays hidden.

## Scroll to top

- Component: `src/components/ScrollToTop/`
- Mounted in **MainLayout only** (Home, Categories, Library, Info, …)
- **Not** on ReaderLayout or AuthLayout
- Appears after `scrollY > 300` (default); brand `primary-600` + `.shape-circle`
- Respects `prefers-reduced-motion` for `window.scrollTo` behavior
- `z-40` (below Modal `z-50`)

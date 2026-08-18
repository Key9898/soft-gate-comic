---
title: Hide page scrollbar + ScrollToTop
type: note
date: 2026-08-11
tags: [scroll, layout, a11y]
impl: 47
---

# Impl 47 — SoftGate Comic hide scrollbar + ScrollToTop

## What shipped

- `html` viewport scrollbar hidden while scroll still works; reduced-motion disables `scroll-smooth`
- `src/components/ScrollToTop/` — brand FAB, MainLayout only
- i18n `a11y.scrollToTop` (en + mm)
- Unit tests for visibility + scrollTo

## Verify

`npm run check` — scroll page without OS bar; FAB after ~300px; Reader has no FAB.

## Next Impl

**48**

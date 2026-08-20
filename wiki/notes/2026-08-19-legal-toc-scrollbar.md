---
title: Legal TOC thin primary scrollbar
type: note
date: 2026-08-19
tags: [legal, toc, scrollbar, chrome, softgate]
impl: 128
---

# Impl 128 — Legal TOC thin primary scrollbar

The Legal Table of Contents pane (`max-h-[50vh] overflow-y-auto`) showed the Windows default scrollbar on Terms and Cookies. Privacy does not overflow yet; the same pane will when copy grows.

## What shipped

- New `@utility scrollbar-thin-primary` in `src/index.css` (`primary-100` / `500` / `600` only). Overflow stays real — not `scrollbar-hide`.
- Applied on `LegalTocSidebar` `nav` with `overscroll-y-contain`. Privacy / Terms / Cookies unchanged otherwise.
- Document `html` scrollbar remains hidden (Impl 47). Horizontal rails keep `scrollbar-hide`.

## Verify

`npm run check`

QA: `/cookies` and `/terms` TOC shows a thin teal thumb (not Windows arrows). `/privacy` has no bar until overflow.

## Next

Impl **129**

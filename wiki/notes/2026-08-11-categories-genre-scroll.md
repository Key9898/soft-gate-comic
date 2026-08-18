---
title: Categories genre strip scroll affordance
type: note
date: 2026-08-11
impl: 24
tags: [categories, scroll, softgate]
---

# Impl 24 — Categories genre strip scroll affordance

## Goal

Categories genre pills overflow one row without visible scrollbar; right-edge chevron + fade when more genres exist to the right.

## Shipped

- `src/hooks/useOverflowScrollX.ts` — scroll-aware `canScrollRight` / `scrollByPage`
- Categories genre row: `flex-nowrap` + `scrollbar-hide` + right affordance
- i18n `a11y.scrollGenresRight`
- Unit tests for the hook

## Out of scope

- Home genre strip, status chips, mock genre data

## Verify

- `npm run check`
- Narrow `/categories` → arrow visible; click scrolls; end hides arrow

## Follow-up

- none for this Impl (Home chevron can be a later polish)

---
title: HeroBook3D Home size, thickness, top overflow
type: note
date: 2026-08-14
tags: [herobook3d, hero-spotlight, css, softgate]
impl: 78
---

# Impl 78 — HeroBook3D Home size, thickness, top overflow

## Why

Home hero 3D book had grown too large (`xl:w-96`), too thick (`--hero-book-thickness: 48px`), and the top corner poked past the hero band (`rotateX(10deg)` + cover `translateZ` + hover `translateY(-6px)` with `overflow: visible`). Hero chrome (banner, copy, carousel) stayed.

Did **not** clip with `overflow: hidden` — that flattens `preserve-3d` (ADR 005 / CSS Transforms grouping).

## What shipped

- Home wrapper one step down: `w-56 sm:w-64 lg:w-72 xl:w-80` (keep `overflow-visible` + `lg:mt-2`; no `translate-*`)
- Shared hardcover: `--hero-book-thickness: 32px` (cover/back Z still follow the token)
- Rest pose `rotateX(6deg) rotateY(-42deg) rotateZ(-4deg)`; scene `padding-top: 2.25rem`; hover lift `-3px`
- Detail width ladder unchanged (`xl:w-96`)

## Files

- `src/features/home/components/HeroSpotlight/HeroSpotlight.tsx`
- `src/index.css`
- `src/test/HeroSpotlight.test.tsx`

## Verify

`npm run check`

## Next

Impl **79**

---
title: static HeroBook + hero mid-align
type: note
date: 2026-08-11
tags: [hero, book, css3d, layout, softgate]
impl: 46
---

# Impl 46 — static HeroBook + hero mid-align

## What shipped

- HeroBook3D simplified to static three-quarter hardcover Link (no open / hinge / fade / sticky-touch)
- CSS hover lift only under `prefers-reduced-motion: no-preference`
- Home hero row: `lg:items-center` so copy + book share vertical mid
- Size wrappers unchanged (`w-56` → `xl:w-96`)

## Verify

`npm run check`

## Next

Impl **47**

---
title: About Our Story split narrative + book visual
type: note
date: 2026-08-11
tags: [about, i18n, honesty, info, softgate]
impl: 53
---

# Impl 53 — About Our Story split narrative + book visual

## Why

Fake 2024→2025→2026 timeline overstated maturity. SoftGate work started in **2026**; client had no multi-year history. Early-stage About pages prefer honest narrative + brand visual over year rails.

## What shipped

- Dropped `milestones` timeline (`border-l` rail) from `AboutPage`
- Split Our Story: `lg` two-column — heading + 3 Lucide icon rows (`Flag` / `Users` / `Beaker`) + decorative `public/about/story-book.svg`
- EN/MM: honest `ourStoryDesc` + `storyP1`–`storyP3`; removed `milestone2024*` / `2025*` / `2026*` keys
- Lucide only (no Heroicons package); not `HeroBook3D`

## Files

- `public/about/story-book.svg`
- `src/features/info/AboutPage.tsx`
- `src/lib/i18n/locales/en/translation.json`
- `src/lib/i18n/locales/mm/translation.json`

## Verify

`npm run check`

## Next

Impl **54**

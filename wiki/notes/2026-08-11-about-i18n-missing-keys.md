---
title: About i18n missing keys fix
type: note
date: 2026-08-11
tags: [i18n, about, info, honesty, softgate]
impl: 50
---

# Impl 50 — About i18n missing keys fix

## Root cause

`AboutPage` called `about.stat*Value`, `focusMarket`, `productStage`, and milestone keys that were never added to `en`/`mm` locales (Impl 37 incomplete). i18next rendered raw keys.

## What shipped

- Added mock-honest About stats + milestone strings to EN/MM
- Also filled related Careers/Press/Help missing keys used by those pages
- About stat value typography: `break-words text-2xl sm:text-3xl`

## Verify

`npm run check`

## Next

Impl **51**

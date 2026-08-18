---
title: Soft-Expressive border radius normalize
type: note
date: 2026-08-11
tags: [impl, radius, ui]
impl: 10
---

# Soft-Expressive border radius normalize

Impl 10 normalized SoftGate Comic corner radii to Soft-Expressive: controls/surfaces `rounded-2xl`, large panels `rounded-3xl`, geometric circles via `.shape-circle`. Banned `rounded-full` and subtle `sm`/`md`/`lg`/`xl` on portal controls.

## Key files

- `src/index.css` — utilities + `.shape-circle`
- `src/components/Button|Input|Card|Modal|SearchAutocomplete|Navigation|LanguageSwitcher|Comments`
- Feature pages under `src/features/**` (full radius sweep)
- `src/test/Card.test.tsx`, `src/test/Button.test.tsx`

## Verify

`npm run check` — zero `rounded-full` under `src/`.

## Docs

- [conventions/border-radius.md](../conventions/border-radius.md)
- [decisions/002-soft-expressive-radius.md](../decisions/002-soft-expressive-radius.md)

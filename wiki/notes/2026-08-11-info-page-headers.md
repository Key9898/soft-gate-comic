---
title: Info page headers + breadcrumbs
type: note
date: 2026-08-11
impl: 17
tags: [info, breadcrumb, page-header, softgate]
---

# Impl 17 — Info page headers + breadcrumbs

## Goal

Remove fake Back→Home links from all nine info pages; add shared Breadcrumb + PageHeader chrome by Company / Support / Legal tier.

## Shipped

- `Breadcrumb` + `PageHeader` components (no daisyUI)
- `src/lib/info/pageMeta.ts` — `INFO_PAGES`, breadcrumbs helper
- All nine `src/features/info/*` pages rewired
- i18n: `a11y.breadcrumb`, `info.eyebrow.*`, `info.deck.*`, `legal.lastUpdated`
- Unit test: `src/test/Breadcrumb.test.tsx`

## Verify

- `npm run check`
- Spot-check `/about`, `/help`, `/privacy`: Home › Section › Page; no Back link

## Follow-up

- none for this Impl

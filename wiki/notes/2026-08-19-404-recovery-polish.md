---
title: 404 recovery page polish
type: note
date: 2026-08-19
tags: [404, recovery, seo, honesty, info, softgate]
impl: 121
---

# Impl 121 — 404 recovery page polish

Nine page items on the Impl 118 recovery. Plan drafted as 120; Help hub took 120. HTTP 404 / Vercel stays out.

## What shipped

- Reader miss uses `withSiteChrome` (skip link, Navigation, Footer). Live reader stays on `ReaderLayout`. Splat and Detail do not double nav.
- Go here is Categories / Popular / New (`sm:grid-cols-3`). Help + Contact stay in Still need help.
- Recovery inner shell has no `min-h-screen`. Search has `search.title` heading.
- SEO also omits keywords, `og:image`, and Twitter tags.
- Dead 404 i18n keys removed. MM `seriesDesc` / `tryNote` no longer mix `catalog` / `Live`.

## Verify

`npm run check`

## Next

Impl **122**. Host HTTP 404 is a later Impl.

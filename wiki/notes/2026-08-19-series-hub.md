---
title: Series hub Continue, tags, thumbs, related
type: note
date: 2026-08-19
tags: [webtoon, detail, continue, catalog, softgate]
impl: 130
---

# Impl 130 — Series hub (reading loop)

`/webtoon/:id` is the series hub. Continue vs Start uses published episode count, not `webtoon.episodeCount`. HeroBook3D matches the primary CTA. Genre pills go to `/categories/:slug`. Tags go to `/search?q=`. Related heading is You may also like. Author other-works rail uses `author.id` (not “profile”). Episode rows use Demo landscape thumbs; date and views stay visible on mobile. Unpublished reader routes 404 like a missing episode.

Helpers: [`src/lib/catalog/seriesReading.ts`](../../src/lib/catalog/seriesReading.ts).

## Verify

`npx vitest run src/test/seriesReading.test.ts src/test/WebtoonDetailHub.test.tsx src/test/WebtoonDetailUnlock.test.tsx src/test/NotFoundPage.test.tsx`

## Next

Impl **131** (Search destination).

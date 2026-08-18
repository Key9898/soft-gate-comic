---
title: Home Continue Reading episode rail
type: note
date: 2026-08-11
tags: [home, continue, engagement]
impl: 40
---

# Impl 40 — SoftGate Comic Home Continue episode rail

## What shipped

- `src/lib/engagement/progress.ts` — episode + blended progress helpers + Continue completion rule
- Home Continue Reading section above Trending (auth + non-empty incomplete history only)
- `BookCard` thin `primary-600` progress under cover; reserved chevron horizontal rail
- Resume links to `/read/:webtoonId/:episodeNumber`
- Library History progress pointed at shared helpers
- i18n: `home.continueReading`, `a11y.scrollContinueRight`

## Verify

`npm run check`

## Next Impl

**41** — scroll-depth persist + resume

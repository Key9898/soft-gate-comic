---
title: Guest Start here rail
type: note
date: 2026-08-19
tags: [home, guest, start-here, discovery, softgate]
impl: 134
---

# Impl 134 — Guest Start here rail

Continue Reading only appears with login + history. Guests previously hit Hero, genre chips, then Popular with a Start here eyebrow on the same ranking six-pack. That was a label, not a place to start.

## What shipped

- `startHereWebtoons` in `src/lib/catalog/discovery.ts`: published series, Hero/`spotlightSlides` ids dropped, episode 1 published and not premium, sort `viewCount`, cap 6. Series `isPremium` is not the filter.
- Home Continue slot: Continue if history exists, else Start here catalog rail (`HomeCatalogRail`, Play icon, no View All, no rank glyphs).
- Cards go to `/read/:id/1`. Other Home rails stay `/webtoon/:id` via optional `cardTo`.
- Popular always uses `home.rankingDesc`. No Start here eyebrow.
- Bottom Get started free CTA unchanged.
- Copy: first episode free; titles not in this week's spotlight.

## Verify

`npm run check`

Guest Home: Start here heading after genres; `/read/…/1` cards; Hero titles absent from that rail; Popular has no Start here text. Logged-in with history: Continue only.

## Next

Impl **135**

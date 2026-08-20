---
title: Hero heading and duplicate CTA
type: note
date: 2026-08-19
tags: [home, hero, a11y, seo, softgate]
impl: 137
---

# Impl 137 — Hero heading and duplicate CTA

Gist 5. Homepage `h1` must name the site, not the rotating series. Start Reading and the 3D cover must not be two screen-reader Start CTAs. (Plan files still said Impl 135; that number was already author profile. This ships as **137**.)

## What shipped

- `h1` = `home.pageHeading` (EN SoftGate Comic — Myanmar webtoons). Eyebrow `<p>` = `home.spotlightKicker`. Series title = large `h2`.
- Home `HeroBook3D` `coverTabbable={false}` is a pointer `div` + `navigate`, not a `Link`. Detail cover stays a tabbable `Link`.
- Start Reading + Save unchanged. Document `<title>` unchanged.

## Verify

`npm run check`

Home: one `h1` site identity; series is `h2`; cover test id has no `href`; Start Reading still goes to `/webtoon/:id`.

## Next

Impl **138**

---
title: HeroBook3D cover reveal after SSR onLoad miss
date: 2026-08-26
type: note
impl: 182
tags: [hero, cover, ssr, hydration, onload, softgate]
---

# HeroBook3D cover reveal after SSR onLoad miss

First Home paint after SSR left the spotlight hardcover blank (Love in Seoul is `spotlightOrder: 1`). Carousel remount (`key={current.id}`) showed the cover.

Cause: `HeroBook3D` kept the `<img>` at `opacity-0` until `onLoad`. The SSR HTML starts the decode before hydration, so `load` can fire before React attaches the handler. `imgLoaded` stayed `false`. Pulse `bg-gray-200` sat on the face — looks like a white blank book. Not a missing file (`/webtoon-covers/love-in-seoul.png`).

Fix: after mount / `coverImage` change, if `img.complete && naturalWidth > 0`, set loaded. Keep `onLoad` / `onError` for the in-flight path. `BookCard` default `imageLoaded = true` unchanged.

## Verify

Hard refresh `/`. First slide cover must be visible without touching the carousel.

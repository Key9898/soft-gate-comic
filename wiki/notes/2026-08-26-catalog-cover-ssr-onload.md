---
title: Catalog cover reveal after SSR onLoad miss
date: 2026-08-26
type: note
impl: 183
tags: [cover, ssr, hydration, onload, bookcard, softgate]
---

# Catalog cover reveal after SSR onLoad miss

Home rails (Start here through New Releases) stayed gray after SSR hard refresh while the hero cover (Impl 182) was visible. Same files; different component.

Cause: `BookCard` / `DailyDropCard` hide the `<img>` (`opacity-0` + pulse) until parent `loadedImages.has(id)`. The Set starts empty. SSR decodes covers before hydration, so `onLoad` never reaches the setter.

Fix: after mount, if `!imageLoaded && img.complete && naturalWidth > 0`, call `onImageLoad`. Default `imageLoaded = true` unchanged. HeroBook3D, layout, badges, copy, Author avatar untouched.

## Verify

Hard refresh `/`. Catalog rail covers visible on first paint.

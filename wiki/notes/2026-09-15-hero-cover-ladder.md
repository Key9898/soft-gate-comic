---
title: Impl 226 — HeroBook3D joins the cover ladder, and the artwork brief
type: note
date: 2026-09-15
tags: [portal, performance, images, srcset, covers, brief, softgate]
impl: 226
---

# Impl 226 — HeroBook3D joins the cover ladder, and the artwork brief

Two pieces: a regression left behind by Impl 223, and the replacement-artwork brief for [#28](https://github.com/Key9898/soft-gate-comic/issues/28).

## The gap Impl 223 left

Impl 223 wired `BookCard` to a `<picture>` ladder and stopped there. `HeroBook3D` renders `src={coverImage}` with no `srcset`, so **the largest cover surface in the product kept downloading the full source** while the smallest one was optimised. The Home spotlight and every series detail page pulled ~633 kB per cover into a frame at most 384px wide.

It was found while writing the artwork brief — enumerating where covers appear forced a look at each consumer, which the original change never did. That is the transferable part: Impl 223 optimised the component it happened to be editing rather than auditing every consumer of the asset.

## The ladder was too short anyway

`HeroBook3D` is `w-56 sm:w-72 lg:w-80 xl:w-96` — up to **384px**, which needs **768** at 2x. The ladder stopped at 576, so even after wiring `<picture>` the hero would have been served a soft cover on any retina desktop.

768 is added, and it is also the ceiling the current sources allow: they are 1024 square, and 1024 tall at 3:4 is 768 wide. Anything beyond that would be upscaling. The artwork brief specifies 1152 x 1536 for replacements, which would raise the ceiling when new art lands.

`HERO_COVER_SIZES` is separate from `COVER_SIZES` because the hero is a fixed-width column rather than a grid cell, so its slots are exact rather than viewport-relative. Home steps one rung smaller than the detail page; the shared string over-estimates Home by one breakpoint, which is the right way to be wrong — an over-estimate costs bytes, an under-estimate ships a soft cover on the largest surface the art ever appears on.

## Verified

At 1400px viewport, DPR 2, in a 384px slot: the browser selects `shadow-knight-768.avif` at **77 kB**, against the **633 kB** PNG it fetched before. At DPR 1 it takes the 384 rung at 27 kB.

A test now pins the gap rather than the fix: it asserts the ladder reaches at least 768 and that `HERO_COVER_SIZES` names the 384px slot, so the hero cannot quietly fall off the ladder again.

`pnpm check` green: 6/6 tasks, 109 portal + 38 API test files. Variants 82 -> 100 (one more rung across nine covers, two formats).

## The artwork brief

[`wiki/references/cover-artwork-brief.md`](../references/cover-artwork-brief.md). Nine covers, no code change needed to accept them. Two things in it are decisions rather than description:

**Deliver at 3:4 native (1152 x 1536), not 1:1.** Sources are square today and every surface renders 3:4 with `object-cover`, so ~12.5% is cropped off each side — a quarter of every cover is drawn, shipped and discarded, and any composition near a side edge is cut.

**Readability at 183px is the acceptance test.** That is the widest a discovery card gets and where most visitors meet a cover. It is also the strongest practical case for the no-text rule: at 183px a baked tagline is illegible noise, while the live title beneath stays sharp because it is real text.

The brief also records what an artist cannot otherwise know — the spine gradient over the left 5%, badge stacks in both top corners, the oversized rank numeral bottom-left on ranking rails, the 3px progress bar — plus per-title context and the handover steps.

Noted while compiling it: **five of the nine `mm` titles are identical to their `en` values**, i.e. untranslated. A content gap rather than an artwork one, but those cards currently show English in both locales.

## Related

- [Impl 223](2026-09-15-responsive-image-pipeline.md) — the pipeline this completes
- [Impl 224](2026-09-15-cover-branding-removal.md) · [Impl 225](2026-09-15-orphan-cover-removed.md)

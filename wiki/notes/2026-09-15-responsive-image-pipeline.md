---
title: Impl 223 — Responsive image pipeline for covers and the hero banner
type: note
date: 2026-09-15
tags: [portal, performance, images, lcp, srcset, softgate]
impl: 223
---

# Impl 223 — Responsive image pipeline for covers and the hero banner

The asset half of GitHub #4. That issue is about placeholder _content_ — baked-in wordmarks, `[AUTHOR NAME] | ART BY [ARTIST NAME]` burned into cover art — which needs artwork nobody has yet. What it does not say, and what turned out to be true regardless of what the images depict, is that the portal was shipping those images at their full source resolution.

## What was being sent

| Asset        | Source                | Rendered at               |
| ------------ | --------------------- | ------------------------- |
| `banner.png` | 10667 x 6000, 2486 kB | a band at most 576px tall |
| Each cover   | 1024 x 1024, ~950 kB  | a slot at most 183px wide |

Ten covers plus the banner is roughly **12 MB of imagery** for a Home page whose largest image slot is 183px. The covers are square while `BookCard` renders `aspect-[3/4]`, so a quarter of every cover's pixels were downloaded and then discarded by `object-cover`.

## The ladder

`scripts/generate-image-variants.ts` (sharp, modelled on the existing `generate-og-images.ts`) writes AVIF and WebP at four cover widths and five banner widths — 90 files, 3.7 MB committed, matching the `og/` precedent of generating with a script and committing the output.

Cover widths stop at 576 because 183px at a 3x device is 549. They are **pre-cropped to 3/4** in the generator, so the browser never fetches the pixels `object-cover` is about to throw away. The banner keeps its native aspect: it is full-bleed and the crop is whatever the visitor's viewport decides.

Measured after, on a 375px viewport at DPR 2:

- banner: `banner-960.avif`, **32 kB** against 2486 kB
- cover: `shadow-knight-384.avif`, **28 kB** against ~950 kB

## The banner had to stop being a background

`HeroSpotlight` and `HomePageSkeleton` painted the banner with `style={{ backgroundImage }}`. A CSS background cannot carry `srcset`/`sizes`, so there was no way to hand it a ladder, and it cannot take `fetchpriority` — which matters because this is Home's LCP element.

It is now `HeroBanner`, one component behind all three call sites, rendering `<picture>` with an `<img>` that takes `fetchpriority="high"`. The `fetchpriority` spread is lowercase for the same reason as Impl 219: React 18 rejects the camelCase prop on `img` and silently drops the hint.

`SkeletonStates.test.tsx` asserted the hero contained an element whose inline `style` mentioned `/banner/banner.png`. That assertion was pinning the mechanism rather than the intent, so it now asserts the artwork renders and an AVIF source exists, either of which survives a future change of technique.

## Remote covers pass through

`coverSources` returns `null` for anything that is not a local `/webtoon-covers/*` file — R2 URLs from a live catalog, the About splash, nested paths. `BookCard` then renders a plain `img` exactly as before. Deriving variant URLs for a remote file would 404 every `source` and drop every card to its fallback.

## The staleness trap, and the guard

Committing generated files creates a specific hazard here. #4 will replace the placeholder artwork **in place**, keeping every filename. Existence checks would still pass, and the stale variants would ship — the new art would never reach a visitor, and nothing would say so.

So the generator writes `public/image-variants.json`, a sha256 per source, and `imageVariants.test.ts` compares it against the current files. Replacing any source without re-running `pnpm generate:images` now fails `pnpm check` with the command to run. The guard was watched failing first: appending one byte to `blood-moon.png` produced `webtoon-covers/blood-moon.png changed since its variants were built — run pnpm generate:images`.

## Verification

`pnpm check` green: 6/6 tasks, 109 portal + 38 API test files, 0 lint errors, prettier clean.

Live at `localhost:5173`, 375x812 at DPR 2: the banner element resolved to `banner-960.avif` at a 375px CSS width. The cover ladder was verified against the real `sizes` string in the same browser — a 44vw slot measured 165px CSS (the estimate behind `COVER_SIZES` was 163.5px, within 1%), needed 330px at DPR 2, and the browser selected the 384 rung.

Covers could not be verified on the live page itself: local dev runs in HTTP mode and the portal could not reach the API, so Home rendered its catalog-load-fail chrome with no cards. That path is covered by unit tests asserting every srcset entry resolves to a file that exists.

## Left open

This is the asset half only. #4's actual subject — the wordmarks baked into `banner.png`, the credits burned into the cover PNGs, and real per-episode panel art — still needs artwork. When it lands, drop the files in place and run `pnpm generate:images`; the test will tell you if you forget.

`generate:images` is deliberately not wired into `build`, matching `generate:og`. The manifest test is what makes that safe — it converts "someone forgot" from a silent production regression into a failed gate.

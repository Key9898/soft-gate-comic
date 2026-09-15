---
title: Impl 224 — Competitor branding removed from two covers
type: note
date: 2026-09-15
tags: [portal, covers, branding, images, softgate]
impl: 224
---

# Impl 224 — Competitor branding removed from two covers

First item of [#28](https://github.com/Key9898/soft-gate-comic/issues/28). Three covers carried Naver's product branding: `golden-age.png` said **"Webtoon Original"**, `shadow-knight.png` said **"A Webtoon Original"**, and `cyber-dreams.png` has a white `WEBTOON` speech-bubble badge plus `SEASON 1`. Three covers on a SoftGate portal claiming to be another platform's originals.

## Two fixed, one not

`golden-age` and `shadow-knight` are done. `cyber-dreams` is **not**, deliberately — see below.

## What was tried, and what the failures taught

**Clone-stamping failed twice, and the second failure nearly shipped.**

The first approach cloned a clean band from the same rows, on the theory that same-row sourcing preserves a vertical gradient exactly. On `shadow-knight` it pulled in cape and smoke detail and left an obvious hard-edged rectangle. On `golden-age` it looked fine in a wide crop and fine at 240px — so it was applied. Only a full-resolution A/B against the original showed it had pasted in a **duplicate temple roof** inside a hard-edged box. It read as acceptable at card size purely because the duplicated roof blended with the surrounding architecture.

The lesson is the review method, not the technique: **a patch must be diffed against the original at full resolution.** Judging at delivery size hides pasted content that happens to resemble its surroundings, and "it looks fine in the crop I chose" is not a check.

**A feathered blur worked, once the mask was actually a mask.** Two intermediate attempts failed for reasons worth recording:

- An SVG feather using `mix-blend-mode: multiply` silently produced a fully opaque mask, so the result was a flat grey rectangle.
- The first working raw-pixel mask used a falloff of 0.45 of the region height from each edge — 90% of the patch was semi-transparent, so the original text bled straight through and increasing the blur sigma from 18 to 60 changed almost nothing. The giveaway was that a 3x sigma increase had no visible effect.

The shipped approach is a Gaussian blur under a cosine-falloff alpha built as raw pixels, feather 0.10 horizontal and 0.16 vertical. The erased regions read as atmospheric haze — a soft band, visible on close inspection at 100%, invisible at every size a cover actually renders (183px card, 384px hero, 340px OG).

**`cyber-dreams` cannot be patched this way.** Its badge is large, opaque and white, sitting on detailed wet asphalt between the character's boots. Blur turns it into a pale smear that is worse than the logo, and there is no clean same-row region wide enough to clone from — the badge is flanked by both boots. It needs real artwork. Left untouched rather than shipping a visible smear.

## Re-encoding

Sharp's default PNG output nearly tripled the sources (`golden-age` 1037 -> 2653 kB). `palette: true` with `compressionLevel: 9, effort: 10` brought them to 595 and 633 kB — **smaller than the originals** — and a full-resolution comparison of the sunset gradient in `golden-age`, the worst case for 256-colour quantisation, shows no banding.

## The staleness guard earned itself

Editing the sources immediately failed `pnpm check`:

```
webtoon-covers/golden-age.png changed since its variants were built — run pnpm generate:images
```

This is the first real exercise of the Impl 223 manifest rather than a synthetic one, and it behaved exactly as designed — caught the change, named the file, gave the command.

## Verification

`pnpm check` green: 6/6 tasks, 109 portal + 38 API test files.

Confirmed on the shipped `-384.avif` variants at card size: `golden-age` and `shadow-knight` carry no branding; `cyber-dreams` still shows its badge and `SEASON 1`, as expected.

## Left open

- `cyber-dreams.png` — needs artwork.
- Everything else in #28: `[AUTHOR NAME]` / `[ARTIST NAME]` placeholders on `the-last-horizon.png` and `draft-story.png`, the baked `Comming Soon` typo, and baked-in titles on all ten covers (which is what makes covers unlocalisable — `love-in-seoul.png` shows a Korean title while the `mm` catalog title is Burmese).

Blur-erasure is a stopgap for a brand-name problem, not a substitute for clean artwork. The covers should carry artwork only; title, tagline, author, artist and season are all catalog fields already rendered by `BookCard`.

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

The shipped approach is a Gaussian blur under a cosine-falloff alpha built as raw pixels, feather 0.10 horizontal and 0.16 vertical. (A feather expressed as a _fraction_ of the region puts the outermost glyphs inside the ramp — [Impl 230](2026-09-15-cover-encoding-restored.md) specifies it in pixels instead and grows the region by exactly the ramp width, so the glyphs sit in the full-alpha core by construction.) The erased regions read as atmospheric haze — a soft band, visible on close inspection at 100%, invisible at every size a cover actually renders (183px card, 384px hero, 340px OG).

**`cyber-dreams` cannot be patched this way.** Its badge is large, opaque and white, sitting on detailed wet asphalt between the character's boots. Blur turns it into a pale smear that is worse than the logo, and there is no clean same-row region wide enough to clone from — the badge is flanked by both boots. It needs real artwork. Left untouched rather than shipping a visible smear. ([Impl 229](2026-09-15-cyber-dreams-badge-erased.md) later removed it without artwork — the conclusion "blur cannot do this" was right, and the mistake was treating blur as the only option; discarding the badge pixels and filling the hole works where averaging them cannot.)

## Re-encoding — wrong, and reverted by [Impl 230](2026-09-15-cover-encoding-restored.md)

> **Corrected 2026-09-15.** The paragraph below is what was decided and shipped. The claim it ends on — "shows no banding" — is false, and the whole decision rests on a mistake about what the sources were. Kept verbatim because the reasoning error is the point; see [Impl 230](2026-09-15-cover-encoding-restored.md) for the measurements and the fix.

> Sharp's default PNG output nearly tripled the sources (`golden-age` 1037 -> 2653 kB). `palette: true` with `compressionLevel: 9, effort: 10` brought them to 595 and 633 kB — **smaller than the originals** — and a full-resolution comparison of the sunset gradient in `golden-age`, the worst case for 256-colour quantisation, shows no banding.

Two errors, one inside the other.

**The sources were never PNG.** `golden-age.png` and `shadow-knight.png` are JPEG q100 4:2:0 carrying a `.png` extension, as are the other seven covers. "Sharp's default PNG output nearly tripled the sources" is comparing a lossless PNG re-encode against a lossy JPEG original — a size increase that says nothing about PNG and everything about the format the file already was. The right response was to write JPEG back. Instead the tripling was read as a PNG problem and answered with `palette: true`, which is the only knob that could have made it worse: these are neon and gradient illustrations, the worst case for a 256-colour palette. `magick identify` reports the format; nothing here ever asked it.

**"Shows no banding" was an eyeball at a glance, not a comparison.** Measured after the fact: outside the erased region, `golden-age` is **37.1 dB PSNR with a worst pixel 70 of 255**, `shadow-knight` **39.5 dB / 139 of 255**, and over 95% of every pixel in both files changed. A smooth sky patch on `golden-age` went from **7,030 distinct colours to 137**. The artefact is dither grain rather than hard bands, which is why a glance missed it — sharp's quantiser dithers, so 256 colours over a gradient reads as texture, and "no banding" is technically true of an image that is nonetheless visibly degraded. The check was run on the one thing the edit had touched; the damage was everywhere it had not.

This is the same failure as the clone-stamp near-miss above, one level up. There the lesson was **diff a patch against the original at full resolution**. Here a full-resolution diff was available and would have shown 95% of the file changed by a step that was supposed to change nothing — but the diff was never taken, because re-encoding did not feel like an edit. **An encoder change is an edit to every pixel, and earns the same A/B as a patch.**

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

- ~~`cyber-dreams.png` — needs artwork.~~ Its badge was removed without artwork by [Impl 229](2026-09-15-cyber-dreams-badge-erased.md); the cover still needs artwork for the reasons below.
- Everything else in #28, as of 2026-09-15:
  - `[AUTHOR NAME]` / `[ARTIST NAME]` on `the-last-horizon.png`. This originally also named `draft-story.png` and the baked `Comming Soon` typo on it — both went with the file, which [Impl 225](2026-09-15-orphan-cover-removed.md) deleted as unreferenced. **Nine covers, not ten.**
  - Baked-in titles on **all nine**, which is what makes the covers unlocalisable. This originally cited `love-in-seoul.png` showing a Korean title against a Burmese `mm` catalog title; [Impl 227](2026-09-15-series-titles-one-locale.md) then set that title to `Love in Seoul` in both locales, which makes the example **sharper, not stale**: the cover reads `서울의 사랑` above `Love in Seoul`, so it bakes in a title the catalog now renders in **neither** locale.
  - Baked credits beyond the placeholders: `blood-moon.png` carries `SEASON 1 | WRITTEN & ILLUSTRATED BY NIGHTMARE` and `campus-life.png` carries four character names. Same class of defect as the titles — catalog data painted into pixels.

Blur-erasure is a stopgap for a brand-name problem, not a substitute for clean artwork. The covers should carry artwork only; title, tagline, author, artist and season are all catalog fields already rendered by `BookCard`.

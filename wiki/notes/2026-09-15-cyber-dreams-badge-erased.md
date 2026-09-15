---
title: Impl 229 — The WEBTOON badge erased from the Cyber Dreams cover
type: note
date: 2026-09-15
tags: [portal, covers, branding, images, inpainting, softgate]
impl: 229
---

# Impl 229 — The WEBTOON badge erased from the Cyber Dreams cover

Written after the fact. [Impl 229](https://github.com/Key9898/soft-gate-comic/commit/3a89667) shipped as code with no wiki entry, so this note is reconstructed from the commit and the figures below re-measured against `3a89667^` rather than copied. Where a number here disagrees with the commit message, this one was taken with the method stated.

[Impl 224](2026-09-15-cover-branding-removal.md) removed the "Webtoon Original" wordmark from two covers and deliberately left this one alone: the badge is large, opaque and white, sitting on detailed wet asphalt between both boots, and blurring it produced a pale smear that read worse than the logo.

## Blur was the wrong operation, not a badly tuned one

Blur averages the white badge with its surroundings, so white survives as haze no matter how wide the radius. That is why Impl 224's technique could not be rescued by turning up sigma — the failure is in what the operation does, not in its parameters. Removing the badge needs the badge pixels **discarded** first and the hole filled from what is around it.

This is worth separating from Impl 224's earlier sigma dead end, which looked similar and was not: there, raising sigma from 18 to 60 changed nothing because a 0.45 falloff left 90% of the mask semi-transparent, and the fix was the mask. Here the mask is fine and the operation is wrong.

## Three steps, on the badge and the SEASON 1 line below it

**1. Mask by min-channel threshold at 72%**, dilated, closed, then filtered by connected component to drop anything under 150px.

Min-channel is what separates the neutral white marks from the boots' cyan trim, which is bright but has a low red channel — a luminance threshold takes the trim with it. The area filter drops the rain droplets the threshold also catches.

**2. Fill by alpha-weighted push-pull, not blur.** Premultiply by the inverse mask, blur both the premultiplied image and the mask at sigma 6, 14, 30 and 60, divide, then layer coarse to fine weighted by the blurred mask.

The property that matters: colour flows in from the surrounding ground, and **no white is in the input, so none can survive in the output**. That is the structural difference from blurring, and it is why the result is checkable — see the threshold count below.

**3. Regrain.** The fill alone was plausible in colour but too smooth against the halftone texture everywhere else. A high-pass at sigma 1.2 from a plain patch of the same ground, mirror-tiled, restores the grain.

## Step 3 nearly repeated Impl 224's near-miss

The first donor was a wider strip that carried a puddle edge, and the high-pass kept it — a recognisable ring pasted into the patch, invisible at delivery size and obvious in a full-resolution A/B. Narrowing the donor to plain ground fixed it.

That is **twice** that a patch which resembles its surroundings has passed casual review. The A/B at 1:1 is not optional. (Impl 230 then found the same rule broken a third time, on an encoder change — see [that note](2026-09-15-cover-encoding-restored.md).)

## Encoding

JPEG quality 100 with **4:4:4** sampling, where the source was 4:2:0.

Re-encoding at the source's own 4:2:0 measured 44.6 dB PSNR and a worst pixel of 20 of 255 outside the edited region — a second generation of chroma subsampling landing on the neon edges. 4:4:4 measures **55.8 dB and a worst pixel of 4**, for 1.41 MB against 1.12 MB. Lossless PNG24 would have been 2.0 MB.

The sources are the `<img>` fallback in `responsiveImage.ts`, so their size is not only a repository concern — and every AVIF/WebP rung the browser actually fetches is derived from them.

**This is the finding Impl 224 needed and did not have.** Impl 224 hit the same question — the source re-encodes larger, what now — and answered it with `palette: true`, costing 37.1 dB. Here the same question was answered by measuring three candidate encodings against the original. Impl 230 applies this one to the two covers 224 quantised.

## Verification

Re-measured against `3a89667^`:

- **All change is confined to the badge.** Every pixel differing by more than 2% sits inside `141x117+442+874`, within the `145x120+440+873` the commit claims.
- **No white survives.** The `145x120+440+873` region held **4,778** pixels over the 72% min-channel threshold before and **0** after; the region's brightest min-channel value drops from 100% to 55%.
- **Outside that region: 54.6 dB PSNR, worst pixel 4 of 255.** The commit reports 55.8 dB; the worst pixel matches exactly, and the difference is in how the edited region is excluded — this figure comes from copying the original's rectangle into the candidate and comparing whole images, so the 0.7% of pixels inside it contribute zero error rather than being masked out.
- Badge absent in the 192px and 384px AVIF the browser serves.

## This is a stopgap, not the fix

The patch reads as soft reflective haze between the boots — rain streaks do not continue through it, and it is smoother than the ground around it at 1:1. Invisible at every size a cover renders, and still not the text-free artwork [cover-artwork-brief](../references/cover-artwork-brief.md) asks for.

It removes another company's brand from a page we serve, which is worth doing before the artwork arrives.

## Left open

- The artwork itself, for all nine covers: see [#28](https://github.com/Key9898/soft-gate-comic/issues/28) and the brief.
- `the-last-horizon.png` still carries `[AUTHOR NAME]` / `[ARTIST NAME]`, and all nine covers still have baked-in titles.

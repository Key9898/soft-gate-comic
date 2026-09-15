---
title: Impl 231 — Title lockup taken off the Love in Seoul cover
type: note
date: 2026-09-15
tags: [portal, covers, branding, images, inpainting, i18n, softgate]
impl: 231
---

# Impl 231 — Title lockup taken off the Love in Seoul cover

Written after the fact. [Impl 231](https://github.com/Key9898/soft-gate-comic/commit/a2f5e4f) shipped as code with no wiki entry; this note is reconstructed from the commit, with the figures re-measured against `a2f5e4f^` rather than copied.

`love-in-seoul.png` baked `서울의 사랑` above `Love in Seoul` on a Myanmar webtoon portal.

## The whole lockup, not the Korean line

[#28](https://github.com/Key9898/soft-gate-comic/issues/28) called the Korean a wrong-language problem, which it is. But the two lines are **one design**: a headline, a subtitle, and vine and blossom ornaments flanking both, all sitting on a shared white glow. Removing one line would leave ornaments framing nothing.

## It corrected a claim #28 was treating as general

#28 held that a baked title cannot be erased the way a placeholder can, because removing it leaves a hole where the focal element was. [Impl 230](2026-09-15-last-horizon-credits-erased.md) repeated that reasoning for The Last Horizon, correctly.

**It is true of covers where the title is the focal element and false here.** This lockup sits on open sunset sky with the blossom canopy framing the top, so erasing it leaves sky — and the composition reads better for the room. The claim needed the qualifier, and testing it against the specific artwork rather than inheriting it is what turned a "needs artwork" item into a shipped fix.

This cover now carries **no baked text at all**. It had no tagline, so the lockup was all of it, and it is the **first cover to satisfy** [cover-artwork-brief](../references/cover-artwork-brief.md).

## Mask

A dark-tone threshold at 55% confined to a box, dilated by **20** to swallow the white glow — Impl 230's lesson applied, since a glow left in the sampling ring fills the hole with glow exactly as a drop shadow did there.

## The failure worth recording is in the fill, not the art

The first pass **looked clean at 1:1**. An auto-level contrast stretch showed legible ghosts of the Korean glyphs in the filled sky.

The cause is arithmetic, not masking. Deep inside a hole the blurred mask weight falls to roughly **1/255**, and in 8-bit the premultiplied-over-weight divide amplifies that rounding into noise **shaped like the mask**. Running the fill at **16-bit**, and trusting a blur scale only where its mask weight exceeds **0.06**, removes it.

**The 8-bit divide was latent in Impl 229 and 230 as well.** Both were re-probed the same way and neither ghosts — the artefact only became legible here because this hole is **464x193** against 145x120 and 439x90, and because it sits on a smooth bright gradient rather than dark texture. Sky shows noise that wet asphalt and shadowed rock hide.

That is the generalisable part: **a latent numerical bug surfaces on the largest, smoothest, brightest instance first.** Two covers passing is not evidence the arithmetic is sound; it is evidence they were forgiving. And the check that found it — contrast-stretch the filled region, do not just look at it — costs one command.

## Verification

Re-measured against `a2f5e4f^`:

- **All change is contained.** Every pixel differing by more than 2% sits inside `467x197+272+82`, within the `475x204+268+79` the commit claims. 60,571 pixels at that threshold (the commit counts 75,871 at its own).
- **The dark glyphs are gone.** The region held **13,065 pixels below the 55% dark threshold before and 565 after**, the survivors being the blossom twig, which was always there.
- **No ghosting, independently confirmed.** A contrast-stretched view of the filled sky shows smooth gradient and blossoms with no trace of `서울의 사랑` or `Love in Seoul`. The same probe run on Impl 229's and 230's patches is also clean, which confirms the commit's claim that neither regressed.
- **Outside the region: 55.1 dB PSNR, worst pixel 4 of 255.** The commit reports 56.4 dB; the worst pixel matches exactly, and the gap is method — the same ~1.3 dB offset appears on Impl 229 and 230 measured this way.
- Encoded JPEG q100 4:4:4: **1.22 MB against 1.05 MB**, 151,908 colours.

## Honest limit

The twig tip that ran behind the glow is trimmed and now ends about 70px further right. It reads as a twig ending, which twigs do.

## Left open

- Eight of the nine covers still bake in their titles. This one is the exception, and [Impl 230](2026-09-15-last-horizon-credits-erased.md)'s qualifier applies: whether a title can come off without artwork depends on whether it is the focal element or sitting on open background. Worth asking per cover rather than assuming either way.
- Everything else in [#28](https://github.com/Key9898/soft-gate-comic/issues/28) and the [brief](../references/cover-artwork-brief.md).

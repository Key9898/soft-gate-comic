---
title: Impl 230 — Credit placeholders erased from The Last Horizon
type: note
date: 2026-09-15
tags: [portal, covers, branding, images, inpainting, softgate]
impl: 230
---

# Impl 230 — Credit placeholders erased from The Last Horizon

Written after the fact. [Impl 230](https://github.com/Key9898/soft-gate-comic/commit/6e47e55) shipped as code with no wiki entry; this note is reconstructed from the commit, with the figures re-measured against `6e47e55^` rather than copied. Where a number here disagrees with the commit, this one was taken with the method stated.

`the-last-horizon.png` baked `STORY BY [AUTHOR NAME] | ART BY [ARTIST NAME]` into its bottom right corner — an unfilled template shipping on the home page.

## A placeholder is not a logo

[Impl 229](2026-09-15-cyber-dreams-badge-erased.md) removed a logo from another cover, and these look like the same job. They are not. **A logo only has to go away. A credit line has to say something**, so the first question is whether it can be _filled_ rather than erased.

It cannot. The catalogue holds one `author` for this series and has **no artist field at all**, so `ART BY` has no true value to take. Real credits baked into artwork would also contradict [cover-artwork-brief](../references/cover-artwork-brief.md), which puts author and artist among the fields `BookCard` already renders as live text. Both lines come off.

That ordering — can this be filled with the truth? — is the part worth carrying forward. Erasure is the fallback, not the default.

## Two things differed from Impl 229, and each cost an attempt

**The text is not neutral.** `[AUTHOR NAME]` and `[ARTIST NAME]` are gold. Impl 229's min-channel threshold, which separated a white badge from cyan boot trim, **misses gold entirely** — gold is bright in red and green and dark in blue, so its minimum channel is low. A luminance threshold at 62% catches both colours, but it also catches the crystal cluster sitting immediately beside `STORY BY`, so the mask is confined to two boxes drawn around the lines.

The transferable form: **the threshold has to be chosen against the specific colour being removed and what sits next to it.** Min-channel was not a general technique, it was the right answer to one cover.

**The text has a drop shadow**, which is why dilating by 3 and then by 7 both left a visibly dark bar. Row-mean luminance across the band found the cause: the shadow rows hugging the text measure **0.109 and 0.094** against **0.19** for the rock above and **0.12** for the rock below. The push-pull fill was sampling the shadow as background and filling the hole with it.

Dilating to **12** puts the shadow inside the hole instead of in the sampling ring. The filled band then runs 0.198 to 0.124 top to bottom, which is the rock's own gradient rather than a dark bar.

The diagnostic is the point: a row-mean profile turned "it still looks dark" into a number that named the cause. Guessing at the dilation would have kept costing attempts.

## No regrain step

Impl 229 needed one because that cover's ground carries a halftone texture the smooth fill lacked. This artwork is flat cel-shaded with vector-like outlines and has **no grain**, so adding any would have invented texture the style does not have. Copying the previous cover's pipeline wholesale would have been wrong here.

## Verification

Re-measured against `6e47e55^`:

- **All change is contained.** Every pixel differing by more than 2% sits inside `431x84+578+930`, within the `439x90+573+927` the commit claims. 18,887 pixels at that threshold (the commit counts 26,379 at its own).
- **The bright text is gone.** The region held **4,750 pixels over the 62% luminance threshold before and 120 after**, and the survivors are crystal tips at the region's top edge, which were always there. (My bounding boxes for them sit slightly left of the commit's `760-838 x 938-948` — different greyscale conversions, same cluster.)
- **No ghosting.** A contrast-stretched view of the filled region shows no trace of the glyphs — see the [Impl 231](2026-09-15-love-in-seoul-lockup-removed.md) note for why that check matters and where it failed.
- **Outside the region: 54.9 dB PSNR, worst pixel 4 of 255.** The commit reports 56.2 dB; the worst pixel matches exactly, and the gap is method — this figure comes from copying the original's rectangle into the candidate and comparing whole images. The same ~1.3 dB offset appears on Impl 229 and 231 measured the same way, so it is consistent, not a discrepancy in the file.
- Encoded JPEG q100 4:4:4 as in Impl 229: **1.29 MB against 1.05 MB**, 291,801 colours.

## Honest limit

Rock facet outlines that ran under the text are **severed**, so the corner now reads as smooth shadow where it used to read as detailed rock. Visible in a contrast-stretched 1:1 view as a smooth band through the middle of the patch. Not conspicuous in context and invisible at every size a cover renders, but it is a **loss of detail, not a reconstruction of it**.

## Left open

- The baked title and the `AN EPIC FANTASY ADVENTURE` tagline are still on this cover. Neither can be erased the way a placeholder can, because removing them leaves the composition with a hole where its focal text was. Those need artwork. ([Impl 231](2026-09-15-love-in-seoul-lockup-removed.md) qualified that claim — it holds where the title _is_ the focal element, and not where the lockup sits on open sky.)
- Everything else in [#28](https://github.com/Key9898/soft-gate-comic/issues/28) and the [brief](../references/cover-artwork-brief.md).

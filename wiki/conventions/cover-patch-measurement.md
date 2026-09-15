---
title: Measuring a cover patch (Impl 229–234)
type: convention
date: 2026-09-15
tags: [covers, images, measurement, psnr, jpeg, softgate]
---

# Measuring a cover patch

Impl 229 through 234 each erased text from a cover and reported the same three numbers: what changed, whether the text is gone, and what the edit cost the artwork it was not supposed to touch. The numbers are only comparable if they are taken the same way. This records the method, and two things about it that produced apparent disagreements between notes.

Applies to [Impl 229](../notes/2026-09-15-cyber-dreams-badge-erased.md), [230](../notes/2026-09-15-last-horizon-credits-erased.md), [231](../notes/2026-09-15-love-in-seoul-lockup-removed.md), [232](../notes/2026-09-15-remaining-covers-erased.md), [233](../notes/2026-09-15-cover-encoding-restored.md) and [234](../notes/2026-09-15-golden-age-shadow-knight-titles.md).

## The three checks

**Containment.** Threshold the difference against the parent at 2% and take its bounding box. It must sit inside the patch rectangle the change claims. This is what catches a fill that leaked, and it is cheap.

**The text is gone.** Count pixels past the threshold the mask used — inside the patch box, before and after. The _after_ count is rarely zero and that is fine; what matters is identifying every survivor. Across these phases the survivors have been a crystal cluster, a blossom twig and a character's hair, each of which was in the frame beforehand. **A residual count with an explanation is a result; a residual count of zero with a box drawn tightly enough to guarantee it is not.**

**Cost to untouched artwork.** PSNR and worst-pixel between parent and result, with the patch excluded.

## Excluding the patch: state which way

Two methods give different numbers.

- **Neutralise** — copy the parent's patch rectangle into the result, then compare whole images. The excluded pixels contribute zero error rather than being dropped from the denominator.
- **Mask** — exclude the rectangle from the comparison entirely.

Neutralising reads roughly **1.2–1.3 dB lower**, consistently, because the zero-error pixels are still counted in the mean. Measured on Impl 229, 230, 231 and 232, the gap appeared every time and in the same direction, which is what identified it as convention rather than as a discrepancy in a file. Worst-pixel is unaffected.

Neither is wrong. **Say which one a figure came from.** Where the notes quote two values for the same patch, that is why.

## The 4/255 floor

At JPEG quality 100 with 4:4:4 sampling, re-encoding an unedited region still moves pixels by up to **4 of 255**. That is the floor for this pipeline, not a property of any particular edit, and it is why every phase from 229 onward reports the same worst-pixel figure.

A worst pixel of 4 therefore means _nothing detectable beyond re-encoding_. It is a pass, not a measurement of the patch.

## Boundary blocks: the exception, and it is narrow

Impl 232's three covers measure **8, 8 and 6 of 255** immediately outside their patches, against 4 everywhere else. That looked like it undercut the floor above. It does not:

| cover (Impl 232) | max outside patch | max >16px from the patch edge | pixels over 4/255 |
| ---------------- | ----------------- | ----------------------------- | ----------------- |
| `campus-life`    | 8/255             | 4/255                         | 28                |
| `blood-moon`     | 8/255             | 4/255                         | 24                |
| `cyber-dreams`   | 6/255             | 3/255                         | 5                 |

The excess is a **1–3 pixel rim hugging the patch edge** — a few dozen pixels in total, in the JPEG blocks that straddle the boundary. Those blocks contain a real discontinuity between filled and unfilled content, so they reconstruct less exactly than the smooth areas around them. Sixteen pixels away, every cover is back at the floor.

**Impl 229, 230, 231, 233 and 234 show no rim at all** — 4/255 both adjacent to the patch and far from it. So this is not a general property of the pipeline to be corrected for everywhere; it is what large patches with hard content boundaries do, and 232's are by far the largest (`campus-life`'s is 639x468, roughly 30% of the image).

Practical rule: **if worst-pixel outside a patch exceeds 4, check whether it is a rim before treating it as damage.** Blank the patch plus a 16px margin and re-take the maximum. If it drops to 4, the excess is boundary reconstruction and the artwork is untouched.

## What a "final" count is worth

Not a measurement point, but it belongs with them. Between Impl 224 and 234 the number of covers carrying baked text was stated as final on four separate occasions, and a commit invalidated it within the hour each time. Prefer "as of Impl N" to a bare total, and re-check against the images rather than against the previous note.

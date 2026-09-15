---
title: Impl 234 — Titles taken off Golden Age and Shadow Knight
type: note
date: 2026-09-15
tags: [portal, covers, branding, images, inpainting, softgate]
impl: 234
---

# Impl 234 — Titles taken off Golden Age and Shadow Knight

[Impl 232](2026-09-15-remaining-covers-erased.md) worked the rest of #28's covers but skipped these two, because [Impl 233](2026-09-15-cover-encoding-restored.md) was re-rendering them from their pre-Impl-224 sources at the same time and editing them in parallel would have collided. They were recorded as **untested, not rejected** — the distinction mattered, because both titles turned out to be erasable.

`golden-age.png` loses `GOLDEN AGE`, `A Historical Epic` and its flourishes. `shadow-knight.png` loses `SHADOW KNIGHT` and `The Legendary Warrior Returns`. **As of this phase, five of the nine covers carry no baked text** — re-check against the images rather than against this line, per [cover-patch-measurement](../conventions/cover-patch-measurement.md); the count was stated as final four times between Impl 224 and 234 and a commit invalidated it within the hour each time.

## The hedge was worth making

Impl 232 could have written these off with the other four and been believed — four of seven titles had just failed, and "needs artwork" was the expected answer. Marking them untested cost a sentence and was the difference between two shipped covers and two covers waiting on an artist who was never needed.

Both titles sit on sky, which is the condition all three earlier successes shared. That was visible from the cover before any masking, which is what made "worth attempting" a claim rather than a hope.

## Mask geometry cost three attempts, and inverts an earlier lesson

Every previous failure in this series was fixed by **dilating wider** — Impl 230's drop shadow, Impl 231's glow, Impl 232's bloom. That instruction does not generalise, and `golden-age` is where it broke.

**Attempt 1** used two boxes, one around the title and one around the tagline, and left an uncovered band between them. The title's descenders and their shadow sat in that gap: half in the sampling ring, half out. The fill smeared them into dark horizontal streaks across the sky, invisible at 45% and obvious at 1:1.

**Attempts 2 and 3** tried to spare the temple's upturned eave, which the tagline's left flourish sits on — first by excluding a polygon below the eave line, then by cutting the box's lower edge for the left half. **Both destroyed more of the roof, not less.** Excluding dark pixels from the mask _core_ does nothing about the dilation around neighbouring letters, which sweeps the same region regardless. A narrower core with the same dilation is not a narrower hole.

The shipped mask is a single box with dilation 18 — wider than any of the attempts that tried to protect the roof, and the one that damages it least.

So: **dilate wide, but leave no gaps.** Those are different instructions and the second one is new here. A gap inside a mask is worse than no mask at all, because content that is half-sampled gets dragged rather than replaced.

## Verification

- **`golden-age`** — title box held **12,798 pixels below the 30% dark threshold before, 331 after**. The survivors sit at `195-297 x 136-160`, which is the temple's upturned eave corner, not a letterform. Tagline box: **3,157 → 0**. All change inside `674x199+165+24`.
- **`shadow-knight`** — title box held **19,658 pixels over the 35% brightness threshold before, 2,545 after**. The survivors are a single blob at the box's right edge: the moon's glow reaching in, which was always there. Tagline box: **1,851 → 0**. All change inside `503x287+251+24`.
- **No ghosting** on either under contrast stretch ([Impl 231](2026-09-15-love-in-seoul-lockup-removed.md)'s probe).
- **Outside the patches: 59.8 dB and 60.3 dB**, worst pixel 4 and 3 of 255. Both files got _smaller_ — 1.32 MB from 1.36, and 1.10 MB from 1.18.
- 791 tests pass; both clean at 192px and 384px.

## Honest limit

`golden-age`'s temple eave corner is blurred where the title's descenders and glow overlapped it. Visible at 1:1, invisible at 384px, and the reason the single-box mask shipped over the two that tried to protect it — they looked more careful and were worse. Same class as [Impl 232](2026-09-15-remaining-covers-erased.md)'s `CHLOE` patch on the library arch: a smooth fill reads as atmosphere on sky, cloud or rock and as damage on a built structure.

`shadow-knight` has no structural conflict. The moon sits clear to the right of the title and the background is night cloud throughout.

## Left open

- **Four titles, each blocked by a specific element behind the text**: `blood-moon` (moon), `ocean-dreams` (mast and rigging), `forest-spirit` (canopy), `the-last-horizon` (constellation field). All four were attempted in Impl 232 and rejected on the result. These need artwork.
- Everything else in [#28](https://github.com/Key9898/soft-gate-comic/issues/28) and the [brief](../references/cover-artwork-brief.md), which still asks for 3:4 native at 1152x1536 — none of this work changes the aspect ratio or the crop.

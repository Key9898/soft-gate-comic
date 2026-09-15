---
title: Impl 232 — What can be erased on the remaining covers, and what cannot
type: note
date: 2026-09-15
tags: [portal, covers, branding, images, inpainting, softgate]
impl: 232
---

# Impl 232 — What can be erased on the remaining covers, and what cannot

[Impl 229](2026-09-15-cyber-dreams-badge-erased.md), [230](2026-09-15-last-horizon-credits-erased.md) and [231](2026-09-15-love-in-seoul-lockup-removed.md) each took text off one cover. This worked the rest of the set at once. Three covers lost text, three were left alone, and **the split is the result** — the erasures are routine applications of 229–231, while the rejections are what the change actually established.

## Erased

| Cover              | Removed                                                                                           |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| `campus-life.png`  | Title, tagline, stars, both ornament blossoms, all four character names — now **fully text-free** |
| `cyber-dreams.png` | `CYBER DREAMS` and `A SCI-FI ADVENTURE` — now **fully text-free**                                 |
| `blood-moon.png`   | Tagline and `SEASON 1 \| WRITTEN & ILLUSTRATED BY NIGHTMARE`; title stays                         |

## Rejected — attempted first, so the rejection rests on a result

Each of these was masked, filled and looked at before being abandoned. That matters: [Impl 224](2026-09-15-cover-branding-removal.md) rejected `cyber-dreams` by inspection and was right, but Impl 229 then showed the stated reason ("blur yields a smear") was a property of the _operation_, not the artwork. An unattempted rejection carries no information about which of those it is.

- **`blood-moon.png` title** — sits on the moon's upper limb, and its red glow is the lighting rather than decoration. A loose box mask and a tight letterform mask both smeared the moon into a blob.
- **`ocean-dreams.png` title** — the ship's mast, rigging and flag pass behind it. The fill severed the mast and left the flag floating in sky.
- **`forest-spirit.png` title** — dense canopy behind it. The fill leaves a flat pale-green oval conspicuous even at 183px, which is the one size that must hold.
- **`the-last-horizon.png` title** — the fill was flat, and regrain fixed it by pasting a **duplicate constellation** into the middle.

## The rule this change establishes

**Remove text only where the background can be reconstructed from its own surroundings. Never where content has to be invented or duplicated.**

`the-last-horizon` is what forced it. The flat fill was obviously unacceptable, and the regrain that fixed it was worse — a recognisable constellation cloned into open sky is [Impl 224](2026-09-15-cover-branding-removal.md)'s duplicate temple roof, fourth occurrence. Every donor patch in that sky carries a constellation, rune circle, moon or light streak; there is no plain starfield to take. Synthesising star dots would have worked visually and is exactly what the rule forbids.

`cyber-dreams` passes the rule and is worth contrasting, because its regrain looks like the same move. The donor is a strip of sky **directly above the title in the same columns**, mirror-tiled — so the rain streaks it restores are that sky's own rain, at that sky's own angle and spacing. Same technique, opposite verdict, and the discriminator is provenance rather than appearance.

**A flat blob and a cloned constellation are both failures.** The flat one announces itself and the clone does not, which makes the clone the more dangerous of the two and is why it keeps shipping.

## It answers the question Impl 231 opened

Impl 231 corrected #28's blanket claim that baked titles cannot be erased, and left erasability as a per-cover question. Answered: **four of seven titles are not erasable**, and in every case for the same structural reason — a load-bearing element of the composition runs behind the text. A title on open sky comes off. A title on a moon, a mast, a canopy or a constellation field does not. The property that decides it is not the title; it is what is behind it.

## Verification

Re-measured against `af3abf7^` rather than copied from the commit:

- **Change is contained.** Pixels differing by more than 2% sit inside `470x84+277+926` (`blood-moon`), `639x468+208+50` (`campus-life`) and `511x214+262+33` (`cyber-dreams`).
- **The text is gone.** `blood-moon`'s bottom band held **8,782 pixels over the 35% brightness threshold before and 0 after**. `campus-life`'s title box: **15,609 below the 30% dark threshold before, 13 after**; the four name boxes: 587, 530, 342 and 545 before, **0 in all four** after. `cyber-dreams`' title box: **15,454 over 45% before, 457 after** — and the survivors are a single blob at the lower right, which is the character's hair entering the box, not a letterform.
- **No ghosting.** A contrast-stretched view of each filled region shows no trace of glyph shapes. This is the [Impl 231](2026-09-15-love-in-seoul-lockup-removed.md) probe, now standard.
- **Outside the edited regions: 56.8, 57.6 and 59.7 dB**, worst pixel 4 of 255. `cyber-dreams` takes a **third** JPEG generation at q100 4:4:4 and still measures 59.7 dB — and got _smaller_, 1.396 MB against 1.405 MB. Generational loss at these settings is not the constraint it looked like in Impl 224.
- 791 tests pass; all three are clean in the 192px and 384px AVIF the browser serves.

## Honest limits

- **`campus-life`'s `CHLOE` patch lands on the library's arched doorway and loses the arch.** It is the only patch in this set that fell on architecture. On wet asphalt, shadowed rock, canopy or sky a smooth fill reads as atmosphere; on a hard-edged built structure it reads as damage. That is a sharper version of the rule above — provenance decides whether a fill is _possible_, and the background's own character decides whether it is _invisible_.
- `campus-life`'s erased title area is a large smooth sky where clouds used to be.
- `blood-moon`'s erased band reads as ground mist, which happens to suit the cover. That is luck, not method.

## Kept deliberately

`University Library` on the campus building, and the neon shop signs (`RAMEN`, `TECHNO`, `CYBERNETICS`, `NEO-KYO 2149`) on `cyber-dreams`. These are signage **inside the illustrated world**, not catalogue fields duplicated as artwork, and [#28](https://github.com/Key9898/soft-gate-comic/issues/28) is about the latter. The [brief](../references/cover-artwork-brief.md)'s no-text rule is aimed at text that competes with `BookCard`'s live strings; a shop sign competes with nothing.

## Left open

- **Four titles, each blocked by a specific element behind the text**: `blood-moon` (moon), `ocean-dreams` (mast and rigging), `forest-spirit` (canopy), `the-last-horizon` (constellation field). These need artwork, and the brief already specifies it.
- `golden-age.png` and `shadow-knight.png` were untouched here because they were being re-rendered from their pre-Impl-224 sources in parallel — that work landed as [Impl 233](2026-09-15-cover-encoding-restored.md). Their taglines still need checking against the rule above.
- Everything else in [#28](https://github.com/Key9898/soft-gate-comic/issues/28) and the [brief](../references/cover-artwork-brief.md).

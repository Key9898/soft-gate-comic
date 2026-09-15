---
title: Cover artwork replacement brief
type: reference
date: 2026-09-15
tags: [covers, artwork, brief, images, softgate]
---

# Cover artwork replacement brief

For whoever produces the replacement covers, tracked in [#34](https://github.com/Key9898/soft-gate-comic/issues/34). Nine files. No code change is needed to accept them.

> **Status, 2026-09-15.** [#28](https://github.com/Key9898/soft-gate-comic/issues/28) is closed: every piece of baked text that could be removed by editing the raster has been removed (Impl 229–234), and **five of the nine covers now satisfy the no-text rule below** — `campus-life`, `cyber-dreams`, `love-in-seoul`, `golden-age`, `shadow-knight`. What is left needs an artist and lives on #34. **The format requirements in this brief still apply to all nine**, because none of that work changed the aspect ratio: every cover is still a 1024 square losing roughly 12.5% off each side.

## The one rule

**The artwork must contain no text.**

Every current cover renders its own title into the image, and most add a tagline, a season number, credits, or another platform's brand. The page already renders all of that as live text directly beneath the cover, so today every series name appears twice in two different typefaces.

Specifically, none of this belongs in the image: title, subtitle or tagline, author or artist credit, season or episode number, status ("Coming Soon", "Draft"), rating, genre label, platform branding.

All of it already exists as catalog data and is already drawn by the UI. Removing it from the image loses nothing.

### Why this matters more than it looks

Baked text makes a cover **impossible to localise**. The portal ships English and Burmese, and the Burmese locale swaps every live string but cannot touch a picture. `love-in-seoul.png` had `서울의 사랑 / Love in Seoul` painted into it — Korean — while the catalog's Burmese title for that series is `ဆိုးလ်မြို့က ချစ်ခြင်းတရား`, so a Burmese reader saw one title in the text and a different one, in a third language, in the art. That lockup was removed in [Impl 231](../notes/2026-09-15-love-in-seoul-lockup-removed.md); the point stands for any cover that bakes a title.

A text-free cover works in both locales and in any locale added later.

## Deliverables

Nine PNG files, replacing these exactly. **Keep the filenames** — they are referenced by `packages/shared/src/data.ts`.

| File                   | Title (en)       | Title (mm)                 | What it is                                                      |
| ---------------------- | ---------------- | -------------------------- | --------------------------------------------------------------- |
| `the-last-horizon.png` | The Last Horizon | _(untranslated)_           | Magic and technology clash; a hero must rise to save humanity   |
| `love-in-seoul.png`    | Love in Seoul    | ဆိုးလ်မြို့က ချစ်ခြင်းတရား | A heartwarming love story in the bustling streets of Seoul      |
| `shadow-knight.png`    | Shadow Knight    | _(untranslated)_           | An elite soldier emerges from the shadows to protect the nation |
| `ocean-dreams.png`     | Ocean Dreams     | _(untranslated)_           | An adventure across the seven seas                              |
| `golden-age.png`       | Golden Age       | ရွှေခေတ်                   | An epic historical saga set in ancient times                    |
| `forest-spirit.png`    | Forest Spirit    | _(untranslated)_           | A magical journey through enchanted forests                     |
| `blood-moon.png`       | Blood Moon       | သွေးနက်လ                   | A terrifying horror story                                       |
| `cyber-dreams.png`     | Cyber Dreams     | _(untranslated)_           | A sci-fi adventure in a cyberpunk world                         |
| `campus-life.png`      | Campus Life      | တက္ကသိုလ်ဘဝ                | Daily life stories of university students                       |

Five of the nine have no Burmese title yet — that is a separate content gap, not an artwork one, but it is worth knowing that those cards currently show English in both locales.

## Format

**Deliver at 3:4 portrait, 1152 x 1536 px.** This is a change from the current files and it matters.

The existing covers are 1024 x 1024 squares, while every surface renders them in a 3:4 portrait frame with `object-cover`. That discards about 12.5% off each side — a quarter of the artwork is downloaded and thrown away, and any composition placed near the left or right edge is cut. Delivering 3:4 natively means the frame shows exactly what was drawn.

- PNG, RGB, no alpha needed (the frame is always fully covered)
- 1152 x 1536 is the largest size the build needs; it generates everything smaller
- Do not hand-optimise. The build re-encodes and generates AVIF/WebP at four widths

## Composition and safe areas

The cover is rendered as a physical hardcover, so a few regions are covered by UI or styling. Keep anything essential — a face, a focal object — out of them.

**Left edge, 0–5% of width.** A spine gradient is painted over this strip: a dark band, then a bright highlight, fading out by 5%. It is decorative and always present. Artwork under it is dimmed and tinted.

**Right edge, 96–100%.** A lighter version of the same edge treatment.

**Top-left corner, roughly 60 x 60 px of the rendered frame.** "New" and "Premium" badges stack here.

**Top-right corner, roughly 80 x 70 px.** Rating chip and content-rating badge stack here.

**Bottom-left corner.** On ranking rails, a large numeral (1, 2, 3…) is drawn over the art at roughly 1.2x scale. It is bold and high-contrast; busy detail behind it reads badly.

**Bottom edge, 3 px.** A reading-progress bar on library cards.

**Corner radius.** The frame uses asymmetric hardcover corners — 3px on the left, 10px on the right. Nothing needs to be drawn for this, but do not place critical detail in the extreme corners.

## Where covers appear, and at what size

| Surface                                    | Rendered width |
| ------------------------------------------ | -------------- |
| Discovery and library cards                | up to 183 px   |
| Series detail and Home hero (3D hardcover) | up to 384 px   |
| Social share image (`og:image`)            | 340 x 510 px   |

Everything is small. **Readability at 183 px is the test that matters** — that is where most visitors meet the cover. A composition that resolves only at full size will not work here. This is also the practical argument for removing text: at 183 px a baked tagline is illegible noise, while the live title beneath it is sharp at any size because it is real text.

Note the share image is a generated composite — the cover is placed on a blurred version of itself with the SoftGate logo beside it. Nothing extra is needed for it.

## Handing the files over

Drop the nine files into `apps/portal/public/webtoon-covers/`, keeping the names, then run:

```bash
pnpm --filter @softgate/portal generate:images
```

The build runs this too, so a deploy regenerates automatically.

Two guards will catch mistakes rather than letting them ship:

- Replacing a file without regenerating fails `pnpm check` with the exact command to run — a sha256 per source is pinned in `image-variants.json`.
- Adding a cover the catalog does not reference fails `pnpm check` naming the file. If a new series is being added, its entry in `packages/shared/src/data.ts` must come with it.

## Still outstanding until this lands

Tracked on [#34](https://github.com/Key9898/soft-gate-comic/issues/34). Each of these was masked, filled and reviewed at full resolution before being judged unfixable — the attempts are recorded so nobody repeats them.

**Four covers still bake their titles.** In every case a load-bearing element of the composition runs behind the text, so an in-place fill has nothing to reconstruct from:

| File                   | Text                                                  | What is behind it                                   |
| ---------------------- | ----------------------------------------------------- | --------------------------------------------------- |
| `blood-moon.png`       | `BLOOD MOON`                                          | The moon's upper limb; its red glow is the lighting |
| `ocean-dreams.png`     | `OCEAN DREAMS` + `An Adventure Across the Seven Seas` | The ship's mast, rigging and flag                   |
| `forest-spirit.png`    | `FOREST SPIRIT` + `A MAGICAL JOURNEY`                 | Dense canopy                                        |
| `the-last-horizon.png` | `THE LAST HORIZON` + `AN EPIC FANTASY ADVENTURE`      | A constellation field                               |

**One residual artefact.** `shadow-knight.png` carries a Gaussian-blur patch at `209x31+408+288` where Impl 224 erased `A Webtoon Original`: 0.47 high-frequency energy where the surrounding sky measures 1.64–3.15, about 4x flatter than it should be. Visible at 1:1, invisible at 183px and 384px. A redo was attempted and abandoned — see [Impl 234](../notes/2026-09-15-golden-age-shadow-knight-titles.md) and the #34 thread. `golden-age.png` has the same class of patch and it is **inert**, so there is nothing to do there.

**All nine still need the format work** in _Format_ above, regardless of text.

## Related

- [Impl 223](../notes/2026-09-15-responsive-image-pipeline.md) — the variant pipeline and the staleness manifest
- [Impl 224](../notes/2026-09-15-cover-branding-removal.md) — branding removal, and why editing raster artwork is a poor substitute for replacing it
- [Impl 225](../notes/2026-09-15-orphan-cover-removed.md) — the orphan guard
- [Impl 229](../notes/2026-09-15-cyber-dreams-badge-erased.md) — masked push-pull fill, the technique that replaced blur-erasure
- [Impl 231](../notes/2026-09-15-love-in-seoul-lockup-removed.md) — the first cover to satisfy this brief's no-text rule
- [Impl 232](../notes/2026-09-15-remaining-covers-erased.md) — which titles can be erased and which cannot, and why
- [Impl 234](../notes/2026-09-15-golden-age-shadow-knight-titles.md) — the last two covers cleared, and the mask-gap lesson
- [book-cover-presentation](../conventions/book-cover-presentation.md) — the hardcover metaphor these covers sit inside

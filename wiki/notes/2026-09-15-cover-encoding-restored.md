---
title: Impl 233 — Two covers restored to full colour after a 256-colour re-encode
type: note
date: 2026-09-15
tags: [portal, covers, images, encoding, branding, softgate]
impl: 233
---

# Impl 233 — Two covers restored to full colour after a 256-colour re-encode

[Impl 224](2026-09-15-cover-branding-removal.md) erased "Webtoon Original" from `golden-age.png` and "A Webtoon Original" from `shadow-knight.png`, then wrote both back as **8-bit colormap PNG**. The erasure was right; the encoder was not. This re-applies the erasure to the pre-224 sources and keeps them full colour.

## What the sources actually are

All nine covers are **JPEG at quality 100, 4:2:0 chroma**, carrying a `.png` extension:

```
magick identify -format "%f %m colors=%k\n" apps/portal/public/webtoon-covers/*.png
```

Impl 224 never ran that, and the mistake cascaded. Sharp's lossless PNG re-encode of a lossy JPEG was naturally much larger than the source (1037 -> 2653 kB); read as a PNG problem, it was answered with `palette: true`, which quantised two neon/gradient illustrations to 256 colours. The correct response to "the PNG encoder inflates this" is "then it was not a PNG" — **identify the format before choosing an encoder for it.**

## The damage, measured

Measured with the erased rectangle neutralised, so every figure below is damage to artwork Impl 224 never intended to touch:

|                                        | PSNR         | worst pixel | pixels changed (of 1,048,576) |
| -------------------------------------- | ------------ | ----------- | ----------------------------- |
| `golden-age` 256-colour vs. source     | **37.14 dB** | 70/255      | 1,036,670 (98.9%)             |
| `shadow-knight` 256-colour vs. source  | **39.50 dB** | 139/255     | 1,001,810 (95.5%)             |
| `golden-age` this change vs. source    | **54.46 dB** | 4/255       | 238,750                       |
| `shadow-knight` this change vs. source | **55.04 dB** | 4/255       | 203,141                       |

A smooth sky patch (`200x120+780+180`) on `golden-age` held **7,030 distinct colours** in the source, **137** after quantisation, and **6,976** now.

Impl 224's "no banding" was not wrong about banding — sharp's quantiser dithers, so the artefact is added grain across smooth gradients rather than hard steps. It was wrong about what to look for. A worst pixel 70 of 255 on a step that was supposed to be a format change is the number that mattered, and it is trivially available.

## Method

The technique is unchanged from Impl 224 — a Gaussian blur of the whole cover composited back under a cosine-falloff alpha mask built as raw pixels. Two changes:

**The feather is specified in pixels, not as a fraction of the region.** Impl 224's `0.10 / 0.16` fractions put the outermost glyphs inside the alpha ramp: reproducing them left a visible ghost `W` and `l` on `golden-age`, faint enough to pass at card size and obvious at 1:1. The region is now the measured glyph box grown by exactly the ramp width on each side, so the glyphs are in the full-alpha core by construction and cannot half-survive:

| cover           | glyph box (1:1)   | region           | ramp   |
| --------------- | ----------------- | ---------------- | ------ |
| `golden-age`    | 417–610 x 186–211 | `238x44+395+177` | 22 x 9 |
| `shadow-knight` | 420–604 x 294–313 | `229x38+398+285` | 22 x 9 |

**Sigma 24**, up from the ~16 that best fits Impl 224's shipped patch. Lower sigmas erase the letterforms but leave a darker residue from their drop shadows.

**Encoded JPEG quality 100, 4:4:4**, following [Impl 229](2026-09-15-cyber-dreams-badge-erased.md)'s finding that re-encoding at the source's own 4:2:0 costs a second generation of chroma subsampling on saturated edges. 1.36 MB and 1.18 MB, against 610/649 kB for the palette PNGs and 1.06/0.95 MB for the sources. The sources are the `<img>` fallback in `responsiveImage.ts`, so this is not only a repository cost — it is the right trade anyway, since the AVIF/WebP rungs a browser actually fetches are derived from these and inherit whatever is thrown away here.

## Verification

- Full-resolution A/B against the source on both covers: no residual glyph, no hard mask edge.
- `pnpm --filter @softgate/portal generate:images` — 9 sources -> 90 variants; both `sha256` entries updated in `image-variants.json`.
- Branding absent in the delivered `-384.avif`, which is what the browser fetches.
- `pnpm --filter @softgate/portal test:run` — 109 files, 791 tests, green.

## The transferable part

Impl 224's own lesson was **diff a patch against the original at full resolution**, learned from a clone-stamp that pasted in a duplicate temple roof. The encoder change broke the same rule one level up and got away with it, because re-encoding does not feel like an edit — no region is chosen, no pixels are drawn, the diff is invisible at delivery size. It changed 95%+ of both files.

**An encoder change is an edit to every pixel and earns the same A/B as a patch.** The check is two commands, and it is the check Impl 224 already knew to run.

## Left open

- ~~`wiki/` has no entry for **Impl 229** (`3a89667`, the Cyber Dreams badge removal); it shipped as code only.~~ Written retroactively: [2026-09-15-cyber-dreams-badge-erased.md](2026-09-15-cyber-dreams-badge-erased.md).
- ~~**Impl 230 (`6e47e55`) and 231 (`a2f5e4f`) shipped as code only too**, landing on `development` while this work was in review.~~ Also written retroactively: [Impl 230](2026-09-15-last-horizon-credits-erased.md), [Impl 231](2026-09-15-love-in-seoul-lockup-removed.md), each with its figures re-measured against its own parent rather than copied from its commit. **Impl 232 (`af3abf7`) then landed undocumented as well** — four consecutive phases now, and this note has twice claimed a final count that a new commit invalidated within the hour. Its row says `code only, no note`; the note is not written here.
- Everything else in [#28](https://github.com/Key9898/soft-gate-comic/issues/28): baked-in titles on **six of nine** covers as of Impl 232 — `campus-life`, `cyber-dreams` and `love-in-seoul` are now fully text-free, and `blood-moon` keeps only its title. Blur-erasure and inpainting are both stopgaps for a brand-name problem; `wiki/references/cover-artwork-brief.md` is still the actual fix.

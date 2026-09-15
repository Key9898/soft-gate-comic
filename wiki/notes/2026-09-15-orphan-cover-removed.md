---
title: Impl 225 — Orphaned draft cover deleted, orphan guard added
type: note
date: 2026-09-15
tags: [portal, covers, dead-assets, tests, softgate]
impl: 225
---

# Impl 225 — Orphaned draft cover deleted, orphan guard added

[#28](https://github.com/Key9898/soft-gate-comic/issues/28) listed a baked **"Comming Soon"** typo on `draft-story.png` — two m's, rendered into the pixels and therefore not fixable in code. The task was to fix the typo. Checking first showed the typo was not the defect.

## The file was never rendered

`draft-story.png` is referenced by nothing. No component, no route, no catalog entry. `packages/shared/src/data.ts` holds nine literal `coverImage: '/webtoon-covers/…'` values against ten files on disk, and no cover path anywhere is built dynamically, so there is no runtime path that could reach it. The draft series in the same file (`draft-1-99`) uses `the-last-horizon.png`.

So it was 486 kB copied into `dist/client` on every build, generating eight AVIF/WebP variants on every regeneration, for an image no visitor could see. Repairing the typo would have been correcting text nobody reads, in a file that should not ship.

Deleted. That removes the typo outright and takes one of #28's unfilled `[Author Name]` placeholders with it. Variants drop from 90 to 82 and the manifest from 11 sources to 10. The file stays recoverable from history if a draft-cover feature ever wants it.

## Why this could sit unnoticed

Nothing was watching. An unreferenced asset produces no error, no warning and no failing test — it just quietly costs bytes, and in this case hid two content defects (the typo and the placeholder) from anyone who might have reported them, because no one could see the image to notice.

`imageVariants.test.ts` now asserts that every committed cover is referenced by the catalog. Watched failing first by restoring the file:

```
unreferenced cover(s): draft-story.png: expected [ 'draft-story.png' ] to deeply equal []
```

The guard only covers `/webtoon-covers/`. A live catalog serves covers from R2, which this cannot and should not police — the point is local committed assets, which are the ones that ship in the bundle whether or not anything uses them.

## Verification

`pnpm check` green: 6/6 tasks, 109 portal + 38 API test files.

## Related

- [Impl 223](2026-09-15-responsive-image-pipeline.md) — the variant pipeline and its staleness manifest
- [Impl 224](2026-09-15-cover-branding-removal.md) — competitor branding removed from two covers

## Left open on #28

`cyber-dreams.png`'s `WEBTOON` badge (needs artwork), `[AUTHOR NAME]` / `[ARTIST NAME]` on `the-last-horizon.png`, and baked-in titles on all nine remaining covers — the reason covers cannot be localised.

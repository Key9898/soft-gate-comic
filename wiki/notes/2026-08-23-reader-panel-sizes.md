---
title: Impl 166 — Reader imageSizes consume + Admin wiki item 21
type: note
date: 2026-08-23
tags: [reader, images, cls, imageSizes, admin, contract, softgate]
impl: 166
---

# Impl 166 — Reader imageSizes consume + Admin wiki item 21

Portal consume for optional per-panel sizes. At ship, Admin item 21 was markdown only. Admin persist later shipped as Admin **Impl 27**. Demo omits `imageSizes`. Schema version stays **13**. CLS ≤ 0.1 is **not** claimed.

## Portal

- `Episode.imageSizes?: Array<{ width: number; height: number } | null>`
- `panelPixelSize` in `src/lib/catalog/seriesReading.ts`
- `ReaderPanelImage` sets `width`/`height` only when the helper returns both integers > 0
- 165 LCP hints unchanged
- `applyCatalogSeed` unchanged in this Impl (identity in **167**)

## Admin wiki

[`website-integration.md`](../../../soft-gate-comic-admin-dashboard/wiki/references/website-integration.md) work list **21**. Three buckets: portal 162/165 shipped, portal 166 consume, Admin persist **Impl 27 shipped**.

## Next

Next free Impl **170**. Genre overflow chevron shipped in **169**. Guessed strip bones stay parked. Catalog wipe lifted in **167**. CLS ≤ 0.1 waits on QA measure of a Reader episode that has Admin-persisted `imageSizes`. Do not measure Demo `/read/1/1`. Do not claim from persist or consume alone.

## Related

- [reader-chrome.md](../conventions/reader-chrome.md)
- [2026-08-23-reader-panel-priority.md](2026-08-23-reader-panel-priority.md) (165)

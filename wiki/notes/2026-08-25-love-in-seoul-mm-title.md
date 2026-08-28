---
title: Impl 177 — Love in Seoul MM title
type: note
date: 2026-08-25
tags: [catalog, i18n, mock, schema, softgate]
impl: 177
---

# Impl 177 — Love in Seoul MM title

Demo series id `2` MM title is literary `ဆိုးလ်မြို့က ချစ်ခြင်းတရား`. EN stays `Love in Seoul`. Cover file unchanged.

## What shipped

- `mockPopularWebtoons`, `mockWebtoons`, and Love in Seoul episode `webtoonTitle.mm` in `@softgate/shared`
- Daily `sched-2` inherits via `scheduledDrop` (`webtoonTitle: series.title`)
- `SHARED_DATA_SCHEMA_VERSION` **14** so stored schema-13 blobs reseed (Impl 167 `applyCatalogSeed` is identity)
- Envelope bump only — `SharedData` / `PublishedCatalog` field names unchanged

## Exception vs Impl 96

Impl 96 kept Latin MM for cover-brand names. Love in Seoul is the one literary MM exception (same meaning: Seoul + love, particle **က**). Forest Spirit stays Latin `Forest Spirit` (gender-neutral EN; do not add `နတ်သမီး`). Horizon / Shadow Knight / Ocean Dreams / Cyber Dreams stay Latin MM. Golden Age `ရွှေခေတ်`, Blood Moon `သွေးနက်လ`, Campus Life `တက္ကသိုလ်ဘဝ` unchanged.

## Out

- EN titles, cover PNGs, Admin repo
- `applyCatalogSeed` identity
- `wiki/references/admin-coin-packages.md` (Admin writer still envelope 13)

Same-origin Admin blobs on schema 13 are rejected by portal until Admin bumps or re-saves. Demo refresh is the schema gate.

Convention: [catalog-tiles.md](../conventions/catalog-tiles.md), [discovery-honesty.md](../conventions/discovery-honesty.md).

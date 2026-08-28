---
title: Impl 167 — Trust stored catalog (stop seed wipe)
type: note
date: 2026-08-23
tags: [catalog, localStorage, applyCatalogSeed, admin, pipe, softgate]
impl: 167
---

# Impl 167 — Trust stored catalog (stop seed wipe)

Portal **Website must match**. `applyCatalogSeed` is identity. A schema-**13** stored catalog (Admin edits, `imageSizes`) survives `loadFromLocalStorage`. Empty catalogs stay empty. Schema is **not** bumped.

Demo refresh: missing key / schema mismatch → first-run mocks; bump `SHARED_DATA_SCHEMA_VERSION` when the mock seed itself must replace browsers. Leftover 2023 dates: clear `softgate-shared-data` once.

CLS ≤ 0.1 is **not** claimed. Admin persist is Impl **27** (wiki item 21) shipped. Genre overflow chevron shipped in **169** (Continue rail still conditional).

## Files

- `packages/shared/src/data.ts`
- `src/test/catalogLib.test.ts`
- `wiki/conventions/discovery-honesty.md`, `catalog-tiles.md`, `reader-chrome.md`
- `wiki/notes/2026-08-23-trust-stored-catalog.md` (this note)

## Next

Next free Impl **170**. Genre chevron shipped in **169**. CLS ≤ 0.1 waits on QA measure of a sized episode.

## Related

- [2026-08-17-stale-catalog-localstorage.md](2026-08-17-stale-catalog-localstorage.md) (98)
- [2026-08-23-reader-panel-sizes.md](2026-08-23-reader-panel-sizes.md) (166)

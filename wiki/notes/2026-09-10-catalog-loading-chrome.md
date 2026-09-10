---
title: Impl 210 — Honest catalog loading chrome
type: note
date: 2026-09-10
tags: [loading, skeleton, catalog, honesty, softgate]
impl: 210
---

# Impl 210 — Honest catalog loading chrome

Catalog-gated loading no longer invents a full title library. Page skeletons keep live chrome and fill module bodies with copy-free `CatalogBusyPanel` wells (empty-panel **shape**, not empty **copy**).

## What shipped

- `CatalogBusyPanel` — same box + BookOpen circle as `CatalogEmptyPanel`; no title, description, Help/Creators; no `role="status"` (callers wrap `SkeletonSection`).
- Home, Categories, Search landing/query, hub, Author, Library skeletons drop `SkeletonBookCard` / Daily lip / compact cover grids.
- Home: banner + `home.pageHeading`; genre well; Start here **xor** Continue; no For You; live rail headings; no View All; seven live weekday labels; `registrationOpen` on the journey CTA.
- Categories: live masthead/filters; empty genre chip row; one grid well; no count line.
- Search landing: no View All, no Go Here, no genre chevron; browse-genres well. Query: All genres only (no 8 named bones); one result well.
- Hub: no cover/thumbs/`hub-next-drop-slot`; live episode tab labels without counts.
- Reader unchanged. Account skeletons unchanged. `discovery.ts` and Impl 208 radial View All unchanged.

## Out

- Empty copy on the loading paint
- `isLoading || length === 0`
- Forced-product-motion on skeleton pulse
- Thinning live empty Home rails

Convention: [loading-states.md](../conventions/loading-states.md), [discovery-honesty.md](../conventions/discovery-honesty.md).

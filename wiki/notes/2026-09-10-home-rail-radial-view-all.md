---
title: Impl 208 — Home rail Radial Cards View All
type: note
date: 2026-09-10
tags: [home, discovery, radial, modal, motion, softgate]
impl: 208
---

# Impl 208 — Home rail Radial Cards View All

Home Popular, Updated, and New Releases **View All** open one shared radial-cards dialog of that rail’s existing six-pack. Catalog discovery is unchanged. Search View All stays page links. Nav `/ranking` and `/categories?sort=new` stay. Trending still has no View All. Numbers **205–207** were skipped as mandated; next is **209**.

## What shipped

- `HomeRailRadialModal` — dedicated full-stage dialog (not `Modal.tsx`). Reuses `useScrollLock` + `useFocusTrap`. Center card → `/webtoon/:id`. Side cards rotate that item to center. Prev/Next wrap. One-item list hides wrap controls.
- Variant chrome matches the rail: ranking uses list-order `rank={index + 1}`; Updated uses `dateKind="updatedAt"` and no rank; New uses `createdAt` + existing New badge and no rank. Modal never re-sorts or re-filters.
- `HomeCatalogRail`: `onViewAll` renders a button (Home); `viewAllTo` still renders a `Link` (Search). `HomeRankingChart` is Home-only and uses `onViewAll`. Empty rails still hide View All.
- Forced product motion: `.home-radial-slot` transform/opacity and dialog/backdrop enter live at the root of `apps/portal/src/index.css`, not inside `prefers-reduced-motion: no-preference`, and are not killed in the reduce block.

## Out

- `discovery.ts`, Daily / Hero / Start here / For You / Trending
- New `/home/popular` (or similar) routes
- Search landing View All retarget
- Osmo source / polaroid landscape frames
- Stuffing the stage into `Modal.tsx`

Convention: [discovery-honesty.md](../conventions/discovery-honesty.md), [forced-product-motion.md](../conventions/forced-product-motion.md).

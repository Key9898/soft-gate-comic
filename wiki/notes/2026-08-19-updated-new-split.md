---
title: Home Updated vs New split
type: note
date: 2026-08-19
tags: [home, discovery, updated, new, softgate]
impl: 129
---

# Impl 129 — Home Updated vs New split for the return loop

Readers come back for what just moved vs what just launched. SoftGate does not fake a Mon–Sun Daily board (`uploadDay` is not in the mock). Home Updated and New already used `updatedAt` / `createdAt`. This Impl makes the jobs visible and non-overlapping.

## What shipped

- `updatedWebtoons` still sorts by `updatedAt`, then drops ids already in `newReleaseWebtoons` (same cap). Categories `?sort=recentlyUpdated` stays the full list.
- Copy: `home.updatedDesc` / `home.newReleasesDesc` (EN + MM) name the job the way Trending names velocity.
- Home Updated uses `Clock`; New uses `Sparkles` (same glyphs as Categories).
- `CatalogBookCard` `dateKind`: Home Updated and Categories recentlyUpdated print `updatedAt`. Every other catalog tile keeps `createdAt`.

## Verify

`npm run check`

Home: Updated and New descriptions + icons; no shared `/webtoon/` hrefs between the two rails. Categories recentlyUpdated: Shadow Knight date is `2 Aug 2026`, not `8 Jan 2026`.

## Next

Impl **130**

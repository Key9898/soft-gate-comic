---
title: Impl 190 — Library Subscribe, History, Likes HTTP persist
type: note
date: 2026-09-08
tags: [portal, api, library, persist, softgate]
impl: 190
---

# Impl 190 — Library Subscribe, History, Likes HTTP persist

Library three tabs (Subscribe / History / Likes) persist on the cookie API when `VITE_USE_MOCK_API=false`. Mock localStorage helpers are unchanged.

## What shipped

- `GET/POST /api/library/*` snapshot `{ bookmarks, history, likedWebtoonIds }`
- PersistPort on stub + Prisma; migration `20260908170000_reader_library`
- Portal `LibraryContext` / `EngagementContext` HTTP branch (wallet pattern)
- `syncSubscribeNotifications` stamp inject so HTTP does not write `softgate_library_v1`

## Honesty

- Ratings stay in `softgate_engage_v1` (same JSON as history/likes). HTTP may write that key for ratings; leftover empty `history` / `likedWebtoonIds` arrays are not source of truth.
- Notifications inbox and prefs stay localStorage (191 / 192).
- Login GET `/api/library/me` twice (Library bookmarks slice + Engagement history/likes slice).
- `LibraryLike.likedAt` exists so Prisma can return newest-first likes.

## Out

- Ratings HTTP, notifs/prefs HTTP, Author Follow, comments, R2, Admin, catalog CMS, `isMockApi()` invert

Convention: [portal-library-http.md](../conventions/portal-library-http.md).

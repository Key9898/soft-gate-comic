---
title: Impl 191 — Notifications inbox HTTP persist
type: note
date: 2026-09-08
tags: [portal, api, notifications, persist, softgate]
impl: 191
---

# Impl 191 — Notifications inbox HTTP persist

The notifications inbox persists on the cookie API when `VITE_USE_MOCK_API=false`. Mock localStorage helpers are unchanged. Prefs stay on `softgate_notif_prefs_v1` until Impl 192.

## What shipped

- `GET/POST /api/notifications/*` snapshot `{ notifications }`
- PersistPort on stub + Prisma; migration `20260908180000_reader_notifications`
- Portal `EngagementContext` HTTP branch: `inboxAll` + prefs-filtered display; GET once per login then sequential upsert
- `syncSubscribeNotifications` inbox IO so HTTP does not write `softgate_notifications_v1`

## Honesty

- Prefs stay local. API stores the full inbox; the portal filters with `isNotificationTypeEnabled`.
- Client still generates `new_episode` rows. API does not scan catalog.
- Login GETs: LibraryContext `/api/library/me` + Engagement `/api/library/me` + one `/api/notifications/me`.
- `ensureNotifications` still writes an empty mock key; HTTP must not call it.

## Out

- Prefs HTTP (192), ratings HTTP, comment → `comment_reply` wiring, Follow, R2, Admin, `isMockApi()` invert

Convention: [portal-notifications-http.md](../conventions/portal-notifications-http.md).

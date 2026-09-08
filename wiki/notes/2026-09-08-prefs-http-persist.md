---
title: Impl 192 — Notif toggles + reader prefs HTTP persist
type: note
date: 2026-09-08
tags: [portal, api, prefs, persist, softgate]
impl: 192
---

# Impl 192 — Notif toggles + reader prefs HTTP persist

Notification toggles and reader display prefs persist on the cookie API when `VITE_USE_MOCK_API=false`. Mock localStorage helpers are unchanged. Guest reader still writes `softgate_reader_prefs_v1`. No login merge. Do not seed.

## What shipped

- `GET /api/prefs/me`, `POST /api/prefs/notif`, `POST /api/prefs/reader`
- PersistPort on stub + Prisma; migration `20260908190000_reader_prefs`
- Portal `EngagementContext` HTTP branch: `prefsHydrated`, `readerPrefs`, zero writes to prefs keys
- `syncSubscribeNotifications` optional boolean `newEpisode` on inbox IO
- HTTP ReaderPage / Preferences persist after hydrate only; skeleton optional chrome props (no hooks)

## Honesty

- GET with no row returns defaults and does not insert.
- Inbox stays full on the API; portal filters with API prefs state, not leftover localStorage.
- Login GETs: library ×2 + notifications + one `/api/prefs/me`. Guest skips prefs GET.
- HTTP Profile Preferences: account copy, not “this device.”

## Out

- Ratings HTTP, email/push matrix, `i18nextLng`, pinch zoom, Follow, comments, R2, Admin, `isMockApi()` invert

Convention: [portal-prefs-http.md](../conventions/portal-prefs-http.md).

`pnpm check` green: portal 636 / 91 files; API 90 / 16 files.

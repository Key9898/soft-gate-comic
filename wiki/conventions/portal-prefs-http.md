---
title: Portal prefs HTTP
type: convention
date: 2026-09-08
updated: 2026-09-10
tags: [prefs, notifications, reader, http, persist, softgate]
impl: 192
impl_updated: 204
---

# Portal prefs HTTP

Notification toggles and reader display prefs source of truth depends on `VITE_USE_MOCK_API`.

## Mock on (`VITE_USE_MOCK_API` is not `false`)

Notif toggles stay on [`client-comments-notifications.md`](client-comments-notifications.md) `softgate_notif_prefs_v1` (per user). Reader display stays on [`reader-chrome.md`](reader-chrome.md) `softgate_reader_prefs_v1` (device blob, including logged-in mock). Unset `VITE_USE_MOCK_API` stays mock. Committed `.env.example` is `false`; Vite does not load it. Local `pnpm dev` HTTP uses gitignored `.env.development.local` plus `pnpm dev:api`.

## Mock off

Cookie API persist is source of truth for a **logged-in** reader. Do **not** write `softgate_notif_prefs_v1` or `softgate_reader_prefs_v1`. Guest reader still uses the device reader key. No login merge. Do not seed. Empty account returns defaults on GET without inserting a row.

| Method | Path                | Body                                                 | Notes                                  |
| ------ | ------------------- | ---------------------------------------------------- | -------------------------------------- |
| GET    | `/api/prefs/me`     | —                                                    | Snapshot or defaults. Does not insert. |
| POST   | `/api/prefs/notif`  | partial `{ newEpisode?, commentReply?, promotion? }` | At least one boolean. Merge. Upsert.   |
| POST   | `/api/prefs/reader` | `{ darkMode, brightness, fontSize, imageFit }`       | Full reader object. Upsert.            |

Auth required. 401 `NOT_AUTHENTICATED`. 400 `VALIDATION_ERROR`. POST JSON Content-Type required. Errors `{ error: { code } }`. Every success `{ data: { notifPrefs, readerPrefs } }`. Ignore unknown keys including `schemaVersion`. `brightness` finite in `[0.25, 1]`, stored to 2 decimal places.

Inbox stays 191: API stores the full list; portal filters with in-memory prefs from this snapshot (`prefsHydrated` before `applyInbox`). HTTP does **not** generate `new_episode` (Impl 204 Admin ping). Mock still runs `syncSubscribeNotifications`. Residual: turning `newEpisode` back on in HTTP does not catalog-backfill.

Guest skips prefs GET. Login GET is once per identity (`mock`, `authLoading`, `isAuthenticated`, `userId`). HTTP Profile Preferences uses account copy, not the device chip. HTTP ReaderPage / panel persist only after `prefsHydrated` and only when chrome differs from the snapshot. While `authLoading`, do not write the device key.

`isMockApi()` stays `!== 'false'`.

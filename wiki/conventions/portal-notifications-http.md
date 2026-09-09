---
title: Portal notifications HTTP
type: convention
date: 2026-09-08
updated: 2026-09-10
tags: [notifications, http, persist, softgate]
impl: 191
impl_updated: 204
---

# Portal notifications HTTP

Inbox source of truth depends on `VITE_USE_MOCK_API`. Prefs HTTP is Impl 192 ([portal-prefs-http.md](portal-prefs-http.md)).

## Mock on (`VITE_USE_MOCK_API` is not `false`)

[`EngagementContext`](../../apps/portal/src/context/EngagementContext.tsx) keeps `softgate_notifications_v1`. Unset `VITE_USE_MOCK_API` stays mock. Committed `.env.example` is `false`; Vite does not load it. Local `pnpm dev` HTTP uses gitignored `.env.development.local` plus `pnpm dev:api`.

## Mock off

Cookie API persist is source of truth. Do **not** write `softgate_notifications_v1` (including via `ensureNotifications` / `listNotifications` / `syncSubscribeNotifications` default IO). Keep `inboxAll` from the API and derive visible rows + unread with in-memory prefs from `/api/prefs/me` after `prefsHydrated`. HTTP does **not** run `syncSubscribeNotifications`. Mock still does.

| Method | Path                            | Body               | Notes                                   |
| ------ | ------------------------------- | ------------------ | --------------------------------------- |
| GET    | `/api/notifications/me`         | —                  | Full list or `[]`. Does not seed.       |
| POST   | `/api/notifications/upsert`     | `{ notification }` | Insert or replace by `id`.              |
| POST   | `/api/notifications/read`       | `{ id }`           | Missing id = 200 unchanged snapshot.    |
| POST   | `/api/notifications/read-all`   | `{}`               | Body required so `Content-Type` is set. |
| POST   | `/api/notifications/delete`     | `{ id }`           | Missing id = 200 unchanged.             |
| POST   | `/api/notifications/clear-read` | `{}`               | Drop `isRead` rows.                     |

Auth required. 401 `NOT_AUTHENTICATED`. 400 `VALIDATION_ERROR`. POST JSON Content-Type required. Errors `{ error: { code } }`. Every success `{ data: { notifications } }` sorted `createdAt` desc.

HTTP does **not** generate `new_episode` from a catalog scan. Admin `POST /api/internal/notifications/new-episode` writes inbox (Impl 204). GET `/me` is SoT. Sequential upserts only (stub persist is not concurrency-safe). GET inbox once per login, then sync from `inboxAll`. Guest skips GET. No login merge. Residual: turning `newEpisode` back on does not catalog-backfill.

`isMockApi()` stays `!== 'false'`.

Push subscribe/unsubscribe and VAPID public key live **on the same notifications app** as `/push/vapid`, `/push/subscribe`, `/push/unsubscribe` (full paths `/api/notifications/push/...`). Do not mount a second `app.route('/api/notifications/push')`. Inbox table and `/me` `/upsert` `/read` `/read-all` `/delete` `/clear-read` stay unchanged. Delivery pipe (Admin broadcast, Brevo, Web Push, `comment_reply` out-of-band): [portal-notifications-deliver.md](portal-notifications-deliver.md).

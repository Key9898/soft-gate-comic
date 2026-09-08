---
title: Portal library HTTP (subscribe, history, likes)
type: convention
date: 2026-09-08
tags: [library, bookmarks, history, likes, http, softgate]
impl: 190
---

# Portal library HTTP

Library Subscribe, History, and Likes source of truth depends on `VITE_USE_MOCK_API`.

## Mock on (`VITE_USE_MOCK_API` is not `false`)

[`LibraryContext`](../../apps/portal/src/context/LibraryContext.tsx) keeps [`library-bookmarks.md`](library-bookmarks.md): `softgate_library_v1`. History and likes stay on [`library-engagement.md`](library-engagement.md) `softgate_engage_v1`. Unset `VITE_USE_MOCK_API` stays mock. Committed `.env.example` is `false`; Vite does not load it. Local `pnpm dev` HTTP uses gitignored `.env.development.local` plus `pnpm dev:api`.

## Mock off

Cookie API persist is source of truth. Do **not** write `softgate_library_v1`. Do **not** treat `softgate_engage_v1` history/likes as source of truth.

| Method | Path                            | Body                                         | Notes                                                                                           |
| ------ | ------------------------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| GET    | `/api/library/me`               | —                                            | Empty arrays if none. Does not seed.                                                            |
| POST   | `/api/library/subscribe`        | `{ webtoonId, lastNotifiedEpisodeNumber? }`  | Toggle. On add, `addedAt` now.                                                                  |
| POST   | `/api/library/mute`             | `{ webtoonId, muted }`                       | No-op if not subscribed.                                                                        |
| POST   | `/api/library/stamp-notified`   | `{ webtoonId, episodeNumber }`               | No-op if not subscribed.                                                                        |
| POST   | `/api/library/history`          | `{ webtoonId, episodeNumber, scrollRatio? }` | One row per series. Omit `scrollRatio` = recordHistory preserve; include = progress clamp 0..1. |
| POST   | `/api/library/like`             | `{ webtoonId }`                              | Toggle, newest-first.                                                                           |
| POST   | `/api/library/remove-bookmarks` | `{ webtoonIds }`                             | Bulk.                                                                                           |
| POST   | `/api/library/remove-history`   | `{ webtoonIds }`                             | Bulk.                                                                                           |
| POST   | `/api/library/remove-likes`     | `{ webtoonIds }`                             | Bulk.                                                                                           |

Auth required. 401 `NOT_AUTHENTICATED`. 400 `VALIDATION_ERROR`. POST JSON Content-Type required. Errors `{ error: { code } }`. Every success `{ data: LibrarySnapshot }`.

Ratings stay on `softgate_engage_v1`. Notifications inbox HTTP is Impl 191 ([portal-notifications-http.md](portal-notifications-http.md)). Prefs HTTP is Impl 192 ([portal-prefs-http.md](portal-prefs-http.md)). Guest toggle still `/login` `from`. No login merge.

`isMockApi()` stays `!== 'false'`.

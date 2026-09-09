---
title: Portal comments HTTP (shared thread + comment_reply)
type: convention
date: 2026-09-09
tags: [comments, http, persist, notifications, softgate]
impl: 197
---

# Portal comments HTTP

Comments source of truth depends on `VITE_USE_MOCK_API`. Threads are **shared** (not per-user blobs), keyed by episode `` `${webtoonId}:${episodeNumber}` `` or series `` `${webtoonId}:series` ``.

## Mock on (`VITE_USE_MOCK_API` is not `false`)

[`CommentsThread`](../../apps/portal/src/components/Comments/CommentsThread.tsx) keeps [`softgate_comments_v1`](../../apps/portal/src/lib/comments/storage.ts). Unset `VITE_USE_MOCK_API` stays mock. Committed `.env.example` is `false`; Vite does not load it. Local `pnpm dev` HTTP uses gitignored `.env.development.local` plus `pnpm dev:api`.

Mock `addReply` in the thread: if the parent author is not the actor and that author’s `commentReply` pref is not false, [`addNotification`](../../apps/portal/src/lib/notifications/notifications.ts) with `type: 'comment_reply'`, `titleKey: 'notificationsPage.commentReply'`, `message` from `i18n.t('notificationsPage.commentReplyBody')` at create, locale-prefix-free `href` (`/read/:id/:n` or `/webtoon/:id`). Then `reloadInbox`.

## Mock off

API is source of truth. Do **not** write `softgate_comments_v1`. Guest **GET** (no 401). Writes need cookie auth; guest composers stay the login prompt + `state.from`.

| Method | Path                   | Auth | Body                                   | Notes                                              |
| ------ | ---------------------- | ---- | -------------------------------------- | -------------------------------------------------- |
| GET    | `/api/comments?key=`   | No   | —                                      | Shared thread. 400 if key empty/invalid.           |
| POST   | `/api/comments/add`    | Yes  | `{ key, content, spoiler? }`           | 1–500 chars.                                       |
| POST   | `/api/comments/reply`  | Yes  | `{ key, parentId, content, spoiler? }` | API upserts `comment_reply` for the parent author. |
| POST   | `/api/comments/edit`   | Yes  | `{ key, commentId, content }`          | Owner only.                                        |
| POST   | `/api/comments/delete` | Yes  | `{ key, commentId }`                   | Owner; cascades replies.                           |
| POST   | `/api/comments/like`   | Yes  | `{ key, commentId }`                   | Toggle.                                            |
| POST   | `/api/comments/report` | Yes  | `{ key, commentId }`                   | Sets `reported`; comment stays visible.            |

401 `NOT_AUTHENTICATED`. 400 `VALIDATION_ERROR`. POST JSON Content-Type required. Errors `{ error: { code } }`. Success `{ data: { comments } }` newest-first.

HTTP GET uses `fetch` + `credentials: 'include'` (catalog style, not `authFetch`). Mutations use `authFetch`. After reply, refresh inbox via `GET /api/notifications/me` (`EngagementContext.reloadInbox`). Do not client-upsert `comment_reply` in HTTP mode.

`comment_reply` on the API: parent `userId !==` actor; `getPrefs` (missing row = `DEFAULT_NOTIF_PREFS`); skip if `commentReply === false`; never notify self. `titleKey` is `notificationsPage.commentReply`. Frozen English body `Someone replied to your comment.` `href` has no `/mm`.

Key pattern: `id:digits` or `id:series`. Char limit **500**. Count = **all rows including replies**. Hub and episode keys stay distinct. Catalog `mockComments` stays unused. Report is a persist flag only — no admin queue. Sticker tray is Demo unicode appended into content.

`isMockApi()` stays `!== 'false'`.

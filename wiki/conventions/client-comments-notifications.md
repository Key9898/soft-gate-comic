---
title: Client comments + notifications
type: convention
date: 2026-08-13
tags: [comments, notifications, localStorage]
---

# Client comments + notifications

## Comments (`softgate_comments_v1`)

- Keyed by `episodeKey`: episode `` `${webtoonId}:${episodeNumber}` `` or series `` `${webtoonId}:series` `` ([`seriesCommentKey`](../../src/lib/comments/comments.ts)). Schema stays `v1`.
- Reader wraps [`CommentsThread`](../../src/components/Comments/CommentsThread.tsx) via `ReaderCommentsPanel`. Hub uses the same thread with the series key. Empty seed (no fake “Book Lover” list).
- Add/**reply**/**edit**/like/delete all persist via `src/lib/comments` (Impl 62). No optimistic local clones inside `Comments` — the component is **fully controlled**: props in, callbacks out; the panel refreshes state from storage after each mutation.
- **Single-level threading** (flat storage + optional `parentId`): replying to a reply flattens to the top-level parent. Deleting a top-level comment cascades to its replies (no orphans).
- `StoredComment.parentId?` is additive-optional — schema stays `v1`, old data loads unchanged.
- **Likes are per-user** (Impl 63): `likedByUserIds?: string[]` on `StoredComment` (additive, no `isLiked` boolean); `toggleCommentLike(episodeKey, commentId, userId)` toggles membership and derives `likeCount = likedByUserIds.length`. The panel computes the viewer's `isLiked` from the array; the like button is `disabled` when logged out. Legacy fake like counts intentionally reset to real counts.
- Logged-out: composer textarea + Post are `disabled` with a `comments.loginToComment` placeholder; Reader and hub show a sign-in prompt that redirects with `state.from`. No fabricated “You” identity, no `currentUserId` default.
- `CommentItem` lives at module scope with per-item local UI state (reply box, edit box, menu) — never re-declare it inside the parent render (keystroke remount = focus loss).

## Notifications (`softgate_notifications_v1` + `softgate_notif_prefs_v1`)

- Client list + mark-read; nav bell unread **dot only** when unread count > 0.
- Missing user → persist **`[]`**. Do not seed fake unread rows. Existing `byUserId` lists are not wiped.
- Prefs key `softgate_notif_prefs_v1`: `{ schemaVersion: 1, byUserId: { newEpisode, commentReply, promotion } }`. Defaults all `true`. Account/security in-app is locked on (no persist). Email + push columns are disabled (“when mail/push ships”).
- `listNotifications` / `unreadCount` apply prefs in lib. Profile Settings writes via `EngagementContext.setNotifPrefs` (same-tab; `storage` events do not fire in the writing tab).
- Global `newEpisode: false` skips `syncSubscribeNotifications` the same way muted bookmarks do. Per-series `notifyMuted` stays.
- Empty inbox: “You’re all caught up” + CTAs `/categories` and `/profile?tab=settings`.
- Filters: All / Unread / Updates (`new_episode`) / Activity (`comment_reply`) / Promo (`promotion`).
- Row is a destination `Link` when `href` exists; mark read on click; **delete is a sibling button**.
- Demo `new_episode` rows (`sub-{webtoonId}-{episodeNumber}`) still come from `syncSubscribeNotifications` when a subscribed unmuted series gets a later published episode. No push or email.
- Cookies `dl` lists both the inbox key and the prefs key. `migrateUserData` / `deleteUserData` move/delete prefs with the user.

## Cross-tab sync (Impl 65)

`CommentsThread` (Reader + hub) subscribes to `softgate_comments_v1` and `EngagementContext` to `softgate_engage_v1` + `softgate_notifications_v1` + `softgate_notif_prefs_v1` via `useStorageSync` — comments/likes/notifications posted in another tab appear without a refresh. The `storage` event never fires in the writing tab, so same-tab optimistic updates stay single-source (`setNotifPrefs` on the context calls `refresh`).

## Share

Detail Share: `navigator.share` with clipboard fallback + i18n feedback.

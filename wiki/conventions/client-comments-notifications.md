---
title: Client comments + notifications
type: convention
date: 2026-08-13
tags: [comments, notifications, localStorage]
---

# Client comments + notifications

## Comments (`softgate_comments_v1`)

- Keyed by episode (webtoonId + episodeNumber).
- Reader uses shared `Comments` component; empty seed (no fake “Book Lover” list).
- Add/**reply**/**edit**/like/delete all persist via `src/lib/comments` (Impl 62). No optimistic local clones inside `Comments` — the component is **fully controlled**: props in, callbacks out; the panel refreshes state from storage after each mutation.
- **Single-level threading** (flat storage + optional `parentId`): replying to a reply flattens to the top-level parent. Deleting a top-level comment cascades to its replies (no orphans).
- `StoredComment.parentId?` is additive-optional — schema stays `v1`, old data loads unchanged.
- **Likes are per-user** (Impl 63): `likedByUserIds?: string[]` on `StoredComment` (additive, no `isLiked` boolean); `toggleCommentLike(episodeKey, commentId, userId)` toggles membership and derives `likeCount = likedByUserIds.length`. The panel computes the viewer's `isLiked` from the array; the like button is `disabled` when logged out. Legacy fake like counts intentionally reset to real counts.
- Logged-out: composer textarea + Post are `disabled` with a `comments.loginToComment` placeholder; the reader panel shows a sign-in prompt that redirects with `state.from`. No fabricated “You” identity, no `currentUserId` default.
- `CommentItem` lives at module scope with per-item local UI state (reply box, edit box, menu) — never re-declare it inside the parent render (keystroke remount = focus loss).

## Notifications (`softgate_notifications_v1`)

- Client list + mark-read; nav bell unread dot when unread count > 0.
- CTAs route to real catalog paths (`/webtoon/...`, `/coins`) — no dead gear until prefs UI exists.

## Cross-tab sync (Impl 65)

`ReaderCommentsPanel` subscribes to `softgate_comments_v1` and `EngagementContext` to `softgate_engage_v1` + `softgate_notifications_v1` via `useStorageSync` — comments/likes/notifications posted in another tab appear without a refresh. The `storage` event never fires in the writing tab, so same-tab optimistic updates stay single-source.

## Share

Detail Share: `navigator.share` with clipboard fallback + i18n feedback.

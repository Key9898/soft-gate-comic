---
title: Library bookmarks (Subscribe)
type: convention
date: 2026-08-11
tags: [library, bookmarks, subscribe, localStorage, auth]
impl: 25
impl_updated: 142
---

# Library bookmarks (Subscribe)

## Scope (Impl 25, rename Impl 140)

Persist **subscriptions** in the bookmarks store. Library History and Likes tabs stay on engagement. The Library tab label is **Subscribed**. UI copy is Subscribe / Subscribed (EN) and စာရင်းသွင်း / စာရင်းသွင်းပြီး (MM). Internal ids stay `toggleBookmark` / tab `bookmarks`.

## Storage

- Key: `softgate_library_v1`
- Shape: `{ schemaVersion: 1, byUserId: Record<userId, BookmarkRecord[]> }` — **do not bump** schema (optional fields must not wipe old rows)
- `BookmarkRecord`: `{ webtoonId, addedAt, notifyMuted?, lastNotifiedEpisodeNumber? }`
- Guests cannot persist; storage is namespaced by authenticated `user.id`

On subscribe, stamp `lastNotifiedEpisodeNumber` to the current latest published episode so subscribe does not spam. Mute (`notifyMuted`) hides future Demo episode notices without unsubscribing. Unsub removes the record.

Helpers: `src/lib/library/` (`listBookmarks`, `isBookmarked`, `toggleBookmark`, `setNotifyMuted`, `setLastNotifiedEpisodeNumber`, `removeBookmark`, `removeBookmarks`).

## Notify (Demo)

[`syncSubscribeNotifications`](../../src/lib/notifications/subscribeSync.ts) on logged-in Engagement hydrate. If latest published `episodeNumber` > `lastNotifiedEpisodeNumber` and not muted, append `new_episode` (id `sub-{webtoonId}-{episodeNumber}`) and stamp. Missing `lastNotifiedEpisodeNumber` stamps current latest with **no** notice. Global `newEpisode: false` (Profile Settings) skips the whole sync. Push/email never.

## UI wiring

- Guest `toggleBookmark` → `/login` with `state.from`
- Surfaces: Home Subscribe CTA, hub Subscribe + mute bell, Reader bookmark control, Library Subscribed tab + mute (hidden in edit mode)
- History and Likes persist via engagement (`softgate_engage_v1`), not mock-seeded lists
- History only: Continue goes `/read/:webtoonId/:lastReadEpisode` (fallback episode `1`) with `stopPropagation`; cover/row still `/webtoon/:id`. Hide Continue on Subscribed and Likes.

## Out of scope

Public sub counts and `followerCount` UI. Author Follow is `softgate_follows_v1`, not this store.

---
title: Impl 140 — Subscribe and 18+ content rating
type: note
date: 2026-08-19
tags: [subscribe, content-rating, age-gate, library, notifications, softgate]
impl: 140
---

# Impl 140 — Subscribe and 18+ content rating

Save is Subscribe (one series-follow). Store stays `softgate_library_v1` schema **1**. Mute episode notices without unsubscribing. Demo in-app `new_episode` rows when latest published episode number exceeds `lastNotifiedEpisodeNumber` (stamped on subscribe; missing field migrates without spam). No push or email.

Per-title `contentRating`. Schema **9**. 18+ confirm on Reader only: signed-in localStorage A, guest sessionStorage C. Blood Moon (`id: 7`) is the 18+ Demo title.

## Deferred (user-held)

Do not expand this Impl into:

- Daily
- For You
- wait-for-free
- hub comments

## Related

- [content-rating.md](../conventions/content-rating.md)
- [library-bookmarks.md](../conventions/library-bookmarks.md)

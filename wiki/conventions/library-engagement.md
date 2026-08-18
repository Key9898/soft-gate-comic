---
title: Library engagement (history + likes)
type: convention
date: 2026-08-11
tags: [engagement, history, likes, library]
---

# Library engagement

Client history and likes, mirrored after bookmarks (`schemaVersion` + `byUserId`).

## Storage

- Key: `softgate_engage_v1` (key name stable; `schemaVersion` currently **2**)
- History record: `{ webtoonId, episodeNumber, lastReadAt, scrollRatio? }` (`scrollRatio` 0..1 within episode; missing → 0)
- Likes: `likedWebtoonIds: string[]`
- Persist **only when authenticated** (guest like/history does not write)
- v1 → v2: migrate-in-place, default `scrollRatio: 0` (no wipe)

## Surfaces

| Surface             | Behavior                                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------------------------ |
| Reader              | `recordHistory` on open unlocked episode; throttled `updateReadingProgress` for scroll; heart → `toggleLike` |
| Home Continue       | Auth rail from incomplete history; see [continue-reading.md](continue-reading.md)                            |
| Library History tab | From store + blended progress bars                                                                           |
| Library Likes tab   | From `likedWebtoonIds`                                                                                       |
| Webtoon detail      | Read badges from engagement episode numbers                                                                  |

## Context

`EngagementProvider` after `WalletProvider`. Guest like → login `from`.

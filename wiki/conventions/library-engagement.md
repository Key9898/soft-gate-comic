---
title: Library engagement (history + likes)
type: convention
date: 2026-08-11
updated: 2026-09-08
tags: [engagement, history, likes, library]
impl_updated: 190
---

# Library engagement

Client history and likes, mirrored after bookmarks (`schemaVersion` + `byUserId`).

## Storage

Mock (`VITE_USE_MOCK_API` is not `false`):

- Key: `softgate_engage_v1` (key name stable; `schemaVersion` currently **3**)
- History record: `{ webtoonId, episodeNumber, lastReadAt, scrollRatio? }` (`scrollRatio` 0..1 within episode; missing → 0)
- Likes: `likedWebtoonIds: string[]`
- Ratings: `ratings: Record<webtoonId, number>` — series-level, values `0.5`–`5` in 0.5 steps. Community catalog `webtoon.rating` is separate and does not change.
- Persist **only when authenticated** (guest like/history/rating does not write)
- v1 → v2: migrate-in-place, default `scrollRatio: 0` (no wipe)
- v2 → v3: migrate-in-place, default `ratings: {}` (accept schema 1, 2, and 3; do not wipe)

HTTP (`VITE_USE_MOCK_API=false`): history and likes come from `/api/library` ([portal-library-http.md](portal-library-http.md)). Ratings **stay** on this key in 190. HTTP hydrate must not load history/likes from the blob. Leftover empty history/likes arrays after a rating write are not source of truth.

## Surfaces

| Surface             | Behavior                                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------------------------ |
| Reader              | `recordHistory` on open unlocked episode; throttled `updateReadingProgress` for scroll; heart → `toggleLike` |
| Home Continue       | Auth rail from incomplete history; see [continue-reading.md](continue-reading.md)                            |
| Library History tab | From store + blended progress bars                                                                           |
| Library Likes tab   | From `likedWebtoonIds`                                                                                       |
| Webtoon detail      | Read badges from engagement episode numbers; series rating control (community vs You)                        |
| Reader complete     | Same series rating control after reading-time copy                                                           |

First rate requires at least one recorded episode for that series. An existing rating stays editable if history is later removed. Guest rate → login `from`.

`SeriesRatingControl` star cells are `h-11 w-12` (Impl 115). Each 0.5 radio is 44×24 CSS pixels. Cover rating chip is display-only and stays small.

## Context

`EngagementProvider` after `WalletProvider`. Guest like / rate → login `from`.

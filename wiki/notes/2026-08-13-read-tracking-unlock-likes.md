---
title: Data correctness — read set, detail unlock, per-user likes
date: 2026-08-13
type: note
impl: 63
tags: [engagement, wallet, comments, data-correctness]
---

# Impl 63 — Data correctness (read set / unlock / likes)

Three latent client-data bugs fixed in one batch.

## A. Read tracking — real episode set, not 1..N

**Bug:** `EngagementContext.readEpisodeNumbers` generated `1..episodeNumber`, so opening ep 3 directly marked 1–2 as read; ProfilePage summed `episodeNumber` per record, inflating "episodes read".

**Fix:**

- `HistoryRecord.readEpisodeNumbers?: number[]` — additive, engagement schema stays **v2** (no bump).
- `storage.ts` `normalizeHistory` sanitizes the array (finite, > 0, dedupe, sort asc); records without the field fall back to `[episodeNumber]` — legacy data becomes an honest single-episode count.
- `recordHistory` / `updateReadingProgress` union the previous set with the current episode (`mergeReadEpisodes`).
- `EngagementContext.readEpisodeNumbers` returns `record.readEpisodeNumbers ?? [record.episodeNumber]`.
- ProfilePage: `episodesRead = history.reduce((sum, h) => sum + (h.readEpisodeNumbers?.length ?? 1), 0)`.
- Deleted the dead `readEpisodeNumbersForWebtoon` lib function (nothing imported it).

## B. Detail page unlock state

**Bug:** `WebtoonDetailPage` episode rows showed the Lock icon for every `isPremium` episode even after purchase.

**Fix:** rows compute `locked = episode.isPremium && !isEpisodeUnlocked(webtoon.id, episode.episodeNumber)` via `useWallet`; Lock icon + accent gradient only when actually locked. Coin-price badge stays (factual). New `WebtoonDetailUnlock.test.tsx` seeds a session + `unlockEpisode` and asserts the unlocked row has no `.lucide-lock`.

## C. Per-user comment likes

**Bug:** `StoredComment.isLiked` was a single global boolean — any visitor (even logged out) could toggle, and the state leaked across accounts.

**Fix:**

- `StoredComment`: `isLiked` removed, `likedByUserIds?: string[]` added (comments schema stays v1; storage passes unknown fields through).
- `toggleCommentLike(episodeKey, commentId, userId)` — no-op without `userId`; toggles membership; `likeCount = likedByUserIds.length`. **Accepted:** legacy seeded like counts reset to real counts.
- `ReaderCommentsPanel.toUiComment(c, viewerId)` derives `isLiked`/`likeCount` from the array; `onLike` guards `if (!user) return`.
- `Comments.tsx` like button `disabled={!currentUserId}` + `disabled:opacity-50 disabled:cursor-not-allowed`.

## Tests

`engagementLib.test.ts` +3 (direct-entry set, cross-session union, legacy fallback), `WebtoonDetailUnlock.test.tsx` +2, `ReaderCommentsPanel.test.tsx` +2 (per-user like across remount, logged-out disabled). Checkpoint: 24/24 across the four touched suites.

## Deferred

- Cross-tab sync (`storage` event) — separate Impl.
- Email-change/delete-account data migration — pending discussion.

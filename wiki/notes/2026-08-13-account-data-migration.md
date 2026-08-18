---
title: Account data migration + delete cascade
type: note
date: 2026-08-13
tags: [auth, migration, wallet, engagement, library, notifications, comments]
impl: 66
---

# Impl 66 — Email-change data migration + delete-account cascade

## Why

`user.id` is a stable hash of the email (`userIdFromEmail` in `src/lib/auth/storage.ts`). Changing the email therefore mints a **new id**, and before this Impl `AuthContext.updateProfile` just deleted the old account row — wallet balance/unlocks, history/likes, bookmarks, notifications, and comment authorship stayed orphaned under the old id. `deleteAccount` likewise only removed the account + session, leaving all five stores populated. Direction decided with the user: **migrate data** (do not block email changes).

## What shipped

### New lib `src/lib/account/` (`migrate.ts` + barrel)

- **`migrateUserData(oldUserId, newUserId)`** — guards falsy/identical ids.
  - Moves the entry in each of the 4 `byUserId` stores (engagement, wallet, library, notifications) via a shared generic helper. **Collision policy:** if the new id already holds data (e.g. a wallet auto-seeded by `getWallet` before the rename), the migrated data overwrites it — active-account continuity wins.
  - Comments: every list in `byEpisodeKey` is mapped — comments authored by the old id get `userId` + `user.id` rewritten; `likedByUserIds` occurrences are replaced old→new with dedupe and `likeCount = likedByUserIds.length` (count unchanged in practice).
- **`deleteUserData(userId)`** — guards falsy id.
  - Deletes the entry from the 4 `byUserId` stores.
  - Comments cascade (Impl 62 semantics): the user's comments **and replies to them** are removed per episode key; remaining comments have the user stripped from `likedByUserIds` with `likeCount` recomputed; empty lists drop the episode key.

### AuthContext hooks

- `updateProfile` email-change branch calls `migrateUserData(account.id, updated.id)` before `deleteAccountByEmail(account.email)`.
- `deleteAccount` calls `deleteUserData(account.id)` after password verify, before removing the account row + session.
- Same-tab: contexts reload under the new id via their existing `userId` effects. Cross-tab: Impl 65 `useStorageSync` listeners pick up the store writes.

## Tests

New `src/test/accountDataMigration.test.ts` (6 cases, Map-mock localStorage):

1. Migrate moves the 4 `byUserId` stores (wallet balance/unlock keys checked exactly)
2. Migrate rewrites comment authorship + liker ids without changing counts
3. Collision — migrated data overwrites stale data under the new id
4. `deleteUserData` clears stores + cascades comments/replies + strips likes
5. No-op guards (identical / empty ids)
6. AuthContext integration — register → seed → `updateProfile({ email })` keeps wallet/likes under the new id; `deleteAccount(password)` empties the stores

## Out of scope

- Comments `user` snapshot username/displayName refresh (separate rename-sync concern)
- Favicon (waiting on user assets)
- Real backend auth / password hashing (demo honesty convention)

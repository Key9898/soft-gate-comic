---
title: Impl 161 — Unhook account pages from catalog loading
type: note
date: 2026-08-21
tags: [skeleton, loading, profile, notifications, coins, catalog, softgate]
impl: 161
---

# Impl 161 — Unhook account pages from catalog loading

Profile, Notifications, and Coins page chrome no longer wait on catalog `DataContext.isLoading`. Those pages are `ProtectedRoute` and paint from local session / inbox / wallet. Catalog join stays only where titles are required.

## Contract

- Profile: drop catalog gate. Keep `ProfilePageSkeleton.tsx` for a future account API. `if (!user) return null` stays.
- Notifications: drop catalog gate. Inbox stays `useEngagement()`. Empty inbox is empty UI, not a skeleton. Keep `NotificationsPageSkeleton.tsx`.
- Coins: drop page-level `CoinsPageSkeleton`. Buy / balance / history always paint. Keep `webtoons` + `isLoading` only for unlock titles.
- If `unlockedEpisodeKeys.length > 0` while catalog is loading, the unlock **card** shows one row bone per key (`data-testid="coins-unlocked-pending"`). Do **not** show `unlockedEmpty` (join would drop rows → fake empty). Heading stays live copy.
- Mock path still has `isLoading` false immediately; pending bones show in API mode. Library stays catalog-gated.

## Files

- `src/features/profile/ProfilePage.tsx`
- `src/features/notifications/NotificationsPage.tsx`
- `src/features/coins/CoinsPage.tsx`
- `src/test/ProfilePage.test.tsx`
- `src/test/NotificationsPage.test.tsx`
- `src/test/CoinsPage.test.tsx`
- `wiki/conventions/loading-states.md`
- `wiki/notes/2026-08-21-account-skeleton-triggers.md` (this note)
- `wiki/architecture/implementation-phases.md`
- `wiki/README.md`, `wiki/00-overview.md`, `wiki/02-workflow.md`

## Verify

`npm run check`. This Impl’s `src/` diff is the three pages plus their tests. Skeleton component files stay.

## Next

Impl **163**. Library stays catalog-gated. Search landing + Reader chrome landed in 162.

## Related

- [loading-states.md](../conventions/loading-states.md)
- [2026-08-21-home-skeleton-auth-rails.md](2026-08-21-home-skeleton-auth-rails.md) (160)

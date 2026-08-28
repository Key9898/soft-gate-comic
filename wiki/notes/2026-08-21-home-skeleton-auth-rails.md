---
title: Impl 160 — Home skeleton Continue / For You by session
type: note
date: 2026-08-21
tags: [skeleton, loading, home, continue, for-you, auth, softgate]
impl: 160
---

# Impl 160 — Home skeleton Continue / For You by session

Home catalog skeleton now follows **session**, so Continue / For You no longer pop in after a signed-in catalog wait. Hero (159) and Daily (158) are unchanged. Live empty rules are unchanged (Continue still hides when history is empty after load; For You still hides when `forYouList` is empty).

## Contract

- Guest: Start here 6-up. No Continue. No For You.
- Signed-in + `listHistory` non-empty: Continue **xor** Start here. Continue is a horizontal cap-**12** shelf (`CONTINUE_CAP`), not a 6-up grid. Slots are reserved, not a promised count.
- Signed-in + empty history: Start here 6-up. No Continue.
- Signed-in (both): For You **6** after Continue/Start here and before Ranking. Loading ≠ empty.
- Catalog-loading paint reads `user ?? readSession()` and `listHistory(session.id)`. Do not use `EngagementContext.history` for this paint (it starts `[]` until `useEffect`).
- Do not predict draft/complete filtering without catalog. Residual CLS if all history rows drop after load is accepted.

## Files

- `src/features/home/HomePage.tsx`
- `src/features/home/components/HomePageSkeleton.tsx`
- `src/test/SkeletonStates.test.tsx`
- `wiki/conventions/loading-states.md`
- `wiki/conventions/continue-reading.md`
- `wiki/conventions/guest-access.md`
- `wiki/notes/2026-08-21-home-skeleton-auth-rails.md` (this note)
- `wiki/architecture/implementation-phases.md`
- `wiki/README.md`, `wiki/00-overview.md`, `wiki/02-workflow.md`

## Verify

`npm run check`. This Impl’s `src/` diff is `HomePage.tsx` + `HomePageSkeleton.tsx` + `SkeletonStates.test.tsx`.

## Next

Impl **162**. Profile / Coins / Notifications catalog gates shipped in 161.

## Related

- [loading-states.md](../conventions/loading-states.md)
- [continue-reading.md](../conventions/continue-reading.md)
- [guest-access.md](../conventions/guest-access.md)
- [2026-08-21-hero-skeleton-chrome.md](2026-08-21-hero-skeleton-chrome.md) (159)

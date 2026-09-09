---
title: Guest access policy (WEBTOON-style)
type: convention
date: 2026-08-13
updated: 2026-09-09
tags: [guest, auth, gating, reader, conversion, softgate, impl-67, impl-199]
---

# Guest access policy

SoftGate Comic follows the **WEBTOON-style freemium model**: discovery and free reading are fully open to guests; personalization, money, and community-write actions require login. Verified against industry research (WEBTOON, Naver Webtoon, Tapas, Lezhin, Manta — 2026).

## Guest CAN (open routes)

- Browse everything: `/`, `/categories`, `/categories/:slug`, `/search`, `/webtoon/:id`, `/author/:id`
- Read **free** episodes and Demo **wait-for-free** episodes after `freeAt`: `/read/:webtoonId/:episodeNumber` is deliberately NOT a ProtectedRoute
- Read comments in the reader panel and on the series hub discussion
- Share the current episode URL from the reader footer
- All info/legal pages, auth pages, 404

## Guest CANNOT

| Action                                             | Gate location                                             | Behavior                                                                                                           |
| -------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `/profile`, `/library`, `/notifications`, `/coins` | `ProtectedRoute` in [App.tsx](../../src/App.tsx)          | `Navigate` to `/login` with `state.from`                                                                           |
| Like                                               | `EngagementContext.toggleLike`                            | `navigate('/login', { state: { from } })`                                                                          |
| Rate series                                        | `EngagementContext.setRating` / `clearRating`             | same; control stays visible for guests                                                                             |
| Bookmark/Subscribe                                 | `LibraryContext.toggleBookmark`                           | same                                                                                                               |
| Author Follow                                      | `FollowsContext.toggleFollow`                             | same                                                                                                               |
| Coin top-up                                        | `WalletContext.demoTopUp`                                 | same                                                                                                               |
| Premium unlock                                     | `WalletContext.unlockEpisode` + `ReaderPage.handleUnlock` | same, `from` = the `/read/...` path                                                                                |
| Wait-for-free skip (coins)                         | same coins unlock                                         | Guest cannot skip the wait with coins; after `freeAt` the episode is actually free                                 |
| Post comment                                       | `CommentsThread` (Reader + hub)                           | inline `comments.loginToComment` prompt (no redirect). Guest **read** is open (GET `/api/comments` when mock off). |
| Report episode                                     | `ReaderCompletePortal`                                    | `navigate('/login', { state: { from } })` with `from` = `/read/:id/:n`                                             |

## Rules

1. **Action-gated, not route-gated** for content: never blanket-block reading; prompt login only at the action that needs it.
2. **Always carry `state.from`** — Login and Register both return to `from.pathname + search` after success. Any new gated action must pass `{ state: { from: location } }` (or an explicit pathname). MainLayout Nav Login also passes `state={{ from: location }}` (Impl 139). ReaderLayout has no Nav.
3. **No guest data persistence** — guests get no history/progress/likes/ratings/Library/Follow writes (Engagement/Library/Follows/Wallet all no-op or redirect). **Exception (Impl 140):** 18+ self-confirm for guests is `sessionStorage` key `softgate_age_confirm_session` only — it dies with the tab. Signed-in confirm is `softgate_age_confirm_v1`. Changing this requires updating the Cookies storage grid.
4. **Guest-aware copy (Impl 67)** — premium locked screen shows "Log in to unlock" (`readerPage.loginToUnlock`) and hides the balance line for guests; Chapter Complete portal shows the sign-up nudge (`readerPage.guestNudge` + `createFreeAccount`), hidden for logged-in readers.
5. Guest UI chrome: Navigation hides the notification bell and shows Login/Register; Home hides the Continue Reading rail when there is no history. When Continue is empty (guests and members with no history), Home fills that slot with a **Start here** catalog rail (`home.startHere`) — first episode free, Hero ids excluded, cards open `/read/:id/1`. Ranking stays a chart (`home.rankingDesc`); it does not reuse the Start here eyebrow. Continue and Start here never show together. The bottom Get started free CTA stays. Home skeleton follows the same split from session + `listHistory` (Impl 160); signed-in also reserves a For You 6-pack cap until catalog load.

## Related

- Impl note: [2026-08-13-reader-guest-nudges.md](../notes/2026-08-13-reader-guest-nudges.md), [2026-09-09-reader-reading-room.md](../notes/2026-09-09-reader-reading-room.md)
- Auth store / reading-room pages: [client-auth.md](client-auth.md); wallet: [client-wallet.md](client-wallet.md)

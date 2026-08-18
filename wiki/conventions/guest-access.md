---
title: Guest access policy (WEBTOON-style)
type: convention
date: 2026-08-13
tags: [guest, auth, gating, reader, conversion, softgate, impl-67]
---

# Guest access policy

SoftGate Comic follows the **WEBTOON-style freemium model**: discovery and free reading are fully open to guests; personalization, money, and community-write actions require login. Verified against industry research (WEBTOON, Naver Webtoon, Tapas, Lezhin, Manta — 2026).

## Guest CAN (open routes)

- Browse everything: `/`, `/categories`, `/categories/:slug`, `/search`, `/webtoon/:id`
- Read **free** episodes: `/read/:webtoonId/:episodeNumber` is deliberately NOT a ProtectedRoute
- Read comments in the reader panel
- All info/legal pages, auth pages, 404

## Guest CANNOT

| Action                                             | Gate location                                             | Behavior                                              |
| -------------------------------------------------- | --------------------------------------------------------- | ----------------------------------------------------- |
| `/profile`, `/library`, `/notifications`, `/coins` | `ProtectedRoute` in [App.tsx](../../src/App.tsx)          | `Navigate` to `/login` with `state.from`              |
| Like                                               | `EngagementContext.toggleLike`                            | `navigate('/login', { state: { from } })`             |
| Bookmark/Save                                      | `LibraryContext.toggleBookmark`                           | same                                                  |
| Coin top-up                                        | `WalletContext.demoTopUp`                                 | same                                                  |
| Premium unlock                                     | `WalletContext.unlockEpisode` + `ReaderPage.handleUnlock` | same, `from` = the `/read/...` path                   |
| Post comment                                       | `ReaderCommentsPanel`                                     | inline `comments.loginToComment` prompt (no redirect) |

## Rules

1. **Action-gated, not route-gated** for content: never blanket-block reading; prompt login only at the action that needs it.
2. **Always carry `state.from`** — Login and Register both return to `from.pathname + search` after success. Any new gated action must pass `{ state: { from: location } }` (or an explicit pathname).
3. **No guest data persistence** — guests get no history/progress/likes writes (Engagement/Library/Wallet all no-op or redirect). This is a privacy stance recorded in [legal-pages.md](legal-pages.md); changing it requires updating the Cookies storage grid.
4. **Guest-aware copy (Impl 67)** — premium locked screen shows "Log in to unlock" (`readerPage.loginToUnlock`) and hides the balance line for guests; Chapter Complete portal shows the sign-up nudge (`readerPage.guestNudge` + `createFreeAccount`), hidden for logged-in readers.
5. Guest UI chrome: Navigation hides the notification bell and shows Login/Register; Home hides the Continue Reading rail.

## Related

- Impl note: [2026-08-13-reader-guest-nudges.md](../notes/2026-08-13-reader-guest-nudges.md)
- Auth store: [client-auth.md](client-auth.md); wallet: [client-wallet.md](client-wallet.md)

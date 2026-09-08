---
title: Portal wallet HTTP (stub ledger + paywall strip)
type: convention
date: 2026-08-24
tags: [wallet, catalog, paywall, http, softgate]
impl: 175
---

# Portal wallet HTTP (stub ledger + paywall strip)

Wallet source of truth depends on `VITE_USE_MOCK_API`.

## Mock on (`VITE_USE_MOCK_API` is not `false`)

[`WalletContext`](../../apps/portal/src/context/WalletContext.tsx) keeps [`client-wallet.md`](client-wallet.md): `softgate_wallet_v1`, seed 150, local unlock, Demo top-up. Unset `VITE_USE_MOCK_API` stays mock. Committed `.env.example` is `false`; Vite does not load it. Local `pnpm dev` HTTP uses gitignored `.env.development.local` plus `pnpm dev:api`. Catalog still ships premium `images`; Reader UI lock + skipped prefetch hide panels.

## Mock off

API stub ledger is source of truth. Do **not** write `softgate_wallet_v1`.

| Method | Path                     | Auth            | Notes                                                                                            |
| ------ | ------------------------ | --------------- | ------------------------------------------------------------------------------------------------ |
| GET    | `/api/catalog`           | optional cookie | Never 401. Bad/missing `sg_reader` = guest strip. Locked premium `images: []`; keep `imageSizes` |
| GET    | `/api/wallet/me`         | required        | Seeds 150 on first touch. `{ data: { balance, transactions, unlockedEpisodeKeys } }`             |
| POST   | `/api/wallet/demo-topup` | required        | JSON `{ coins, description, packageId? }`; reject non-positive `coins`                           |
| POST   | `/api/wallet/unlock`     | required        | JSON `{ webtoonId, episodeNumber }` only. Debit catalog `coinPrice`. Ignore client `coinPrice`   |

Unlock errors `{ error: { code } }`: `NOT_AUTHENTICATED`, `INSUFFICIENT_COINS`, `ALREADY_UNLOCKED`, `NOT_LOCKED`, `EPISODE_NOT_FOUND`. Wait-for-free now is `NOT_LOCKED` (no debit). Persist is in-memory stub (reset on API restart).

Portal catalog `fetch` uses `credentials: 'include'` (not `authFetch`). Settings fetch stays without credentials. `DataProvider` sits inside `AuthProvider` and refetches when `user.id` changes. Reader calls catalog `retry` after a successful unlock.

`isEpisodeLocked` / `isWaitFreeNow` live in `@softgate/shared`. Portal `formatWaitFreeAt` stays in the portal catalog lib.

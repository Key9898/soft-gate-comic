---
title: Impl 175 — Wallet authority + paywall strip
type: note
date: 2026-08-24
tags: [wallet, catalog, paywall, api, softgate]
impl: 175
---

# Impl 175 — Wallet authority + paywall strip

Server-authoritative stub wallet, unlock, and wait-for-free when mock is off. `GET /api/catalog` redacts locked premium episode `images`. Mock `pnpm dev` still uses `softgate_wallet_v1`.

## What shipped

- Shared `parseFreeAt` / `isWaitFreeNow` / `isEpisodeLocked` in `@softgate/shared`
- API persist in-memory ledger (seed 150, append-only txns, unlock keys `` `${webtoonId}:${episodeNumber}` ``)
- `GET /api/wallet/me`, `POST /api/wallet/demo-topup`, `POST /api/wallet/unlock`
- Catalog optional `sg_reader` (never 401); strip only locked premium; keep `imageSizes`
- Portal `DataProvider` inside `AuthProvider`; catalog `credentials: 'include'` (not `authFetch`)
- `WalletContext` dual-path; HTTP does not write `softgate_wallet_v1`
- Reader skips image prefetch when locked; `await unlock` then catalog `retry`
- Coins Demo success waits for `demoTopUp` to resolve

## Honesty

- Persist wallets are in-memory (reset on API restart)
- Demo top-up is still Demo until a PSP exists
- Mock catalog still contains premium panel URLs; HTTP locked chapters do not
- Guest `/read` and wait-for-free after `freeAt` unchanged

## Out

- PSP / MMQR settlement
- Signed CDN / private bucket
- Admin coin-code CMS
- Prisma user/wallet tables
- Guessed Reader skeleton strip heights; CLS claims

Convention: [portal-wallet-http.md](../conventions/portal-wallet-http.md).

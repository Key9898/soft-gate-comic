---
title: Client wallet (Demo top-up + unlock)
type: convention
date: 2026-08-11
tags: [wallet, coins, unlock, localStorage]
---

# Client wallet

Browser-local coin balance and premium unlocks. No PSP settlement.

## Storage

- Key: `softgate_wallet_v1`
- Shape: `{ schemaVersion, byUserId: { [userId]: { balance, transactions[], unlockedEpisodeKeys[] } } }`
- First-touch seed balance: **150** (`DEFAULT_SEED_BALANCE`)
- Unlock key: `` `${webtoonId}:${episodeNumber}` ``

## Behavior

| Action                  | Effect                                                                    |
| ----------------------- | ------------------------------------------------------------------------- |
| Demo top-up (Coins Buy) | Credit balance; txn type `demo_topup`; UI must show **Demo** copy (en+mm) |
| Unlock premium episode  | Debit `coinPrice`; append `spend` txn; add unlock key; persist            |
| Insufficient balance    | Fail unlock; surface navigates toward `/coins`                            |
| Guest unlock            | Redirect login with `from` (same pattern as bookmarks)                    |

## Context

`WalletProvider` under `AuthProvider` (needs `user.id`). Surfaces: CoinsPage, Reader unlock, Profile coin stat. Cross-tab: subscribes to `softgate_wallet_v1` via `useStorageSync` (Impl 65) — top-up/unlock in another tab refreshes balance/unlocks here.

## Honesty rules

- Never claim MMQR/card settlement succeeded.
- Keep Buy UI; label it Demo top-up.
- Coins header uses Demo / this-browser copy — not “Secure payments” / “Instant delivery”. Processing copy credits the local Demo balance.
- How coins work: seed 150, Demo top-up this device, unlock premium. Unlocked list from `unlockedEpisodeKeys` links `/webtoon/:id`; empty is honest.
- Unlocks survive refresh only via this store.
- No redeem-code field. No live PSP claim.

## Wait-for-free (not this store)

Per-episode `freeAt` ISO on some premium rows. Access helper: [`src/lib/catalog/waitForFree.ts`](../../src/lib/catalog/waitForFree.ts). After `now >= freeAt`, the episode is readable without debiting coins (guests included). Before that, coins unlock still works for signed-in readers. Do not write wait-free access into `unlockedEpisodeKeys`. Do not fake a daily 23:59 clock. Do not mix with Daily `scheduledAt`.

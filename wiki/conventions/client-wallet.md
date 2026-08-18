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
- Unlocks survive refresh only via this store.

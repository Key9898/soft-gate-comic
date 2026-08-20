---
title: Impl 151 — Wait-for-free on premium episodes
type: note
date: 2026-08-19
tags: [reader, wallet, wait-for-free, catalog, softgate]
impl: 151
---

# Impl 151 — Wait-for-free on premium episodes

Premium episodes can list `Episode.freeAt` (ISO). After that instant they are readable without coins. Coins unlock still skips the wait for signed-in readers and still writes `softgate_wallet_v1`. Wait-free access is not stored in the wallet.

## Data

- Optional `freeAt` on premium published episodes only. Schema **11**.
- Demo mix: coins-only (Horizon Training, Golden Age 3, Forest Spirit 3), already free (Love in Seoul 3, Shadow Knight 3, Ocean Dreams 3, Cyber Dreams 3), still waiting (Horizon Dark Secrets, Blood Moon 3, Campus Life 3).
- Times are UTC, not 23:59. Not Daily `scheduledAt`.

## Access

`isEpisodeLocked` in [`src/lib/catalog/waitForFree.ts`](../../src/lib/catalog/waitForFree.ts): locked when premium, not coin-unlocked, and not `now >= freeAt`. Guests can read after `freeAt`. Guests still login to skip with coins.

## Out of scope

Daily board. For You. Follow. Search Demo chips. Live publisher SLA. Ticking 23:59 clock.

## Related

- [client-wallet.md](../conventions/client-wallet.md)
- [guest-access.md](../conventions/guest-access.md)
- [series-hub.md](../conventions/series-hub.md)

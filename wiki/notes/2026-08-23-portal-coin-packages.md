---
title: Impl 168 — Consume Admin coinPackages on /coins
type: note
date: 2026-08-23
tags: [coins, catalog, localStorage, admin, softgate]
impl: 168
---

# Impl 168 — Consume Admin coinPackages on /coins

Portal `/coins` now reads optional `SharedData.coinPackages` from `softgate-shared-data` (schema **13**). Admin CMS Impl 24 is the writer. This portal does not bump schema and does not edit the Admin repo.

## Resolve rules

| Blob `coinPackages`    | Shop                                                           |
| ---------------------- | -------------------------------------------------------------- |
| Missing / not an array | Fallback `src/features/coins/components/coinData.ts` six packs |
| `[]`                   | Empty shop (Admin wipe). Do not refill from `coinData.ts`      |
| Non-empty array        | Valid rows only                                                |

Valid row: `id` non-empty string; `coins` and `price` integers ≥ 1; `bonus` omitted or integer ≥ 0.

Metal/glow stay portal-only (`deriveMetalGlow`). Never persist `metalClass` / `glowClass`.

`seedDb` does **not** write `coinPackages: []` (that would look like an Admin wipe). Field is optional so `JSON.stringify` omits it until Admin seeds.

`applyCatalogSeed` stays identity (Impl 167). Packs on a stored catalog survive load.

Checkout unchanged: `demoTopUp(coins + (bonus || 0))`. Wallet key still `softgate_wallet_v1`. `/coins` still `ProtectedRoute`.

## Files

- `packages/shared/src/types.ts`
- `src/context/DataContext.tsx`
- `src/features/coins/components/coinData.ts`
- `src/features/coins/CoinsPage.tsx`
- `src/test/catalogLib.test.ts`
- `src/test/CoinsPage.test.tsx`
- `src/test/CoinsCheckout.test.tsx`

## Next

Impl **169**. Authors/Genres consume still separate.

## Related

- [../references/admin-coin-packages.md](../references/admin-coin-packages.md)
- [2026-08-23-trust-stored-catalog.md](2026-08-23-trust-stored-catalog.md) (167)

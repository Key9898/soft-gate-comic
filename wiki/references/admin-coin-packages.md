---
title: Admin coin packages → portal /coins
type: reference
date: 2026-08-23
updated: 2026-09-10
tags: [admin, coins, catalog, http, prisma, softgate]
impl_updated: 201
---

# Admin coin packages → portal `/coins`

Admin writes shop SKUs (CMS Impl 24 / Postgres `CoinPackage`). Portal `/coins` consumes optional `PublishedCatalog.coinPackages` (Impl **168** UI + Impl **201** Prisma HTTP).

| Side   | Repo                              | Status                                  |
| ------ | --------------------------------- | --------------------------------------- |
| Writer | `soft-gate-comic-admin-dashboard` | Done (blob then REST + Prisma table)    |
| Reader | this repo (`soft-gate-comic`)     | Done — UI 168, Prisma catalog field 201 |

Missing packs table → omit field → `coinData.ts` fallback. Empty table → `[]` → empty shop. Metal/glow stay portal-only.

Admin note: [`../soft-gate-comic-admin-dashboard/wiki/notes/2026-08-23-admin-coin-packages.md`](../../../soft-gate-comic-admin-dashboard/wiki/notes/2026-08-23-admin-coin-packages.md)

Canonical list item 16: [`../soft-gate-comic-admin-dashboard/wiki/references/website-integration.md`](../../../soft-gate-comic-admin-dashboard/wiki/references/website-integration.md)

Wallet honesty (do not rewrite): [client-wallet.md](../conventions/client-wallet.md)

HTTP consume: [2026-09-10-coin-packages-catalog.md](../notes/2026-09-10-coin-packages-catalog.md)

Portal types + `/coins` fallback shipped in Impl **168**. Prisma catalog field shipped in Impl **201**. Sections below stay as the original consume contract (blob shape, metal/glow, checkout honesty). Do not treat them as still-open work.

---

## 1. What Admin already does (facts)

### Storage

- Key: **`softgate-shared-data`**
- Envelope: `{ schemaVersion: 13, data: SharedData }`
- Constant: `SHARED_DATA_SCHEMA_VERSION = 13` in Admin `packages/shared/src/data.ts`
- This portal already uses the same key and envelope in `packages/shared/src/data.ts` (`saveToLocalStorage` / `loadFromLocalStorage`)
- **Do not bump schema to 14**

Same-origin only: Admin and portal share the blob only when they run on the **same host + port**. Different Vite ports → different `localStorage`. That is a browser rule, not a bug.

### Admin CMS

- Route: **`/coin-packages`** (eager). Sidebar after Genres, icon `Coins`. No keyboard shortcut.
- Hard delete. No `inactive`. No cascade to `softgate_wallet_v1`, episode `coinPrice`, or Revenue.
- Edit never changes `id`. New id = `String(max numeric ids + 1)`.
- Badge XOR: at most one `popular`, at most one `bestValue`, never both on the same pack. Saving one flag clears that flag on every other pack.

### Blob field

Admin `SharedData.coinPackages: CoinPackage[]`.

This portal’s `SharedData` in `packages/shared/src/types.ts` includes optional `coinPackages` (Impl 168). Prisma HTTP catalog maps Admin `CoinPackage` rows onto that field (Impl 201).

### Blob shape (JSON keys — use these, not aliases)

```ts
interface CoinPackage {
  id: string
  coins: number
  price: number // integer MMK
  bonus?: number
  popular?: boolean
  bestValue?: boolean
}
```

**Never on the blob:** `metalClass`, `glowClass` (portal-only CSS). Admin `toPersistedPackage` strips them.

Omit `bonus` when `0`. Omit `popular` / `bestValue` when false.

### Hydration on Admin load (`ensureCoinPackages`)

| Stored `coinPackages`  | Admin does                |
| ---------------------- | ------------------------- |
| Missing / not an array | Seed 6 packs, persist     |
| `[]` (empty array)     | Keep empty. Do not reseed |
| Non-empty array        | Keep as written           |

### Seed (ids `"1"`…`"6"`) — same numbers as current `coinData.ts`

| id    | `coins` | `price` (MMK) | `bonus` | flag        |
| ----- | ------- | ------------- | ------- | ----------- |
| `"1"` | 50      | 1000          | —       | —           |
| `"2"` | 120     | 2000          | 10      | —           |
| `"3"` | 300     | 5000          | 30      | `popular`   |
| `"4"` | 650     | 10000         | 80      | —           |
| `"5"` | 1400    | 20000         | 200     | `bestValue` |
| `"6"` | 3000    | 40000         | 500     | —           |

---

## 2. Consume contract (shipped 168 / 201)

### A. Types + load (`packages/shared`)

Add the same `CoinPackage` (blob shape, **no** `metalClass` / `glowClass`) and `coinPackages: CoinPackage[]` on `SharedData`.

Schema stays **13**.

`applyCatalogSeed` (Impl **167**) is identity: it returns `stored`. It does **not** replace authors/genres/webtoons/episodes with mock. Unknown keys such as future `coinPackages` survive on the stored object.

When you add `coinPackages` to the type:

- **Do not** assign mock packs in `applyCatalogSeed` (it must stay identity)
- Empty catalog (`webtoons: []`) stays empty

### B. `/coins` data source

File today: `src/features/coins/CoinsPage.tsx` imports `coinPackages` from `./components/coinData`.

Required:

1. Read `coinPackages` from the shared blob (DataContext / `loadFromLocalStorage`).
2. **Fallback to `coinData.ts`** only when the blob field is **missing or not an array** (old browsers that never ran Admin). Shop must not go blank.
3. Blob value **`[]`** is a real Admin wipe → render empty shop. **Do not** fill from `coinData.ts`.

Map each blob row to the UI card type by **deriving** metal/glow (next section). Do not write those classes back to the blob.

Skip invalid rows: `id` non-empty string; `coins` and `price` integers ≥ 1; `bonus` omitted or integer ≥ 0.

### C. Card metal / glow (portal-only)

Current hardcoded classes in `coinData.ts` / used by `CoinPackageCard`:

| `coins` | `metalClass`     | `glowClass`  |
| ------- | ---------------- | ------------ |
| 50      | `metal-bronze`   | `''`         |
| 120     | `metal-silver`   | `''`         |
| 300     | `metal-gold`     | `gold-glow`  |
| 650     | `metal-ruby`     | `''`         |
| 1400    | `metal-platinum` | `spark-glow` |
| 3000    | `metal-obsidian` | `''`         |

For packs staff add later (not exactly those six amounts), derive by **`coins` bands** so new SKUs still look like the shop:

| `coins`  | `metalClass`     | `glowClass`  |
| -------- | ---------------- | ------------ |
| `< 120`  | `metal-bronze`   | `''`         |
| `< 300`  | `metal-silver`   | `''`         |
| `< 650`  | `metal-gold`     | `gold-glow`  |
| `< 1400` | `metal-ruby`     | `''`         |
| `< 3000` | `metal-platinum` | `spark-glow` |
| `≥ 3000` | `metal-obsidian` | `''`         |

Exact seed amounts match the first table. Do not persist the result. Do not add a staff CSS picker.

`CoinPackageCard` already applies `` `${pkg.metalClass} ${pkg.glowClass}` `` — keep that; fill those fields in the mapper.

Badges: `popular` → Popular chip; `bestValue` → Best value chip. Admin already XOR-enforces this.

### D. Checkout — do not redesign

Today (`CoinsPage.tsx`):

```ts
const totalCoins = selectedPackage.coins + (selectedPackage.bonus || 0)
demoTopUp(totalCoins /* existing i18n description */)
```

`useWallet().demoTopUp(coins, description, packageId?)` → `src/lib/wallet/wallet.ts` `demoTopUp`. Credit **`coins + (bonus ?? 0)`**. Keep honesty banner, Demo WavePay (and other Demo methods), success copy.

Wallet key: **`softgate_wallet_v1`** (`src/lib/wallet/storage.ts` `STORAGE_KEY`). Do not rename.

`/coins` stays behind `ProtectedRoute` ([guest-access.md](../conventions/guest-access.md)).

### E. Done when

Admin `/coin-packages` change (MMK, bonus, badges, add, hard delete) → same-origin `/coins` matches after reload. Missing blob still shows `coinData.ts` six packs.

---

## 3. What not to do

- IAP / App Store / Play / subscription
- Episode `coinPrice` changes, Reader unlock math, user balance editor
- Schema **14**
- Copy English into `src/lib/i18n/locales/mm/**`
- Rewrite honesty banner / Demo WavePay into a real PSP
- Persist `metalClass` / `glowClass` / `inactive` on the blob
- Let `applyCatalogSeed` replace `coinPackages` with mock
- Treat `[]` as “missing” (that would undo Admin delete-all)
- Authors/Genres consume (`/author/:id`, `/categories/:slug`) — **separate** follow-up

---

## 4. Portal files this follow-up will touch

| File                                                | Why                                               |
| --------------------------------------------------- | ------------------------------------------------- |
| `packages/shared/src/types.ts`                      | `CoinPackage` + `SharedData.coinPackages`         |
| `packages/shared/src/data.ts`                       | load/save typing; **do not** seed-overwrite packs |
| `src/features/coins/CoinsPage.tsx`                  | blob list + fallback                              |
| `src/features/coins/components/coinData.ts`         | fallback seed + optional `deriveMetalGlow(coins)` |
| `src/features/coins/components/CoinPackageCard.tsx` | only if mapper type changes                       |
| `src/test/CoinsPage.test.tsx`                       | source of packages                                |
| `src/test/CoinsCheckout.test.tsx`                   | still `demoTopUp(coins+bonus)`                    |
| `src/test/catalogLib.test.ts`                       | `applyCatalogSeed` must not clobber packs         |

Shipped: [2026-08-23-portal-coin-packages.md](../notes/2026-08-23-portal-coin-packages.md) (168), [2026-09-10-coin-packages-catalog.md](../notes/2026-09-10-coin-packages-catalog.md) (201).

---

## 5. Out of scope here

IAP / live PSP, website coin-table `CREATE` / migrate, Hono coin-package PATCH, Admin git merge. `/coins` UI is 168; Prisma catalog field is 201.

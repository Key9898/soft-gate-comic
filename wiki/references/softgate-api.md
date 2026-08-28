---
title: SoftGate Comic API
type: reference
date: 2026-08-24
tags: [api, health, catalog, settings, auth, wallet, env, softgate]
impl: 176
---

# SoftGate Comic API

Runtime: [`apps/api`](../../apps/api) (`@softgate/api`). Legacy EDC HTTP lists stay in [api-contract.md](api-contract.md) and are not this product.

## Health

`GET /health`

```json
{ "data": { "ok": true, "persist": "stub" } }
```

No `Set-Cookie`. `GET`/`PUT /api/data` is not implemented (404).

## Published catalog (Impl 172)

`GET /api/catalog`

```json
{ "data": { "authors": [], "genres": [], "webtoons": [], "episodes": [], "coinPackages": [] } }
```

`data` is a published read model (`PublishedCatalog`), not whole `SharedData`. Draft webtoons/episodes are omitted; scheduled episodes stay. Persist is still stub (`publishedCatalogFrom(getSharedData())`) then paywall-redact locked premium `images` (keep `imageSizes`). Optional `sg_reader` cookie; never 401. Portal consumes this when `VITE_USE_MOCK_API=false`. Convention: [portal-catalog-read.md](../conventions/portal-catalog-read.md).

## Portal settings (Impl 173)

`GET /api/settings`

```json
{
  "data": {
    "maintenanceMode": false,
    "allowRegistration": true,
    "contactEmail": "admin@softgatecomic.com",
    "defaultLanguage": "en"
  }
}
```

Stub persist returns Admin seed defaults. Portal consumes this when `VITE_USE_MOCK_API=false`. Missing/invalid payload fails open. Convention: [portal-settings-read.md](../conventions/portal-settings-read.md).

## Reader auth (Impl 174)

`POST /api/auth/register` · `POST /api/auth/login` · `POST /api/auth/logout` · `GET /api/auth/me` · `POST /api/auth/refresh`

Passwords hashed with bcryptjs (cost 12). httpOnly cookies `sg_reader` (15 min) and `sg_reader_refresh` (7 days). Errors `{ error: { code } }`. Register 403 `REGISTRATION_CLOSED` when settings close registration or maintenance is on. Persist users are in-memory stub.

Portal mock still uses localStorage. HTTP mode (`VITE_USE_MOCK_API=false`) uses cookies as source of truth. Convention: [portal-auth-http.md](../conventions/portal-auth-http.md).

## Reader wallet (Impl 175)

`GET /api/wallet/me` · `POST /api/wallet/demo-topup` · `POST /api/wallet/unlock`

In-memory stub ledger (seed 150). Unlock body `{ webtoonId, episodeNumber }`; debit unstripped catalog `coinPrice`. Wait-for-free now returns `NOT_LOCKED` (no debit). Locked catalog episodes have empty `images`. Portal mock still uses `softgate_wallet_v1`. Convention: [portal-wallet-http.md](../conventions/portal-wallet-http.md).

## Named integrations (Impl 176)

Optional env slots for `DATABASE_URL`, Cloudflare R2, and Brevo. Prisma 6 schema at `apps/api/prisma/schema.prisma` mirrors stub users/wallet/refresh. Persist stays `kind: "stub"` even when `DATABASE_URL` is set. Convention: [named-integrations.md](../conventions/named-integrations.md).

## Env (`apps/api/.env.example`)

| Variable               | Required    | Notes                                                            |
| ---------------------- | ----------- | ---------------------------------------------------------------- |
| `NODE_ENV`             | yes         | `development` / `production` / `test`                            |
| `PORT`                 | no          | Default `3000`                                                   |
| `CLIENT_URL`           | yes         | CORS allowlist                                                   |
| `ADMIN_URL`            | no          | CORS allowlist when set; do not invent Admin port                |
| `JWT_SECRET`           | yes in prod | Dev stub `dev-only-not-for-production` is rejected in production |
| `DATABASE_URL`         | no          | Named slot; non-empty string; unused by persist                  |
| `R2_ACCOUNT_ID`        | no          | Named slot                                                       |
| `R2_ACCESS_KEY_ID`     | no          | Named slot                                                       |
| `R2_SECRET_ACCESS_KEY` | no          | Named slot                                                       |
| `R2_BUCKET`            | no          | Named slot                                                       |
| `R2_PUBLIC_BASE_URL`   | no          | Optional HTTP origin                                             |
| `BREVO_API_KEY`        | no          | Named slot                                                       |
| `BREVO_FROM_EMAIL`     | no          | Named slot; required with key for `isMailConfigured`             |

## Local

```bash
pnpm dev:api
```

Portal `pnpm dev` stays mock/localStorage unless `VITE_USE_MOCK_API=false`.
---

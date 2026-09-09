---
title: SoftGate Comic API
type: reference
date: 2026-08-24
tags: [api, health, catalog, settings, auth, wallet, library, notifications, prefs, env, softgate]
impl: 195
---

# SoftGate Comic API

Runtime: [`apps/api`](../../apps/api) (`@softgate/api`). Legacy EDC HTTP lists stay in [api-contract.md](api-contract.md) and are not this product.

Leader **dev** JWT / R2 / Brevo map onto existing env slots in gitignored `apps/api/.env` (Impl 193). Impl 194 sets `DATABASE_URL` locally (`sslmode=require`) and migrates reader tables once. Impl 195 reads Admin catalog tables when persist is Prisma. No `R2_ENDPOINT`. Sender name stays SoftGate Comic. Live secrets are not in this file.

## Health

`GET /health`

```json
{ "data": { "ok": true, "persist": "stub" } }
```

`persist` is `"stub"` (in-memory) or `"prisma"` (Postgres via Prisma). No `Set-Cookie`. `GET`/`PUT /api/data` is not implemented (404). `createApp` does not pick the adapter; boot `openPersist` does.

## Published catalog (Impl 172 / 195)

`GET /api/catalog`

```json
{ "data": { "authors": [], "genres": [], "webtoons": [], "episodes": [] } }
```

`data` is a published read model (`PublishedCatalog`), not whole `SharedData`. Draft webtoons/episodes are omitted; scheduled episodes stay. Stub persist uses `publishedCatalogFrom(getSharedData())`. Prisma persist maps Admin `Author` / `Genre` / `Webtoon` / `WebtoonGenre` / `Episode` (Impl 195); `coinPackages` is omitted (unset) until Admin has a table. Unlocked keys come from stub maps or `WalletUnlock`. Optional `sg_reader` cookie; never 401. Portal consumes this when `VITE_USE_MOCK_API=false`. Convention: [portal-catalog-read.md](../conventions/portal-catalog-read.md).

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

## Reader auth (Impl 174–189)

`POST /api/auth/register` · `POST /api/auth/login` · `POST /api/auth/logout` · `GET /api/auth/me` · `POST /api/auth/refresh` · `POST /api/auth/forgot` · `POST /api/auth/reset` · `POST /api/auth/profile` · `POST /api/auth/password` · `POST /api/auth/delete-account`

Passwords hashed with bcryptjs (cost 12). httpOnly cookies `sg_reader` (15 min) and `sg_reader_refresh` (7 days). Errors `{ error: { code } }`. Register 403 `REGISTRATION_CLOSED` when settings close registration or maintenance is on. Users live in the persist adapter (stub maps or Prisma `ReaderUser`). Forgot always `{ data: { ok: true } }`. Reset 400 `RESET_TOKEN_INVALID`; no session cookies. Profile is a partial patch (`displayName`, `email`, `bio`, `avatar`); empty `{}` → 400; email taken → 409. `avatar` present must be a jpeg/png/webp data URL within the 512 KB string-length cap or 400 `VALIDATION_ERROR`. Password change does not re-issue cookies. Delete-account clears cookies.

Portal mock still uses localStorage when `VITE_USE_MOCK_API` is not `false`. HTTP mode (`VITE_USE_MOCK_API=false`) uses cookies as source of truth, including profile writers. Committed portal `.env.example` is `false`; Vite does not load it. Local `pnpm dev` HTTP uses gitignored `.env.development.local` plus `pnpm dev:api`. Convention: [portal-auth-http.md](../conventions/portal-auth-http.md).

## Reader wallet (Impl 175)

`GET /api/wallet/me` · `POST /api/wallet/demo-topup` · `POST /api/wallet/unlock`

Stub or Prisma ledger (seed 150). Unlock body `{ webtoonId, episodeNumber }`; debit unstripped catalog `coinPrice`. Wait-for-free now returns `NOT_LOCKED` (no debit). Locked catalog episodes have empty `images`. Portal mock still uses `softgate_wallet_v1`. Convention: [portal-wallet-http.md](../conventions/portal-wallet-http.md).

## Named integrations (Impl 176–187)

Optional env slots for `DATABASE_URL`, Cloudflare R2, and Brevo. Prisma persist when `DATABASE_URL` is set (boot fails if Postgres is down). Prisma catalog read from Admin tables (Impl 195); no portal catalog migration. R2 `createObjectStore`: four core slots → `PutObject` under `portal/`; else `R2_NOT_CONFIGURED`. Mail `createMail`: key + from → HTML send; else `MAIL_NOT_CONFIGURED`. Settings CMS stays stub. Convention: [named-integrations.md](../conventions/named-integrations.md). ADR: [008-prisma-persist-boot.md](../decisions/008-prisma-persist-boot.md), [009-r2-object-store.md](../decisions/009-r2-object-store.md), [010-brevo-mail.md](../decisions/010-brevo-mail.md).

## Env (`apps/api/.env.example`)

| Variable               | Required    | Notes                                                            |
| ---------------------- | ----------- | ---------------------------------------------------------------- |
| `NODE_ENV`             | yes         | `development` / `production` / `test`                            |
| `PORT`                 | no          | Default `3000`                                                   |
| `CLIENT_URL`           | yes         | CORS allowlist                                                   |
| `ADMIN_URL`            | no          | CORS allowlist when set; do not invent Admin port                |
| `JWT_SECRET`           | yes in prod | Dev stub `dev-only-not-for-production` is rejected in production |
| `DATABASE_URL`         | no          | Empty = stub. Set = Prisma; boot fails if Postgres is down       |
| `R2_ACCOUNT_ID`        | no          | Core R2; with access/secret/bucket enables put                   |
| `R2_ACCESS_KEY_ID`     | no          | Core R2                                                          |
| `R2_SECRET_ACCESS_KEY` | no          | Core R2                                                          |
| `R2_BUCKET`            | no          | Core R2; shared bucket; this API uses `portal/` keys             |
| `R2_PUBLIC_BASE_URL`   | no          | Public origin only; unset = no `publicUrl`                       |
| `BREVO_API_KEY`        | no          | With from email enables send                                     |
| `BREVO_FROM_EMAIL`     | no          | Required with key for `isMailConfigured`                         |

## Local

```bash
pnpm dev:api
# Optional Prisma path:
pnpm --filter @softgate/api db:up
pnpm --filter @softgate/api db:migrate
# then set DATABASE_URL in apps/api/.env (do not commit)
```

Portal `pnpm dev` is HTTP only when gitignored `.env.development.local` sets `VITE_USE_MOCK_API=false` **and** `pnpm dev:api` is running. Committed `.env.example` is `false` but Vite does not load it. Unset (Vercel without the var) stays mock. ADR: [011-portal-http-local.md](../decisions/011-portal-http-local.md).

## Library (Impl 190)

Cookie session required. POST JSON Content-Type. Snapshot `{ bookmarks, history, likedWebtoonIds }`. Empty arrays if none (does not seed). Persist stub or Prisma.

| Method | Path                            |
| ------ | ------------------------------- |
| GET    | `/api/library/me`               |
| POST   | `/api/library/subscribe`        |
| POST   | `/api/library/mute`             |
| POST   | `/api/library/stamp-notified`   |
| POST   | `/api/library/history`          |
| POST   | `/api/library/like`             |
| POST   | `/api/library/remove-bookmarks` |
| POST   | `/api/library/remove-history`   |
| POST   | `/api/library/remove-likes`     |

401 `NOT_AUTHENTICATED`. 400 `VALIDATION_ERROR`. Convention: [portal-library-http.md](../conventions/portal-library-http.md).

## Notifications (Impl 191)

Cookie session required. POST JSON Content-Type. Snapshot `{ notifications }`. Empty array if none (does not seed). Persist stub or Prisma. Prefs are not applied on the server.

| Method | Path                            |
| ------ | ------------------------------- |
| GET    | `/api/notifications/me`         |
| POST   | `/api/notifications/upsert`     |
| POST   | `/api/notifications/read`       |
| POST   | `/api/notifications/read-all`   |
| POST   | `/api/notifications/delete`     |
| POST   | `/api/notifications/clear-read` |

401 `NOT_AUTHENTICATED`. 400 `VALIDATION_ERROR`. Convention: [portal-notifications-http.md](../conventions/portal-notifications-http.md).

## Prefs (Impl 192)

Cookie session required. POST JSON Content-Type. Snapshot `{ notifPrefs, readerPrefs }`. Missing row returns defaults and does not insert. Persist stub or Prisma.

| Method | Path                |
| ------ | ------------------- |
| GET    | `/api/prefs/me`     |
| POST   | `/api/prefs/notif`  |
| POST   | `/api/prefs/reader` |

401 `NOT_AUTHENTICATED`. 400 `VALIDATION_ERROR`. Empty `{}` on `/notif` is 400. Convention: [portal-prefs-http.md](../conventions/portal-prefs-http.md).

## Comments (Impl 197)

Shared public thread keyed by `id:digits` or `id:series`. Guest GET. Cookie session for writes. POST JSON Content-Type. Snapshot `{ comments }` newest-first. Persist stub or Prisma. `addReply` may upsert `comment_reply` for the parent author. Report sets a flag; the row stays visible.

| Method | Path                   |
| ------ | ---------------------- |
| GET    | `/api/comments?key=`   |
| POST   | `/api/comments/add`    |
| POST   | `/api/comments/reply`  |
| POST   | `/api/comments/edit`   |
| POST   | `/api/comments/delete` |
| POST   | `/api/comments/like`   |
| POST   | `/api/comments/report` |

401 `NOT_AUTHENTICATED` on writes. 400 `VALIDATION_ERROR`. Convention: [portal-comments-http.md](../conventions/portal-comments-http.md).

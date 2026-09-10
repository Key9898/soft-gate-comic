---
title: SoftGate Comic API
type: reference
date: 2026-08-24
tags:
  [
    api,
    health,
    catalog,
    settings,
    about,
    press,
    auth,
    wallet,
    library,
    notifications,
    prefs,
    env,
    softgate,
  ]
impl: 195
impl_updated: 211
---

# SoftGate Comic API

Runtime: [`apps/api`](../../apps/api) (`@softgate/api`). Legacy EDC HTTP lists stay in [api-contract.md](api-contract.md) and are not this product.

Leader **dev** JWT / R2 / Brevo map onto existing env slots in gitignored `apps/api/.env` (Impl 193). Impl 194 sets `DATABASE_URL` locally (`sslmode=require`) and migrates reader tables once. Impl 195 reads Admin catalog tables when persist is Prisma. Impl 201 maps Admin `CoinPackage` onto catalog `coinPackages`. Impl **202** live join: SoftGate Hono is not Admin `:3000`. Impl **203** delivery pipe: `ADMIN_SERVICE_TOKEN` + VAPID. No `R2_ENDPOINT`. Sender name stays SoftGate Comic. Live secrets are not in this file.

## Health

`GET /health`

```json
{ "data": { "ok": true, "persist": "stub" } }
```

`persist` is `"stub"` (in-memory) or `"prisma"` (Postgres via Prisma). No `Set-Cookie`. `GET`/`PUT /api/data` is not implemented (404). `createApp` does not pick the adapter; boot `openPersist` does. Admin Express health is `{ status, db }` — not this envelope. Boot prints `SoftGate API :<port> persist=<kind>` (Impl 202).

## Published catalog (Impl 172 / 195 / 201)

`GET /api/catalog`

```json
{ "data": { "authors": [], "genres": [], "webtoons": [], "episodes": [] } }
```

`data` is a published read model (`PublishedCatalog`), not whole `SharedData`. Draft webtoons/episodes are omitted; scheduled episodes stay. Stub persist uses `publishedCatalogFrom(getSharedData())`. Prisma persist maps Admin `Author` / `Genre` / `Webtoon` / `WebtoonGenre` / `Episode` (Impl 195) and Admin `CoinPackage` (Impl 201). Missing packs table omits `coinPackages` (unset, not `[]`). Empty packs table is `[]`. Unlocked keys come from stub maps or `WalletUnlock`. Optional `sg_reader` cookie; never 401. Portal consumes this when `VITE_USE_MOCK_API=false`. Convention: [portal-catalog-read.md](../conventions/portal-catalog-read.md).

## Portal settings (Impl 173 / 200)

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

Stub persist returns Admin seed defaults. Prisma persist reads Admin `PlatformSettings` (`id = platform`) (Impl 200); null row or missing table fail-open to the same seed. Envelope is `{ data }` (never Admin `{ settings }`). GET does not insert. Portal consumes this when `VITE_USE_MOCK_API=false`. Missing/invalid payload fails open. Convention: [portal-settings-read.md](../conventions/portal-settings-read.md).

## Portal about (Impl 205)

`GET /api/about`

```json
{
  "data": {
    "histories": [],
    "members": [],
    "meta": {
      "deck": { "en": "The public-facing studio roles for this portal.", "mm": "…" },
      "standInNote": {
        "en": "Portraits and names are stand-ins until the studio publishes its public roster.",
        "mm": "…"
      },
      "standInVisible": true
    }
  }
}
```

Stub persist returns four seed histories (year 2026, months 1 / 3 / 6 / 12) and four people plus portal meta. Prisma persist reads Admin `AboutHistory` / `AboutTeamMember` / `AboutTeamMeta` (`id = about-team`) (Impl 205). Empty published lists stay `[]`. Missing list table (`P2021`) is `[]` for that list. Null meta or missing meta table fail-open to stub meta. Envelope is `{ data }` (never Admin `{ histories }` / `{ members }`). GET does not insert. Published rows only; omit `published` and empty `photoUrl`. Optional cookie; never 401. Portal History consumes this when `VITE_USE_MOCK_API=false` (Impl 206). Portal Team consumes `members` + `meta` on the same GET (Impl 207). Convention: [portal-about-read.md](../conventions/portal-about-read.md).

## Portal press (Impl 211)

`GET /api/press`

```json
{
  "data": {
    "copy": { "boilerplateTitle": { "en": "About SoftGate Comic", "mm": "…" } },
    "zipUrl": "/press-kit/softgate-comic-press-kit.zip",
    "contactEmail": "press@softgatecomic.com",
    "facts": [],
    "palette": [],
    "assets": [],
    "news": [],
    "stills": []
  }
}
```

Stub persist returns `STUB_PRESS` (today’s kit copy, empty news/stills). Prisma persist reads Admin `PressMeta` (`id = press`) / `PressNews` / `PressStill` (Impl 211). Missing table (`P2021`) fail-opens to stub. Envelope is `{ data }` (never Admin `{ meta }` / `{ news }`). GET does not insert. Published rows only; omit `published`. Spokesperson is a published About member or omitted. Optional cookie; never 401. Portal `/press` consumes this when `VITE_USE_MOCK_API=false`; fail keeps `t('press.*')`. Convention: [portal-press-read.md](../conventions/portal-press-read.md).

## Portal legal (Impl 212)

`GET /api/legal/privacy` · `GET /api/legal/terms`

```json
{
  "data": {
    "seoDesc": { "en": "…", "mm": "…" },
    "glance": [{ "en": "…", "mm": "…" }],
    "effectiveDate": "2026-09-10",
    "sections": [
      {
        "id": "privacy-collect",
        "slug": "collect",
        "kind": "body",
        "headingLevel": "h2",
        "title": { "en": "…", "mm": "…" },
        "body": { "en": "…", "mm": "…" },
        "bullets": [],
        "sortOrder": 0
      }
    ]
  }
}
```

Stub persist returns `STUB_PRIVACY` / `STUB_TERMS` (today’s copy). Prisma persist reads Admin `PrivacyMeta` / `PrivacySection` / `TermsMeta` / `TermsSection` (Impl 212). Missing table (`P2021`) fail-opens to stub. Envelope is `{ data }` (never Admin `{ meta }` / `{ sections }`). GET does not insert. Published rows only; omit `published`. Optional cookie; never 401. Portal `/privacy` `/terms` consume this when `VITE_USE_MOCK_API=false`; fail keeps `t('static.*')`. Convention: [portal-legal-read.md](../conventions/portal-legal-read.md).

## Portal FAQ and Cookie Policy (Impl 213)

`GET /api/faq` · `GET /api/cookies`

```json
{
  "data": {
    "items": [
      {
        "id": "q1",
        "category": "general",
        "question": { "en": "…", "mm": "…" },
        "answer": { "en": "…", "mm": "…" },
        "relatedTo": "/profile",
        "relatedLabel": { "en": "Profile", "mm": "…" },
        "sortOrder": 1
      }
    ]
  }
}
```

Cookie Policy envelope is `{ data: { effectiveDate, copy, glance, rows } }` — 22 copy keys, glance length 5, rows `{ id, storageKey, label, description, sortOrder }`.

Stub persist returns `STUB_FAQ` / `STUB_COOKIES` (today’s copy). Prisma persist reads Admin `FaqMeta` / `FaqItem` / `CookieMeta` / `CookieStorageRow` (Impl 213). Missing table (`P2021`) fail-opens to stub. Meta present + empty lists stay empty. Envelope is `{ data }` (never Admin `{ items }` / `{ meta, rows }`). GET does not insert. FAQ published rows only; omit `published`. Optional cookie; never 401. Portal `/faq` `/cookies` consume this when `VITE_USE_MOCK_API=false`; fail keeps today’s i18n. Help hub stays catalog. HTTP session cookies are not this route. Convention: [portal-faq-cookies-read.md](../conventions/portal-faq-cookies-read.md).

## Reader auth (Impl 174–189)

`POST /api/auth/register` · `POST /api/auth/login` · `POST /api/auth/logout` · `GET /api/auth/me` · `POST /api/auth/refresh` · `POST /api/auth/forgot` · `POST /api/auth/reset` · `POST /api/auth/profile` · `POST /api/auth/password` · `POST /api/auth/delete-account`

Passwords hashed with bcryptjs (cost 12). httpOnly cookies `sg_reader` (15 min) and `sg_reader_refresh` (7 days). Errors `{ error: { code } }`. Register 403 `REGISTRATION_CLOSED` when settings close registration or maintenance is on. Users live in the persist adapter (stub maps or Prisma `ReaderUser`). Forgot always `{ data: { ok: true } }`. Reset 400 `RESET_TOKEN_INVALID`; no session cookies. Profile is a partial patch (`displayName`, `email`, `bio`, `avatar`); empty `{}` → 400; email taken → 409. `avatar` present must be a jpeg/png/webp data URL within the 512 KB string-length cap or 400 `VALIDATION_ERROR`. Password change does not re-issue cookies. Delete-account clears cookies.

Portal mock still uses localStorage when `VITE_USE_MOCK_API` is not `false`. HTTP mode (`VITE_USE_MOCK_API=false`) uses cookies as source of truth, including profile writers. Committed portal `.env.example` is `false`; Vite does not load it. Local `pnpm dev` HTTP uses gitignored `.env.development.local` plus `pnpm dev:api`. Convention: [portal-auth-http.md](../conventions/portal-auth-http.md).

## Reader wallet (Impl 175)

`GET /api/wallet/me` · `POST /api/wallet/demo-topup` · `POST /api/wallet/unlock`

Stub or Prisma ledger (seed 150). Unlock body `{ webtoonId, episodeNumber }`; debit unstripped catalog `coinPrice`. Wait-for-free now returns `NOT_LOCKED` (no debit). Locked catalog episodes have empty `images`. Portal mock still uses `softgate_wallet_v1`. Convention: [portal-wallet-http.md](../conventions/portal-wallet-http.md).

## Named integrations (Impl 176–187)

Optional env slots for `DATABASE_URL`, Cloudflare R2, and Brevo. Prisma persist when `DATABASE_URL` is set (boot fails if Postgres is down). Prisma catalog read from Admin tables (Impl 195); no portal catalog migration. Prisma `CoinPackage` on catalog (Impl 201); no coin-table migration. Prisma settings read from Admin `PlatformSettings` (Impl 200); no portal settings migration or PATCH. Prisma about read from Admin About CMS (Impl 205); no portal about migration or write. Prisma press read from Admin Press CMS (Impl 211); no portal press migration or write. Prisma Privacy/Terms read from Admin legal CMS (Impl 212); no portal legal migration or write. Prisma FAQ/Cookies read from Admin FAQ/Cookies CMS (Impl 213); no portal FAQ/Cookies migration or write. R2 `createObjectStore`: four core slots → `PutObject` under `portal/`; else `R2_NOT_CONFIGURED`. Mail `createMail`: key + from → HTML send; else `MAIL_NOT_CONFIGURED`. Push `createPush`: all three VAPID slots → Web Push; else `PUSH_NOT_CONFIGURED`. Convention: [named-integrations.md](../conventions/named-integrations.md). ADR: [008-prisma-persist-boot.md](../decisions/008-prisma-persist-boot.md), [009-r2-object-store.md](../decisions/009-r2-object-store.md), [010-brevo-mail.md](../decisions/010-brevo-mail.md).

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
| `ADMIN_SERVICE_TOKEN`  | no          | Admin Express internal routes; unset = those routes 401          |
| `VAPID_PUBLIC_KEY`     | no          | With private + subject enables Web Push                          |
| `VAPID_PRIVATE_KEY`    | no          | Web Push                                                         |
| `VAPID_SUBJECT`        | no          | Web Push; required for `isPushConfigured`                        |

## Local

```bash
pnpm dev:api
# Optional Prisma path:
pnpm --filter @softgate/api db:up
pnpm --filter @softgate/api db:migrate
# then set DATABASE_URL in apps/api/.env (do not commit)
```

Portal `pnpm dev` is HTTP only when gitignored `.env.development.local` sets `VITE_USE_MOCK_API=false` **and** `pnpm dev:api` is **listening** on `VITE_API_BASE_URL`. Confirm `GET /health` `{ data: { ok, persist } }`. `ERR_CONNECTION_REFUSED` on that origin is SoftGate down — restart `pnpm dev:api`; do not retarget Admin; do not turn mock on. Committed `.env.example` is `false` but Vite does not load it. Unset (Vercel without the var) stays mock. ADR: [011-portal-http-local.md](../decisions/011-portal-http-local.md). Note: [2026-09-10-live-join-api-listen.md](../notes/2026-09-10-live-join-api-listen.md).

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

Push siblings on the same app (Impl 203). Do not mount a second `/api/notifications/push` route.

| Method | Path                                  | Auth   |
| ------ | ------------------------------------- | ------ |
| GET    | `/api/notifications/push/vapid`       | none   |
| POST   | `/api/notifications/push/subscribe`   | cookie |
| POST   | `/api/notifications/push/unsubscribe` | cookie |

GET vapid 503 `PUSH_NOT_CONFIGURED` when VAPID is unset. Delivery pipe: [portal-notifications-deliver.md](../conventions/portal-notifications-deliver.md).

## Prefs (Impl 192)

Cookie session required. POST JSON Content-Type. Snapshot `{ notifPrefs, readerPrefs }`. Missing row returns defaults and does not insert. Persist stub or Prisma.

| Method | Path                |
| ------ | ------------------- |
| GET    | `/api/prefs/me`     |
| POST   | `/api/prefs/notif`  |
| POST   | `/api/prefs/reader` |

401 `NOT_AUTHENTICATED`. 400 `VALIDATION_ERROR`. Empty `{}` on `/notif` is 400. Convention: [portal-prefs-http.md](../conventions/portal-prefs-http.md).

## Comments (Impl 197)

Shared public thread keyed by `id:digits` or `id:series`. Guest GET. Cookie session for writes. POST JSON Content-Type. Snapshot `{ comments }` newest-first. Persist stub or Prisma. `addReply` may upsert `comment_reply` for the parent author. HTTP reply then may email/push the parent (`deliverOutOfBand`) when `commentReply` is on. Body stays `{ data: { comments } }`. Report sets a flag; the row stays visible.

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

## Internal notifications (Impl 203–204)

Service token only (`ADMIN_SERVICE_TOKEN` header). Reader cookie without that header is still 401. Envelope `{ data }`. POST JSON Content-Type.

| Method | Path                                      |
| ------ | ----------------------------------------- |
| GET    | `/api/internal/notifications/search`      |
| POST   | `/api/internal/notifications/preview`     |
| POST   | `/api/internal/notifications/broadcast`   |
| POST   | `/api/internal/notifications/new-episode` |

Broadcast `type` is `system` | `promotion`. Inbox id `campaign:${campaignId}`. Sequential fan-out. `new-episode` body is `{ webtoonId, episodeNumber }` only (integer `>= 1`). Missing published pair → 200 zeros. Inbox id `sub-{webtoonId}-{episodeNumber}`. No campaign row. Convention: [portal-notifications-deliver.md](../conventions/portal-notifications-deliver.md).

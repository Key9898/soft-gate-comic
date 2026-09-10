---
title: Named backend integrations
type: convention
date: 2026-08-25
updated: 2026-09-10
tags: [api, prisma, r2, brevo, env, softgate]
impl: 195
impl_updated: 213
---

# Named backend integrations

PostgreSQL + Prisma, Cloudflare R2, and Brevo are **named** on `apps/api`. Impl 185 swaps reader persist when `DATABASE_URL` is set. Impl 186 adds an R2 put helper. Impl 187 adds forgot/reset mail + token API. Impl 193 maps leader **dev** fields onto these slots in gitignored local env. Impl 194 sets `DATABASE_URL` locally and runs `prisma migrate deploy` once. Impl 195 reads Admin catalog tables when persist is Prisma (no portal catalog migration). Impl 200 reads Admin `PlatformSettings` on `GET /api/settings` (no settings-table migration). Impl 201 maps Admin `CoinPackage` onto catalog `coinPackages` (no coin-table migration). Impl **202** live join: Admin Express often `:3000`; SoftGate Hono uses gitignored `PORT` + portal `VITE_API_BASE_URL`. Impl **203** adds optional `ADMIN_SERVICE_TOKEN` + VAPID Web Push. Impl **204** reuses that token for `POST /new-episode` (no new env). Impl **205** reads Admin About CMS on `GET /api/about` (no about-table migration). Impl **211** reads Admin Press CMS on `GET /api/press` (no press-table migration). Impl **212** reads Admin Privacy/Terms CMS on `GET /api/legal/privacy` and `GET /api/legal/terms` (no legal-table migration). Impl **213** reads Admin FAQ/Cookies CMS on `GET /api/faq` and `GET /api/cookies` (no FAQ/Cookies-table migration). Never commit a live URL.

## Env slots

Parsed by `parseEnv` via `emptyToUndef`. Empty / whitespace = unset. Boot does **not** require R2 or Brevo. `DATABASE_URL` is still optional; when set it **does** pick persist.

| Variable               | Required | Notes                                                                       |
| ---------------------- | -------- | --------------------------------------------------------------------------- |
| `DATABASE_URL`         | no       | Non-empty string (not Zod `.url()`). `postgresql://` / `postgres://`        |
| `R2_ACCOUNT_ID`        | no       | Core R2 slot                                                                |
| `R2_ACCESS_KEY_ID`     | no       | Core R2 slot                                                                |
| `R2_SECRET_ACCESS_KEY` | no       | Core R2 slot                                                                |
| `R2_BUCKET`            | no       | Core R2 slot                                                                |
| `R2_PUBLIC_BASE_URL`   | no       | Optional public origin (`r2.dev` or custom). Not required to put            |
| `BREVO_API_KEY`        | no       | Mail slot                                                                   |
| `BREVO_FROM_EMAIL`     | no       | Verified sender later                                                       |
| `ADMIN_SERVICE_TOKEN`  | no       | Admin Express → `/api/internal/notifications`. Unset = all those routes 401 |
| `VAPID_PUBLIC_KEY`     | no       | Web Push. All three VAPID slots = send                                      |
| `VAPID_PRIVATE_KEY`    | no       | Web Push                                                                    |
| `VAPID_SUBJECT`        | no       | Web Push (`mailto:` typical)                                                |

Helpers: `isDatabaseConfigured` (URL set) / `isR2Configured` (account + access + secret + bucket; public base optional) / `isMailConfigured` (api key **and** from email) / `isPushConfigured` (all three VAPID slots). `openPersist` in `apps/api/src/index.ts` reads `isDatabaseConfigured`. `createApp` does not pick persist. R2, mail, and push are not required at boot.

## R2 helper (Impl 186)

| Condition                  | Helper                                                            |
| -------------------------- | ----------------------------------------------------------------- |
| Core R2 empty / partial    | `putObject` throws `R2_NOT_CONFIGURED`; no SDK call               |
| All four core slots set    | S3 `PutObject` to `https://<ACCOUNT_ID>.r2.cloudflarestorage.com` |
| `R2_PUBLIC_BASE_URL` unset | put allowed if core set; `publicUrl` is `undefined`               |
| `R2_PUBLIC_BASE_URL` set   | `publicUrl` = origin + `/` + full key under `portal/`             |

- Shared bucket. This API’s keys are under `portal/` (`r2ObjectKey`). Do not use an `admin/` prefix here.
- No `ACL` on put. No `R2_ENDPOINT` env. Bucket is `R2_BUCKET`, not a path on the account host. No upload HTTP routes. `GET /health` does not report R2.
- Boot does **not** fail if R2 is unset.

## Mail helper (Impl 187)

| Condition            | Helper                                                              |
| -------------------- | ------------------------------------------------------------------- |
| Mail empty / partial | no SDK send; forgot still 200                                       |
| Key + from set       | Brevo v6 `htmlContent` / `textContent` (repo HTML, no template IDs) |
| Unknown email        | 200; no token; no send                                              |
| Send error on forgot | still 200 (do not leak that the address exists)                     |

- Forgot link = `CLIENT_URL` (trailing slash stripped) + `/reset-password/<raw>`. Token hashed at rest, TTL 1 hour.
- Reset updates `passwordHash`, deletes the token, revokes refresh JTIs. Confirmation send errors swallowed.
- `GET /health` does not report mail. Boot does **not** fail if Brevo is unset.
- Portal HTTP drops Demo OTP. Mock OTP stepper does not persist password.
- Transactional sender **name** in code is SoftGate Comic. No `BREVO_FROM_NAME` slot.

## Persist boot (Impl 185)

| Condition                    | Persist                             | `GET /health` `data.persist` |
| ---------------------------- | ----------------------------------- | ---------------------------- |
| `DATABASE_URL` empty / unset | in-memory stub                      | `"stub"`                     |
| URL set + Postgres up        | Prisma on existing reader models    | `"prisma"`                   |
| URL set + Postgres down      | **do not boot** (`process.exit(1)`) | no silent stub               |

- Reader models: `ReaderUser`, `RefreshToken`, `ReaderPasswordReset`, `Wallet`, `WalletTransaction`, `WalletUnlock`, `LibrarySubscribe`, `LibraryHistory`, `LibraryLike`, `ReaderNotification`, `ReaderPushSubscription`, `ReaderNotificationCampaign`, `ReaderUserPrefs`. This repo commits reader-table SQL only.
- Catalog **read** (Impl 195 / 201): Prisma persist maps Admin `Author` / `Genre` / `Webtoon` / `WebtoonGenre` / `Episode` (schema copy, no portal catalog migration) and Admin `CoinPackage` onto optional `coinPackages`. Stub persist still uses `publishedCatalogFrom(getSharedData())`. Missing catalog title tables must not fall back to seed. Missing `CoinPackage` table omits the field (`undefined`, not `[]`). Empty packs table is `[]`. Do not `migrate` catalog or coin tables from this repo.
- Settings **read** (Impl 200): Prisma persist maps Admin `PlatformSettings` (`id = platform`; schema copy, no portal settings migration). Stub persist still returns `STUB_PORTAL_SETTINGS`. Null row or missing table (`P2021`) fail-open to those defaults. GET does not insert. Missing catalog tables stay an error; missing settings table does not close the site. Do not `migrate` settings tables from this repo. Website does not write settings.
- About **read** (Impl 205): Prisma persist maps Admin `AboutHistory` / `AboutTeamMember` / `AboutTeamMeta` (`id = about-team`; schema copy, no portal about migration). Stub persist still returns `STUB_ABOUT`. Empty published lists stay `[]`. Missing list table (`P2021`) is `[]` for that list only. Null meta or missing meta table fail-open to stub meta. GET does not insert. Independent try/catch per table. Do not `migrate` about tables from this repo. Website does not write about. Portal History consumes `GET /api/about` when mock is off (Impl 206). Portal Team consumes `members` + `meta` on the same GET (Impl 207).
- Press **read** (Impl 211): Prisma persist maps Admin `PressMeta` (`id = press`) / `PressNews` / `PressStill` (schema copy, no portal press migration). Stub persist still returns `STUB_PRESS`. Missing press table (`P2021`) or empty meta with empty lists fail-open to stub. GET does not insert. Published news/stills only. Spokesperson from a published About member or omit. Do not `migrate` press tables from this repo. Website does not write press. Portal `/press` consumes `GET /api/press` when mock is off; fail keeps `t('press.*')`.
- Legal **read** (Impl 212): Prisma persist maps Admin `PrivacyMeta` (`id = privacy`) / `PrivacySection` / `TermsMeta` (`id = terms`) / `TermsSection` (schema copy, no portal legal migration). Stub persist still returns `STUB_PRIVACY` / `STUB_TERMS`. Missing legal table (`P2021`) or empty meta with empty sections fail-open to stub. GET does not insert. Published sections only; omit `published`. Do not `migrate` legal tables from this repo. Website does not write legal. Portal `/privacy` `/terms` consume `GET /api/legal/privacy` and `GET /api/legal/terms` when mock is off; fail keeps `t('static.*')`.
- FAQ / Cookies **read** (Impl 213): Prisma persist maps Admin `FaqMeta` (`id = faq`) / `FaqItem` / `CookieMeta` (`id = cookies`) / `CookieStorageRow` (schema copy, no portal FAQ/Cookies migration). Stub persist still returns `STUB_FAQ` / `STUB_COOKIES`. Missing table (`P2021`) or empty meta with empty lists fail-open to stub. Meta present + empty lists stay empty (not stub 20/16). GET does not insert. FAQ published rows only; omit `published`. Drop unknown `relatedTo` / `storageKey`. Do not `migrate` FAQ/Cookies tables from this repo. Website does not write FAQ/Cookies. Portal `/faq` `/cookies` consume `GET /api/faq` and `GET /api/cookies` when mock is off; fail keeps today’s i18n. Help hub stays catalog. HTTP session cookies stay `apps/api/src/cookies.ts`; CMS mappers are `apps/api/src/cookiePolicy/`.
- `authFlags` (`setAuthFlags`) stay in-memory on both adapters.
- Username lookup is case-insensitive (stub maps + Prisma `mode: 'insensitive'`).
- Local Docker: `apps/api/docker-compose.yml` (`pnpm --filter @softgate/api db:up`) then `db:migrate`.
- Catalog table names match Admin SQL (`"Author"` etc.). Settings table is `"PlatformSettings"`. Coin packs table is `"CoinPackage"`. About tables are `"AboutHistory"` / `"AboutTeamMember"` / `"AboutTeamMeta"`. Press tables are `"PressMeta"` / `"PressNews"` / `"PressStill"`. Legal tables are `"PrivacyMeta"` / `"PrivacySection"` / `"TermsMeta"` / `"TermsSection"`. FAQ/Cookies tables are `"FaqMeta"` / `"FaqItem"` / `"CookieMeta"` / `"CookieStorageRow"`. This repo does not CREATE them. Confirm title tables exist on the same `DATABASE_URL` before Prisma catalog reads. A missing packs table must not fail the catalog. A missing about table must not fail the other about lists. A missing press table must not blank `/press`. A missing legal table must not blank `/privacy` `/terms`. A missing FAQ/Cookies table must not blank `/faq` `/cookies`.
- Leader-dev URL lives in gitignored `apps/api/.env`. Public proxy uses `sslmode=require`. Set URL + down Postgres = boot fail. `.env.example` placeholder is fake (`CHANGE_ME_DBNAME` on `127.0.0.1`), not a live server. Migrate with `pnpm --filter @softgate/api db:migrate` once — not in `pnpm check` or `pnpm dev`.
- Live join (Impl 202): Admin Express often binds 3000. SoftGate gitignored `PORT` + portal `VITE_API_BASE_URL`. Boot log is `SoftGate API :<port> persist=<kind>`. SoftGate health is `{ data: { ok, persist } }`. Portal fail banner + `ERR_CONNECTION_REFUSED` on that origin = SoftGate not listening (restart `pnpm dev:api`; health is ground truth, not a “running” terminal row). Do not point the portal at Admin. Do not flip mock on for live join. Note: [2026-09-10-live-join-api-listen.md](../notes/2026-09-10-live-join-api-listen.md).
- Delivery pipe (Impl 203): `createPush` throws `PUSH_NOT_CONFIGURED` when VAPID is unset/partial. Internal broadcast uses `ADMIN_SERVICE_TOKEN` (never `VITE_*`). `deleteReaderUser` / `clearAuth` drop push rows with explicit `deleteMany` (do not assume `onDelete: Cascade`). Convention: [portal-notifications-deliver.md](portal-notifications-deliver.md).
- Episode fan-out (Impl 204): same service token. `POST /api/internal/notifications/new-episode`. No new env. No Prisma migration (`LibrarySubscribe` already exists). No `ReaderNotificationCampaign`. Convention: [portal-notifications-deliver.md](portal-notifications-deliver.md).

## Schema vs check

- `pnpm --filter @softgate/api prisma:validate` uses a dummy `DATABASE_URL`.
- `prisma generate` (dummy URL, no Postgres) runs in api `build` only. `pnpm check` may run generate via turbo `build`. Never `migrate` / `db push` in check.
- Api `test:run` waits on this package’s `build` (`apps/api/turbo.json`) so generate is not raced in parallel with `tsc`.
- `PersistPort` is an explicit interface (`kind: 'stub' | 'prisma'`). Routes keep importing the module singleton `persist`.
- `createObjectStore` throws `R2_NOT_CONFIGURED` or `R2_INVALID_KEY` via `IntegrationError`. `createMail` throws `MAIL_NOT_CONFIGURED` when unset. `createPush` throws `PUSH_NOT_CONFIGURED` when unset. Forgot/reset HTTP routes call mail only if configured.
- Git never holds live `DATABASE_URL`, R2, Brevo, VAPID, `ADMIN_SERVICE_TOKEN`, or JWT values. `development` is the integration branch; use local gitignored env only.

ADR: [007-backend-integrations.md](../decisions/007-backend-integrations.md), [008-prisma-persist-boot.md](../decisions/008-prisma-persist-boot.md), [009-r2-object-store.md](../decisions/009-r2-object-store.md), [010-brevo-mail.md](../decisions/010-brevo-mail.md), [012-development-branch.md](../decisions/012-development-branch.md).

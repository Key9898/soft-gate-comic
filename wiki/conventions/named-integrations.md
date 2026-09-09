---
title: Named backend integrations
type: convention
date: 2026-08-25
updated: 2026-09-09
tags: [api, prisma, r2, brevo, env, softgate]
impl: 195
---

# Named backend integrations

PostgreSQL + Prisma, Cloudflare R2, and Brevo are **named** on `apps/api`. Impl 185 swaps reader persist when `DATABASE_URL` is set. Impl 186 adds an R2 put helper. Impl 187 adds forgot/reset mail + token API. Impl 193 maps leader **dev** fields onto these slots in gitignored local env. Impl 194 sets `DATABASE_URL` locally and runs `prisma migrate deploy` once. Impl 195 reads Admin catalog tables when persist is Prisma (no portal catalog migration). Never commit a live URL.

## Env slots

Parsed by `parseEnv` via `emptyToUndef`. Empty / whitespace = unset. Boot does **not** require R2 or Brevo. `DATABASE_URL` is still optional; when set it **does** pick persist.

| Variable               | Required | Notes                                                                |
| ---------------------- | -------- | -------------------------------------------------------------------- |
| `DATABASE_URL`         | no       | Non-empty string (not Zod `.url()`). `postgresql://` / `postgres://` |
| `R2_ACCOUNT_ID`        | no       | Core R2 slot                                                         |
| `R2_ACCESS_KEY_ID`     | no       | Core R2 slot                                                         |
| `R2_SECRET_ACCESS_KEY` | no       | Core R2 slot                                                         |
| `R2_BUCKET`            | no       | Core R2 slot                                                         |
| `R2_PUBLIC_BASE_URL`   | no       | Optional public origin (`r2.dev` or custom). Not required to put     |
| `BREVO_API_KEY`        | no       | Mail slot                                                            |
| `BREVO_FROM_EMAIL`     | no       | Verified sender later                                                |

Helpers: `isDatabaseConfigured` (URL set) / `isR2Configured` (account + access + secret + bucket; public base optional) / `isMailConfigured` (api key **and** from email). `openPersist` in `apps/api/src/index.ts` reads `isDatabaseConfigured`. `createApp` does not pick persist. R2 and mail are not read at boot.

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

- Reader models: `ReaderUser`, `RefreshToken`, `ReaderPasswordReset`, `Wallet`, `WalletTransaction`, `WalletUnlock`, `LibrarySubscribe`, `LibraryHistory`, `LibraryLike`, `ReaderNotification`, `ReaderUserPrefs`. This repo commits reader-table SQL only.
- Catalog **read** (Impl 195): Prisma persist maps Admin `Author` / `Genre` / `Webtoon` / `WebtoonGenre` / `Episode` (schema copy, no portal catalog migration). Stub persist still uses `publishedCatalogFrom(getSharedData())`. Missing catalog tables must not fall back to seed. Portal settings stay stub on both adapters. Do not `migrate` catalog tables from this repo.
- `authFlags` (`setAuthFlags`) stay in-memory on both adapters.
- Username lookup is case-insensitive (stub maps + Prisma `mode: 'insensitive'`).
- Local Docker: `apps/api/docker-compose.yml` (`pnpm --filter @softgate/api db:up`) then `db:migrate`.
- Catalog table names match Admin SQL (`"Author"` etc.). This repo does not CREATE them. Confirm they exist on the same `DATABASE_URL` before Prisma catalog reads.
- Leader-dev URL lives in gitignored `apps/api/.env`. Public proxy uses `sslmode=require`. Set URL + down Postgres = boot fail. `.env.example` placeholder is fake (`CHANGE_ME_DBNAME` on `127.0.0.1`), not a live server. Migrate with `pnpm --filter @softgate/api db:migrate` once — not in `pnpm check` or `pnpm dev`.

## Schema vs check

- `pnpm --filter @softgate/api prisma:validate` uses a dummy `DATABASE_URL`.
- `prisma generate` (dummy URL, no Postgres) runs in api `build` only. `pnpm check` may run generate via turbo `build`. Never `migrate` / `db push` in check.
- Api `test:run` waits on this package’s `build` (`apps/api/turbo.json`) so generate is not raced in parallel with `tsc`.
- `PersistPort` is an explicit interface (`kind: 'stub' | 'prisma'`). Routes keep importing the module singleton `persist`.
- `createObjectStore` throws `R2_NOT_CONFIGURED` or `R2_INVALID_KEY` via `IntegrationError`. `createMail` throws `MAIL_NOT_CONFIGURED` when unset. Forgot/reset HTTP routes call mail only if configured.
- Git never holds live `DATABASE_URL`, R2, Brevo, or JWT values. `development` is the integration branch; use local gitignored env only.

ADR: [007-backend-integrations.md](../decisions/007-backend-integrations.md), [008-prisma-persist-boot.md](../decisions/008-prisma-persist-boot.md), [009-r2-object-store.md](../decisions/009-r2-object-store.md), [010-brevo-mail.md](../decisions/010-brevo-mail.md), [012-development-branch.md](../decisions/012-development-branch.md).

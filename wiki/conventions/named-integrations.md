---
title: Named backend integrations
type: convention
date: 2026-08-25
tags: [api, prisma, r2, brevo, env, softgate]
impl: 176
---

# Named backend integrations

PostgreSQL + Prisma, Cloudflare R2, and Brevo are **named** on `apps/api`. Runtime persist stays the in-memory stub until a later Impl swaps adapters.

## Env slots

Parsed by `parseEnv` via `emptyToUndef`. Empty / whitespace = unset. Boot does **not** require them. Setting them does **not** switch persist.

| Variable               | Required | Notes                                                                |
| ---------------------- | -------- | -------------------------------------------------------------------- |
| `DATABASE_URL`         | no       | Non-empty string (not Zod `.url()`). `postgresql://` / `postgres://` |
| `R2_ACCOUNT_ID`        | no       | Core R2 slot                                                         |
| `R2_ACCESS_KEY_ID`     | no       | Core R2 slot                                                         |
| `R2_SECRET_ACCESS_KEY` | no       | Core R2 slot                                                         |
| `R2_BUCKET`            | no       | Core R2 slot                                                         |
| `R2_PUBLIC_BASE_URL`   | no       | Optional HTTP origin for later public covers                         |
| `BREVO_API_KEY`        | no       | Mail slot                                                            |
| `BREVO_FROM_EMAIL`     | no       | Verified sender later                                                |

Helpers: `isDatabaseConfigured` (URL set) / `isR2Configured` (account + access + secret + bucket; public base optional) / `isMailConfigured` (api key **and** from email). **Do not** read these flags to pick persist in 176.

## Schema vs runtime

- Prisma 6 schema at `apps/api/prisma/schema.prisma` mirrors stub users / refresh jti / wallet / unlock. No catalog CMS tables.
- `pnpm --filter @softgate/api prisma:validate` uses a dummy `DATABASE_URL`. Never `migrate` / `db push` / `generate` in `pnpm check`.
- `PersistPort` is `typeof persist`. Routes keep importing `persist`. Do not auto-switch when `DATABASE_URL` is set.
- Object-store / mail not-configured adapters throw `R2_NOT_CONFIGURED` / `MAIL_NOT_CONFIGURED`. No HTTP routes call them yet.

ADR: [007-backend-integrations.md](../decisions/007-backend-integrations.md).

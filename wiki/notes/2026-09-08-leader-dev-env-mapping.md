---
title: Impl 193 — Leader dev env mapping
type: note
date: 2026-09-08
tags: [api, env, r2, brevo, jwt, softgate]
impl: 193
---

# Impl 193 — Leader dev env mapping

Map the leader **dev** stack onto existing `apps/api` slots in gitignored local env. Runtime TypeScript is unchanged. Catalog/CMS stay unwired.

## Slot mapping (env names only)

| Leader field          | Local slot             |
| --------------------- | ---------------------- |
| JWT                   | `JWT_SECRET`           |
| R2 account            | `R2_ACCOUNT_ID`        |
| R2 access key         | `R2_ACCESS_KEY_ID`     |
| R2 secret             | `R2_SECRET_ACCESS_KEY` |
| R2 bucket             | `R2_BUCKET`            |
| R2 public origin      | `R2_PUBLIC_BASE_URL`   |
| Brevo API key         | `BREVO_API_KEY`        |
| Verified sender email | `BREVO_FROM_EMAIL`     |

Do **not** add `R2_ENDPOINT`. The SDK host is `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`; the bucket is `R2_BUCKET`, not a path on that host.

Sender display name in code stays **SoftGate Comic**. There is no `BREVO_FROM_NAME` slot.

## `DATABASE_URL`

Impl **194** sets this in gitignored `apps/api/.env` with `sslmode=require` and runs `prisma migrate deploy` once. A set URL with unreachable Postgres fails boot (stub is not a fallback). Committed `.env.example` has a fake placeholder only (`CHANGE_ME_DBNAME` on `127.0.0.1`). Live values never go in git or wiki.

## Out

- Catalog CMS tables (shipped Impl 195)
- `db push`
- Vercel, prod keys, Admin merge

Convention: [named-integrations.md](../conventions/named-integrations.md). Git: [02-workflow.md](../02-workflow.md). Follow-up: [2026-09-09-leader-dev-prisma.md](2026-09-09-leader-dev-prisma.md).

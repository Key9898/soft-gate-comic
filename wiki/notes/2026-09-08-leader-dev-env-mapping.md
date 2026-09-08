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

Leave unset on this machine until the leader **database name** is known. Host/user/password alone is not a URL. A set URL with unreachable Postgres fails boot (stub is not a fallback). Committed `.env.example` has a fake placeholder only (`CHANGE_ME_DBNAME` on `127.0.0.1`). Live values never go in git or wiki.

Later (not this running config): `postgresql://USER:PASS@HOST:PORT/DBNAME?sslmode=require` on a public Railway proxy.

## Out

- Prisma migrate / `db push` on the shared leader DB
- Mock catalog off, Vercel, prod keys, Admin merge
- `VITE_USE_MOCK_API`, catalog CMS tables

Convention: [named-integrations.md](../conventions/named-integrations.md). Git: [02-workflow.md](../02-workflow.md).

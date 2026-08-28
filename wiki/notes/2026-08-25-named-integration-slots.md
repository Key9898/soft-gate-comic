---
title: Impl 176 — Named integration slots
type: note
date: 2026-08-25
tags: [api, prisma, r2, brevo, env, softgate]
impl: 176
---

# Impl 176 — Named integration slots

Optional env slots + Prisma 6 schema + TypeScript ports. Runtime persist stays `kind: "stub"`. Portal unchanged.

## What shipped

- `parseEnv` optional slots: `DATABASE_URL` (non-empty string, not HTTP URL), R2 core + optional `R2_PUBLIC_BASE_URL`, `BREVO_API_KEY` + `BREVO_FROM_EMAIL`
- `isDatabaseConfigured` / `isR2Configured` / `isMailConfigured` — unused for adapter choice
- `apps/api/prisma/schema.prisma` mirrors stub ReaderUser / RefreshToken / Wallet / WalletTransaction / WalletUnlock
- Prisma CLI 6.x + `cross-env` dummy URL on `prisma:validate` (hooked into API `test:run`)
- `PersistPort = typeof persist` (no DI)
- Not-configured `ObjectStorePort` / `MailPort` throw `R2_NOT_CONFIGURED` / `MAIL_NOT_CONFIGURED`
- `pnpm check`: portal 566 tests / 82 files; API 39 tests / 9 files

## Honesty

- Setting `DATABASE_URL` does not change `GET /health` `{ persist: "stub" }`
- No `@prisma/client` persist swap, no R2 SDK, no Brevo send
- In-memory users/wallets still reset on API restart

## Out

- Prisma migrate / generate in check
- Signed CDN / R2 upload
- Live forgot-password mail
- Portal mock/HTTP path changes
- Admin / PSP / catalog CMS tables

Convention: [named-integrations.md](../conventions/named-integrations.md).

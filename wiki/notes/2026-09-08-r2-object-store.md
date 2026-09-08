---
title: Impl 186 — R2 helper with portal prefix
type: note
date: 2026-09-08
tags: [api, r2, object-store, softgate]
impl: 186
---

# Impl 186 — R2 helper with portal prefix

`createObjectStore` on `apps/api` uses `@aws-sdk/client-s3` `PutObject` when the four core R2 env slots are set. Empty or partial slots throw `R2_NOT_CONFIGURED` and do not send. Keys live under `portal/` on the shared bucket. Public URLs come only from `R2_PUBLIC_BASE_URL`. No upload HTTP routes. API boot does not ping R2. Persist/health/portal unchanged.

## What shipped

- `r2ObjectKey` + `createObjectStore` in `apps/api/src/ports/object-store.ts`
- R2 adapter `apps/api/src/ports/r2-object-store.ts` (injectable `send` for tests)
- Tests without live Cloudflare

## Honesty

- No HTTP route calls the helper yet
- Custom domain is env only; `r2.dev` is not hardcoded
- Fake keys are not in git

## Out

- Catalog CMS, cover pipeline, portal mock default
- Brevo (Impl 187)
- `GET /health` R2 field

Convention: [named-integrations.md](../conventions/named-integrations.md). ADR: [009-r2-object-store.md](../decisions/009-r2-object-store.md).

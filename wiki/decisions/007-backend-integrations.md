---
title: SoftGate backend integrations
type: decision
date: 2026-08-24
tags: [api, hono, postgres, prisma, r2, brevo, softgate]
impl: 171
---

# SoftGate backend integrations

## Status

Accepted

## Context

Impl 171 needs an API process in this monorepo without catalog HTTP, auth replacement, or a live database. Later Impls will persist catalog, store media, and send mail. The user named the integration stack after 170: PostgreSQL + Prisma, Cloudflare R2, Brevo.

## Decision

- **HTTP now:** Hono on Node (`@hono/node-server`) in `apps/api`. Nest is out. Express is not the 2026 TypeScript default; Fastify is Node-only. Hono matches the named Cloudflare R2 stack without deploying to Workers in 171.
- **Persist in 171:** stub only. Do not require `DATABASE_URL` to boot.
- **Impl 176 slots:** Prisma CLI 6.x + schema mirroring stub users/wallet/refresh. Optional env for `DATABASE_URL`, R2, Brevo. Persist stays stub; do **not** auto-switch adapters when slots are set. No `@prisma/client` in persist, no R2/Brevo SDKs, no migrate in check.
- **Named for later Impls:** Prisma persist swap, Cloudflare R2 object storage, Brevo mail. Not Cloudinary.
- **No** `GET`/`PUT /api/data` blob dump as the product API.

## Consequences

- Local boot is Node on port 3000. Cookie helper assumes split origins in production (`SameSite=None; Secure`).
- Impl 172 serves `GET /api/catalog` from the persist stub (`publishedCatalogFrom` over shared mocks).
- Impl 176 names the stack in env + schema. Through 176, `GET /health` remained `{ persist: "stub" }` even if `DATABASE_URL` was set.
- **Impl 185** (persist swap): empty URL stays stub; set URL uses Prisma after `$connect`; set URL + down Postgres fails boot. Health `"prisma"` when connected. Catalog still mock-backed. See [008-prisma-persist-boot.md](008-prisma-persist-boot.md). Convention: [named-integrations.md](../conventions/named-integrations.md).
- **Impl 186** (R2 helper): four core slots → `PutObject` under `portal/`; else `R2_NOT_CONFIGURED`. Boot does not ping R2. See [009-r2-object-store.md](009-r2-object-store.md).
- **Impl 187** (Brevo helper): key + from → HTML send on forgot/reset; else skip send. Boot does not ping Brevo. See [010-brevo-mail.md](010-brevo-mail.md).
- Portal default stays `VITE_USE_MOCK_API` localStorage; HTTP catalog consume is opt-in (`VITE_USE_MOCK_API=false`).

## Alternatives considered

- Express 5 — largest hiring pool; weaker TypeScript and no Cloudflare-native story.
- Fastify — strong Node throughput; Node-only, extra ceremony for a skeleton.
- Prisma in 171 — blocked by the Impl 171 persist-stub lock even after the DB was named. Impl 176 installs the CLI + schema only. Impl 185 is the reader persist swap.

---

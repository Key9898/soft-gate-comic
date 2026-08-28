---
title: Impl 170 — Portal monorepo plumbing
type: note
date: 2026-08-24
tags: [monorepo, pnpm, turborepo, workspace, softgate]
impl: 170
---

# Impl 170 — Portal monorepo plumbing

This portal repo is now a pnpm + Turborepo workspace. Product UI and catalog localStorage behavior are unchanged. Admin dashboard stays in its own repo.

## Layout

```
soft-gate-comic/
  apps/portal/              @softgate/portal (Vite app)
  packages/shared/          @softgate/shared (catalog types + mock)
  packages/contracts/       @softgate/contracts (Zod envelope skeleton)
```

Root `pnpm check` is lint + Prettier (portal src, packages, wiki) + `turbo run test:run build`. Pre-push runs `pnpm check`. Portal Vite is **6** so Vitest 4 can import `vite/module-runner` under pnpm (Vite 5 does not export that path).

## Contracts

`@softgate/contracts` exports `ApiDataEnvelope`, `unwrapApiData`, and `apiDataEnvelopeSchema`. No HTTP client. No catalog/auth/wallet schemas. Portal does not import it yet.

## Deploy

Root `vercel.json` keeps SPA rewrites and sets `installCommand` / `buildCommand` / `outputDirectory` for `apps/portal/dist`. Confirm the Vercel project Root Directory still matches the git root.

## Out

- `apps/api` (Impl 171)
- Catalog HTTP (Impl 172)
- Admin merge / Admin wiki stamps
- DB choice

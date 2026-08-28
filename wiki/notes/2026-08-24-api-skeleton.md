---
title: Impl 171 — API skeleton
type: note
date: 2026-08-24
tags: [api, hono, skeleton, softgate]
impl: 171
---

# Impl 171 — API skeleton

`apps/api` (`@softgate/api`) is a Hono app on `@hono/node-server`. Product UI and catalog localStorage are unchanged. Admin dashboard stays in its own repo.

## What shipped

- `GET /health` → `{ data: { ok: true, persist: "stub" } }` via `@softgate/contracts`
- Zod env: `NODE_ENV`, `PORT` (default 3000), `CLIENT_URL`, optional `ADMIN_URL`, `JWT_SECRET`
- CORS allowlist; credentials on; no `*`
- `sessionCookieOptions` — httpOnly; secure + SameSite None in production; Lax in development. Health does not `Set-Cookie`
- Persist stub only (`kind: "stub"`)
- Root `pnpm dev:api`. Default `pnpm dev` is still the portal

## Named, not wired

PostgreSQL + Prisma, Cloudflare R2, Brevo. Fake `JWT_SECRET` stub in `.env.example` is for local only; production parse rejects it.

## Out

- `/api/data` blob dump
- Catalog HTTP consume in the portal (shipped Impl 172)
- Auth/session (174), wallet/unlock (175)
- Prisma / R2 / Brevo packages

---

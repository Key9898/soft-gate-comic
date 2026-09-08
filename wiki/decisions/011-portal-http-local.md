---
title: Local portal HTTP without inverting isMockApi
type: decision
date: 2026-09-08
tags: [portal, api, env, auth, softgate]
impl: 188
---

# Local portal HTTP without inverting isMockApi

## Status

Accepted

## Context

Local integration wants the portal to call `apps/api`. Vercel production builds currently omit `VITE_USE_MOCK_API`. Inverting the helper to `=== 'true'` would flip those builds to HTTP with no API origin. Profile writers still threw `AUTH_PROFILE_NOT_LIVE` in HTTP mode.

Vite never loads `.env.example`. Vite **does** load `.env` and `.env.local` in every mode, including vitest (`mode=test`). Putting `VITE_USE_MOCK_API=false` there would break mock tests.

## Decision

- Keep `isMockApi()` as `import.meta.env.VITE_USE_MOCK_API !== 'false'` (option A). Unset stays mock.
- Commit `apps/portal/.env.example` as `false` so humans copy the local-integration value.
- Local `pnpm dev` HTTP lives in gitignored `.env.development.local` (development mode only). Do not put `false` in `.env` / `.env.local`.
- Do not set `false` on Vercel until a real `VITE_API_BASE_URL` exists.
- JWT stays an example stub; never commit a real secret; do not write `apps/api/.env`.
- Profile / password / delete-account writers use cookie POSTs on stub + Prisma persist.

## Consequences

- Vercel without the var stays mock/localStorage.
- `pnpm check` stays mock unless a test stubs `VITE_USE_MOCK_API=false`.
- `pnpm dev` on this machine hits localhost:3000 when `.env.development.local` is present and `pnpm dev:api` is running. API down → catalog error shell, not mock seed.

## Alternatives considered

- Invert helper to `=== 'true'` (option B) — rejected; Vercel unset would become HTTP.
- Put `false` in `.env` / `.env.local` — rejected; Vitest would load it and mock tests would fail.
- Merge `pnpm dev` + API via `concurrently` or a Vite proxy — rejected; portal already uses `VITE_API_BASE_URL` + `credentials: 'include'`.

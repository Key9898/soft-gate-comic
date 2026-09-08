---
title: Impl 188 — Local portal HTTP + profile writers
type: note
date: 2026-09-08
tags: [portal, api, auth, http, env, softgate]
impl: 188
---

# Impl 188 — Local portal HTTP + profile writers

Local portal talks to local API when `VITE_USE_MOCK_API=false`. The helper is still `import.meta.env.VITE_USE_MOCK_API !== 'false'`. Unset (Vercel production build without the var, Vitest) stays **mock**. Product lock A.

## Env

- Committed [`apps/portal/.env.example`](../../apps/portal/.env.example) is `false`. Vite does **not** load `.env.example`.
- `pnpm dev` (Vite `mode=development`) reads gitignored `.env.development.local`. This machine’s file sets `false` + `VITE_API_BASE_URL=http://localhost:3000`.
- Do **not** put `false` in `.env` / `.env.local` — Vite also loads those in vitest (`mode=test`) and mock tests would hit HTTP.
- Do **not** set `false` on Vercel until a real `VITE_API_BASE_URL` exists.
- API JWT: example stub only; never commit a real secret; do not write `apps/api/.env`.

## Profile writers

Persist (stub + Prisma, no migration): `updateReaderProfile` (partial keys only; email unique excluding self; do not change `id`/username), `changeReaderPassword`, `deleteReaderUser`.

| Method | Path                       | Notes                                                        |
| ------ | -------------------------- | ------------------------------------------------------------ |
| POST   | `/api/auth/profile`        | Cookie; empty `{}` → 400; success `{ data: publicUser }`     |
| POST   | `/api/auth/password`       | Cookie; no Set-Cookie; stay signed in                        |
| POST   | `/api/auth/delete-account` | Cookie + password; `clearSessionCookies`; `{ data: { ok } }` |

Portal HTTP `updateProfile` sends only defined keys. No `migrateUserData` / `userIdFromEmail`. No `AUTH_PROFILE_NOT_LIVE`.

## Honesty

- Mock save copy still says “this device” / “demo account.”
- HTTP save copy is `Profile saved.` / `Password updated.`
- Local HTTP with API down = catalog error + empty shell, not mock seed. Need `pnpm dev` + `pnpm dev:api`.
- No avatar byte cap (same as mock data URLs).

## Out

- Admin, R2 avatars, catalog CMS, JWT in git, Impl 189, `concurrently`, Vite proxy, PATCH profile, username editor, refresh revoke on password change.

Convention: [portal-auth-http.md](../conventions/portal-auth-http.md). ADR: [011-portal-http-local.md](../decisions/011-portal-http-local.md).

---
title: Portal auth HTTP (reader cookie)
type: convention
date: 2026-08-24
updated: 2026-09-08
tags: [auth, api, cookie, http, softgate]
impl: 174
impl_updated: 189
---

# Portal auth HTTP (reader cookie)

Reader session source of truth depends on `VITE_USE_MOCK_API`.

`isMockApi()` is `import.meta.env.VITE_USE_MOCK_API !== 'false'`. Unset (Vercel without the var, Vitest) stays mock. Committed [`apps/portal/.env.example`](../../apps/portal/.env.example) is `false`; Vite does **not** load the example. Local `pnpm dev` HTTP needs gitignored `.env.development.local` (not `.env` / `.env.local`, which Vitest also loads) plus `pnpm dev:api`. Do not write “pnpm dev is HTTP” as if the example were loaded.

## Mock on (`VITE_USE_MOCK_API` is not `false`)

[`AuthContext`](../../apps/portal/src/context/AuthContext.tsx) keeps [`client-auth.md`](client-auth.md): `softgate_accounts_v1` + `softgate_user`.

## Mock off

Cookie + API is source of truth. Do **not** write `softgate_user` / `softgate_accounts_v1`. HTTP `updateProfile` must not call `migrateUserData` / `userIdFromEmail`.

Portal `authFetch` uses `credentials: 'include'`. Settings `fetch` stays without credentials. Catalog `fetch` sends credentials so paywall strip can see `sg_reader` (Impl 175); it does **not** use `authFetch` (catalog never 401s).

| Method | Path                       | Notes                                                                                                                                                                                                                                                                                        |
| ------ | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | `/api/auth/register`       | bcrypt hash; 403 `REGISTRATION_CLOSED` if registration closed or maintenance                                                                                                                                                                                                                 |
| POST   | `/api/auth/login`          | 401 `INVALID_CREDENTIALS`                                                                                                                                                                                                                                                                    |
| POST   | `/api/auth/logout`         | `{ data: { ok: true } }`; revoke refresh `jti`                                                                                                                                                                                                                                               |
| GET    | `/api/auth/me`             | access cookie                                                                                                                                                                                                                                                                                |
| POST   | `/api/auth/refresh`        | rotate refresh `jti`; send JSON `{}`                                                                                                                                                                                                                                                         |
| POST   | `/api/auth/forgot`         | always `{ data: { ok: true } }`; send link only if mail configured                                                                                                                                                                                                                           |
| POST   | `/api/auth/reset`          | `{ token, password }`; 400 `RESET_TOKEN_INVALID`; no session cookies                                                                                                                                                                                                                         |
| POST   | `/api/auth/profile`        | `{ displayName?, email?, bio?, avatar? }`; empty `{}` → 400 `VALIDATION_ERROR`; 409 `EMAIL_TAKEN`; partial keys only. `avatar` present must be a jpeg/png/webp data URL under `ceil(524288 * 4 / 3) + 32` chars or 400 `VALIDATION_ERROR`. Portal picker: file ≤ 524288 bytes, jpeg/png/webp |
| POST   | `/api/auth/password`       | `{ currentPassword, newPassword }`; no Set-Cookie; stay signed in                                                                                                                                                                                                                            |
| POST   | `/api/auth/delete-account` | `{ password }`; `clearSessionCookies`; `{ data: { ok: true } }`                                                                                                                                                                                                                              |

Profile routes are POST so they inherit the JSON Content-Type guard (POST-only). Display name present and empty or shorter than 3 characters → `VALIDATION_ERROR`. Password change does not revoke refresh JTIs.

Cookies (not `sg_staff`):

| Name                | Role        | TTL    |
| ------------------- | ----------- | ------ |
| `sg_reader`         | access JWT  | 15 min |
| `sg_reader_refresh` | refresh JWT | 7 days |

Both httpOnly. `sessionCookieOptions` flags only (`path: /`, Lax/dev, None+Secure/prod). `maxAge` is set per cookie at `setCookie`.

`/me` and profile success bodies match portal `AuthUser` (no password, no `coinBalance`). Persist is stub or Prisma when `DATABASE_URL` is set.

Notifications, preferences, library, and engagement stay on localStorage.

## Boot

Keep `isLoading` true until `/me` (and refresh retry) settles so `ProtectedRoute` does not bounce guests to `/login`.

Guest access is unchanged: [`guest-access.md`](guest-access.md). Wallet / unlock HTTP authority: [`portal-wallet-http.md`](portal-wallet-http.md).
---

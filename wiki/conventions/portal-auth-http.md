---
title: Portal auth HTTP (reader cookie)
type: convention
date: 2026-08-24
tags: [auth, api, cookie, http, softgate]
impl: 174
---

# Portal auth HTTP (reader cookie)

Reader session source of truth depends on `VITE_USE_MOCK_API`.

## Mock on (`VITE_USE_MOCK_API` is not `false`)

[`AuthContext`](../../apps/portal/src/context/AuthContext.tsx) keeps [`client-auth.md`](client-auth.md): `softgate_accounts_v1` + `softgate_user`. Default for `pnpm dev`.

## Mock off

Cookie + API is source of truth. Do **not** write `softgate_user` / `softgate_accounts_v1`.

Portal `authFetch` uses `credentials: 'include'`. Settings `fetch` stays without credentials. Catalog `fetch` sends credentials so paywall strip can see `sg_reader` (Impl 175); it does **not** use `authFetch` (catalog never 401s).

| Method | Path                 | Notes                                                                        |
| ------ | -------------------- | ---------------------------------------------------------------------------- |
| POST   | `/api/auth/register` | bcrypt hash; 403 `REGISTRATION_CLOSED` if registration closed or maintenance |
| POST   | `/api/auth/login`    | 401 `INVALID_CREDENTIALS`                                                    |
| POST   | `/api/auth/logout`   | `{ data: { ok: true } }`; revoke refresh `jti`                               |
| GET    | `/api/auth/me`       | access cookie                                                                |
| POST   | `/api/auth/refresh`  | rotate refresh `jti`; send JSON `{}`                                         |

Cookies (not `sg_staff`):

| Name                | Role        | TTL    |
| ------------------- | ----------- | ------ |
| `sg_reader`         | access JWT  | 15 min |
| `sg_reader_refresh` | refresh JWT | 7 days |

Both httpOnly. `sessionCookieOptions` flags only (`path: /`, Lax/dev, None+Secure/prod). `maxAge` is set per cookie at `setCookie`.

`/me` public body matches portal `AuthUser` (no password, no `coinBalance`). Persist is stub (in-memory users).

## Profile writers

`updateProfile` / `changePassword` / `deleteAccount` stay mock-local. HTTP mode throws `AUTH_PROFILE_NOT_LIVE`. Forgot/reset stay Demo UI.

## Boot

Keep `isLoading` true until `/me` (and refresh retry) settles so `ProtectedRoute` does not bounce guests to `/login`.

Guest access is unchanged: [`guest-access.md`](guest-access.md). Wallet / unlock HTTP authority: [`portal-wallet-http.md`](portal-wallet-http.md).
---

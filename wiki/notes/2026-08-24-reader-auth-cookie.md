---
title: Impl 174 — Reader auth httpOnly cookie
type: note
date: 2026-08-24
tags: [auth, api, cookie, bcrypt, softgate]
impl: 174
---

# Impl 174 — Reader auth httpOnly cookie

Reader register/login/logout/me/refresh on `apps/api`. Passwords hashed with bcryptjs (cost 12). Session cookies `sg_reader` + `sg_reader_refresh`. Portal mock default still uses localStorage; HTTP mode (`VITE_USE_MOCK_API=false`) uses the cookie API as source of truth.

## What shipped

- Stub persist user + refresh `jti` maps (`clearAuth` / `setAuthFlags` for tests)
- `jose` HS256 with existing `JWT_SECRET`
- Portal `AuthContext` dual-path; `authFetch` with `credentials: 'include'`
- HTTP profile writers throw `AUTH_PROFILE_NOT_LIVE` (no extra write APIs)

## Honesty

- Persist users are in-memory (reset on API restart)
- Access JWT stays valid until expiry after logout; refresh `jti` is revoked
- Forgot/reset still do not persist passwords
- Guest matrix unchanged

## Out

- Wallet / unlock / PSP (175)
- Admin staff login / `sg_staff`
- Prisma user table; field encryption; Brevo

Convention: [portal-auth-http.md](../conventions/portal-auth-http.md).
---

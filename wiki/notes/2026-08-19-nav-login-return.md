---
title: Nav Login carries return from
type: note
date: 2026-08-19
tags: [auth, navigation, return-to, guest, softgate]
impl: 139
---

# Impl 139 — Nav Login carries return `from`

MainLayout guest Login (desktop + mobile drawer) now passes `state={{ from: location }}`, matching `ProtectedRoute` and gated actions. After sign-in, Login/Register already send the visitor to `safeReturnTo(from)` — including `/author/:id` and `/categories?sort=popular`.

AuthLayout is unchanged (logo stays Home). ReaderLayout has no Nav; reader guest nudge already carried `from`. Auth in-page Login links still must not set `from` to `/login`.

## Verify

`npx vitest run src/test/NavLoginReturn.test.tsx src/test/NavChrome.test.tsx src/test/LoginReturnFrom.test.tsx`

Then `npm run check`.

Guest on `/author/1` → header Login → sign in → back on `/author/1`.

## Next

Impl **140**

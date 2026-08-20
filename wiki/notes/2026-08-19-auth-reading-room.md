---
title: Auth reading room
type: note
date: 2026-08-19
tags: [auth, login, register, forgot-password, reading-room, softgate]
impl: 136
---

# Impl 136 — Auth reading room

Number 135 was taken by author profile. This ships as **136**.

Replaced the centered teal-gradient auth card with a SoftGate reading-room page: `public/auth/reading-room-lg.jpg` (desktop) and `reading-room-sm.jpg` (mobile strip). No Joe Part 04 slide, no OAuth, no BookCard ranks on auth.

## What shipped

- `AuthLayout`: skip link, logo → Home, LanguageSwitcher, 5/7 split, opaque form panel.
- `safeReturnTo` allowlist; Start here `/read/:id/1` is a valid return. Open redirects go `/`.
- Login/Register: email normalize, terms gate, username unique, job copy (does not lock guest reading). Logged-in users are sent off login/register, not forgot/reset.
- Forgot stepper on one URL: email (session email locked when signed in) → demo OTP `000000` (not emailed) → new password. Submit does **not** `upsertAccount`.
- `/reset-password/:token?`: no token = incomplete link; token = new password fields, still no persist.
- `faq.a5` matches the prepared mail path. Profile → Security remains for signed-in change-with-current-password.

## Verify

`npm run check`

Desktop login: books left, form right, EN/MM switch. Forgot: three steps, mock code, password in storage unchanged. Guest Get started free still lands on `/register`.

## Next

Impl **139**

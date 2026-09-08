---
title: Impl 187 — Brevo HTML forgot/reset + token API
type: note
date: 2026-09-08
tags: [api, brevo, mail, auth, softgate]
impl: 187
---

# Impl 187 — Brevo HTML forgot/reset + token API

`createMail` on `apps/api` uses `@getbrevo/brevo` v6 when `BREVO_API_KEY` and `BREVO_FROM_EMAIL` are set. Empty or partial slots skip send. Forgot always returns `{ data: { ok: true } }`. HTML templates live as TypeScript modules (EN+MM). HTTP portal drops Demo OTP and calls the API. Mock OTP stepper still does not persist a password.

## What shipped

- Templates `apps/api/src/mail/templates/forgot-password.ts` and `password-reset.ts`
- Adapter `apps/api/src/ports/brevo-mail.ts` (injectable `send`)
- `POST /api/auth/forgot` and `POST /api/auth/reset`
- `ReaderPasswordReset` persist (stub + Prisma migration)
- Portal HTTP forgot/reset pages

## Honesty

- Forgot does not claim mail was sent
- Raw token is never in JSON
- Fake Brevo keys are not in git

## Out

- Welcome / register mail
- Profile writers (`AUTH_PROFILE_NOT_LIVE`)
- Default `VITE_USE_MOCK_API=false` (Impl 188)
- `GET /health` mail field

Convention: [named-integrations.md](../conventions/named-integrations.md). ADR: [010-brevo-mail.md](../decisions/010-brevo-mail.md).

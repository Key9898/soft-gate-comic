---
title: Brevo mail helper
type: decision
date: 2026-09-08
tags: [api, brevo, mail, auth, softgate]
impl: 187
---

# Brevo mail helper

## Status

Accepted

## Context

Leader’s mail stack is Brevo. HTML lives in this repo (not dashboard template IDs). Missing mail env must not fail API boot. Forgot must not leak whether an email is registered.

## Decision

- Empty or partial mail slots (`BREVO_API_KEY`, `BREVO_FROM_EMAIL`) → no SDK send. Boot still listens.
- Both set → `@getbrevo/brevo` v6 `sendTransacEmail` with `htmlContent` / `textContent`. No `templateId`. No boot ping.
- `POST /api/auth/forgot` always `{ data: { ok: true } }`. Token stored hashed (TTL 1h) if the user exists. Send errors swallowed.
- Reset link is `${CLIENT_URL}/reset-password/<raw>`. Confirmation email has no token.
- HTTP portal drops Demo OTP. Mock keeps the OTP stepper and does not persist password.

## Consequences

- Local API works without a Brevo key.
- Enumeration-safe forgot copy cannot say “we sent mail.”

## Alternatives considered

- Fail boot when mail is unset — rejected; local/dev without Brevo must still serve catalog/auth.
- Brevo dashboard template IDs — rejected; HTML stays in git.
- Return the raw token in JSON for local DX — rejected; tests inject mail or seed persist.

---
title: Auth SoftGate split-card
type: note
date: 2026-08-19
tags: [auth, login, register, split-card, motion, softgate]
impl: 146
---

# Impl 146 — Auth portal split-card

Login/register become a SoftGate split-card: page is `gray-50` + `radial-wash-primary` (no full-bleed desk photo). `reading-room-lg.jpg` slides as the **card** 50% pane (0.65s, forced product motion). `/login` and `/register` URLs stay; `from` is forwarded. No OAuth, no Joe mountain/SaaS clone. Forgot/reset stay a plain white form card. Below `lg`, no slide.

## Verify

`npx vitest run src/test/AuthLayout.test.tsx src/test/LoginPage.test.tsx src/test/RegisterPage.test.tsx src/test/ForgotPasswordPage.test.tsx`

## Next

Impl **148**.

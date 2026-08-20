---
title: Auth split-card photo curtain
type: note
date: 2026-08-19
tags: [auth, login, register, split-card, motion, curtain, softgate]
impl: 149
---

# Impl 149 — Auth split-card photo curtain

Layout from Impl 146 stays (portal wash, photo inside the card, no full-bleed page photo, no OAuth). The motion was wrong: one `Outlet` form pane translated with the photo, so the halves looked like they swapped.

On `lg+`, `AuthSplitCard` mounts **both** `LoginPage` and `RegisterPage`. Login stays `left-0` / 50%. Register stays `left-1/2` / 50%. Form panes never get `translate-x-full`. Only `.auth-split-bg` translates (`translate-x-full` when `view === 'login'`). Heroes still fade/slide on the photo (`.auth-split-slide`, 0.65s). Inactive pane: `aria-hidden`, `pointer-events-none`, `inert` via DOM attribute. Below `lg`, inactive pane is `hidden`. Split routes do not render `Outlet`. Duplicate SEO is skipped when `embedded`. Input ids are prefixed (`login-email`, `register-email`, …). Inactive embedded pages do not `<Navigate>` when already signed in.

Forgot/reset unchanged. Forced product motion: do not `transition: none` `.auth-split-bg-motion` or `.auth-split-slide` in reduce blocks.

## Verify

`npx vitest run src/test/AuthLayout.test.tsx src/test/LoginPage.test.tsx src/test/RegisterPage.test.tsx src/test/ForgotPasswordPage.test.tsx src/test/LoginReturnFrom.test.tsx`

## Next

Impl **150**.

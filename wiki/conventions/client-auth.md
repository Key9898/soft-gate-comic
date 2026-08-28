---
title: Client auth honesty
type: convention
date: 2026-08-11
updated: 2026-08-24
tags: [auth, localStorage, demo, reading-room]
impl: 27
impl_updated: 174
---

# Client auth (mock-honest)

HTTP cookie session when mock is off is [portal-auth-http.md](portal-auth-http.md). This file is the **mock on** contract (`VITE_USE_MOCK_API` is not `false`).

## Storage

- Session: `softgate_user` (public profile, no password)
- Accounts: `softgate_accounts_v1` `{ schemaVersion: 1, byEmail: Record<email, AuthAccount> }`
- `user.id` = stable hash from email (`u_<hex>`)

## Rules

- Register creates account + session and navigates to `safeReturnTo(from)` or `/`
- Login checks email+password against accounts store (email trim + lowercase)
- Password **minimum 8 characters** (`MIN_PASSWORD_LENGTH` in `src/lib/auth/passwordPolicy.ts`). Register, Forgot, Reset, Login **forms**, and Profile Security / `AuthContext.register` + `changePassword` use it. `AuthContext.login` does **not** length-check so leftover 6-char stored passwords can still authenticate if typed; the Login form still blocks submit under 8.
- Username is unique (case-insensitive) at register
- Register Terms + Privacy checkbox gates submit
- Logout / delete account clear session (delete also removes account row)
- Email change migrates per-user data to the new id (`migrateUserData` in `src/lib/account` — byUserId stores including wallet, library, **author follows**, engagement, notifications, **notif prefs**, age confirm, plus comment authorship/likes; stale data under the new id is overwritten)
- Delete account cascades all stores (`deleteUserData` — same stores + own comments/replies removed, likes stripped elsewhere)
- Profile identity uses `useAuth()` — no separate `mockUser`
- OAuth buttons removed
- Demo accounts are browser-local only
- Logged-in visitors hitting `/login` or `/register` are redirected to `safeReturnTo`. Forgot/reset stay on those pages.

## Reading room (Impl 136 + 146 + 149)

Auth is a **portal page** (`gray-50` + `radial-wash-primary`), not a full-bleed photo and not a Joe Part 04 clone. `/login` and `/register` share [`AuthSplitCard`](../../src/features/auth/AuthSplitCard.tsx): **both forms stay mounted** on `lg+` — login glued `left-0` / 50%, register glued `left-1/2` / 50%. They do **not** translate. Only `.auth-split-bg` (reading-room photo) slides (`translate-x-full` on login, 0.65s, forced product motion). Hero copy fades on the photo. URLs stay `/login` and `/register`; `from` is forwarded. No OAuth. Register fields stay in the form pane (`overflow-y-auto` on `lg+`). Below `lg` there is no slide — the active form only, then atmosphere copy + `reading-room-sm.jpg`. Forgot/reset are a plain white form card (no split). Copy: Continue / Library / Coins — guests can still read free episodes (Home Get started free → `/register`). See [guest-access.md](guest-access.md).

## Return path

[`safeReturnTo`](../../src/lib/auth/safeReturnTo.ts): same-origin relative paths only (`/` + not `//`, no `\`, no `http:`). Allows `/read/:id/1` (Start here) and other in-app `from` values. MainLayout Nav Login passes `state={{ from: location }}` (pathname + search). Login/Register already forward `from` when switching forms. ReaderLayout has no Nav. AuthLayout logo stays `/`.

## Password reset (prepared for mail)

- `/forgot-password` stepper: email → OTP → new password. Enumeration-safe (always advances after a valid-looking email). Logged-in email is the session mailbox and is not editable.
- Demo OTP `000000` is on-page mock, **not emailed**. Resend repeats honesty.
- Final submit does **not** write `password` (`upsertAccount` / `changePassword` unused here) until backend+mail.
- `/reset-password/:token?` is the future emailed-link shell: missing token = incomplete link; token present skips OTP fields; submit still does not persist.
- Signed-in users can still change password from Profile → Security with the current password.

## Cross-tab sync (Impl 65)

`AuthContext` subscribes to the `softgate_user` key via `useStorageSync` — logout/login/profile updates in one tab propagate to the others (`setUser(readSession())`), and downstream contexts (wallet/engagement/library) reload through their existing `userId` effects. `softgate_accounts_v1` is deliberately not subscribed: every user-visible account change also rewrites the session key.

## Out of scope

Firebase, OAuth providers, email delivery, cross-device sync, live OTP.

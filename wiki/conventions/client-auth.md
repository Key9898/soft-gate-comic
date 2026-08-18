---
title: Client auth honesty
type: convention
date: 2026-08-11
tags: [auth, localStorage, demo]
impl: 27
---

# Client auth (mock-honest)

## Storage

- Session: `softgate_user` (public profile, no password)
- Accounts: `softgate_accounts_v1` `{ schemaVersion: 1, byEmail: Record<email, AuthAccount> }`
- `user.id` = stable hash from email (`u_<hex>`)

## Rules

- Register creates account + session and navigates to `from` or `/`
- Login checks email+password against accounts store
- Logout / delete account clear session (delete also removes account row)
- Email change migrates per-user data to the new id (`migrateUserData` in `src/lib/account` — 4 `byUserId` stores + comment authorship/likes; stale data under the new id is overwritten)
- Delete account cascades all stores (`deleteUserData` — 4 `byUserId` stores + own comments/replies removed, likes stripped elsewhere)
- Profile identity uses `useAuth()` — no separate `mockUser`
- OAuth buttons removed
- Forgot/Reset password: unavailable copy until backend (no fake email success)
- Demo accounts are browser-local only

## Cross-tab sync (Impl 65)

`AuthContext` subscribes to the `softgate_user` key via `useStorageSync` — logout/login/profile updates in one tab propagate to the others (`setUser(readSession())`), and downstream contexts (wallet/engagement/library) reload through their existing `userId` effects. `softgate_accounts_v1` is deliberately not subscribed: every user-visible account change also rewrites the session key.

## Out of scope

Firebase, OAuth providers, email delivery, cross-device sync.

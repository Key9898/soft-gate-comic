---
title: Client auth honesty (Register Profile Logout)
type: note
date: 2026-08-11
tags: [auth, profile]
impl: 27
---

# Impl 27 — A1 Auth honesty

## What shipped

- `src/lib/auth` accounts + session helpers
- AuthContext: register/login/logout/updateProfile/changePassword/deleteAccount
- Register creates session; Login validates credentials; OAuth removed
- Forgot/Reset: honest unavailable
- Profile uses Auth user; Logout/Save/Password/Delete wired locally
- App provider order: Data → Router → Auth → Library

## Verify

`npm run check`

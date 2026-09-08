---
title: Impl 189 — Cap profile avatars at 512 KB jpeg/png/webp
type: note
date: 2026-09-08
tags: [portal, api, auth, avatar, softgate]
impl: 189
---

# Impl 189 — Cap profile avatars at 512 KB jpeg/png/webp

Profile avatars stay data URLs in persist (no R2). The picker and `POST /api/auth/profile` now reject files over **524288** bytes and types other than jpeg/png/webp.

## What shipped

- Portal [`avatarPolicy.ts`](../../apps/portal/src/lib/auth/avatarPolicy.ts): `isAllowedAvatarFile` before FileReader
- API [`avatar.ts`](../../apps/api/src/auth/avatar.ts): `isAllowedAvatarDataUrl` (prefix + string length `ceil(524288 * 4 / 3) + 32`)
- EN+MM `profilePage.avatarTooLarge`

## Honesty

- API cap is data URL **string length**, not decoded bytes. The `+32` slack lets a 512 KB file through.
- Mock `updateProfile` still writes whatever string it is given if called outside the picker.
- Constants are duplicated portal/API like `MIN_PASSWORD_LENGTH`.

## Out

- R2 upload, client resize/compress, GIF/SVG/HEIC, library/notifs/prefs HTTP (190+)

Convention: [portal-auth-http.md](../conventions/portal-auth-http.md).

---
title: Reader guest conversion nudges
type: note
date: 2026-08-13
tags: [guest, reader, conversion, auth, i18n, softgate]
impl: 67
---

# Impl 67 — Reader guest conversion nudges

## Why

Guest-access audit + industry research (WEBTOON/Naver/Tapas/Lezhin/Manta) confirmed our WEBTOON-style model is right, but found two presentation gaps: guests on a premium episode saw "Unlock with Coins" + a misleading "Your balance: 0" and only discovered the login requirement after clicking; guests finishing a free episode got no sign-up prompt at the natural conversion moment.

## What shipped

- **Guest-aware locked screen** ([ReaderPage.tsx](../../src/features/reader/ReaderPage.tsx)) — button label switches to `readerPage.loginToUnlock` for guests; balance line renders only when authenticated; `handleUnlock` logic untouched (already redirects with `state.from`)
- **Chapter Complete sign-up nudge** — `!isAuthenticated` card below the next-chapter block: `readerPage.guestNudge` pitch, primary Button → `/register`, text Link → `/login`, both carrying `state.from = /read/:webtoonId/:episodeNumber` so the existing Login/Register return flow lands the reader back on the episode; `stopPropagation` (main click toggles header), `min-h-11` + `focus-visible` ring
- **i18n** — `readerPage.loginToUnlock` / `guestNudge` / `createFreeAccount` EN + MM
- **Test** — new `src/test/ReaderGuestNudge.test.tsx` (4 cases): nudge shown to guest on free ep + absent when logged in (session seeded via mocked `softgate_user` key); premium ep shows "Log in to unlock" + no balance for guest, coin button + balance for user
- **Convention** — new [guest-access.md](../conventions/guest-access.md) capturing the full audited guest policy matrix

## Files

- `src/features/reader/ReaderPage.tsx`
- `src/lib/i18n/locales/{en,mm}/translation.json`
- `src/test/ReaderGuestNudge.test.tsx` (new)
- `wiki/conventions/guest-access.md` (new)

## Verify

`npm run check`

## Next

Impl **68** — free

---
title: Library bookmark wiring + Home Save CTA
type: note
date: 2026-08-11
tags: [library, bookmarks, home, auth]
impl: 25
---

# Impl 25 — Library bookmark wiring + Home Save CTA

Plan was drafted as “Impl 24”; SoftGate master index already used 24 for categories genre scroll — this ships as **Impl 25**.

## What shipped

- `src/lib/library/` localStorage store (`softgate_library_v1`) per user id
- `LibraryContext` / `LibraryProvider` mounted in `App` + test utils
- Detail, Reader, Home Save CTAs toggle the shared store
- Library bookmarks tab derives from store (no random seed); delete/bulk-delete persist
- Login returns to `location.state.from` after success
- Guest Save redirects to login with return path

## Verify

`npm run check`

## Follow-up

Wire history from reader progress; likes heart; optional server sync.

> **Superseded:** History is client-persisted (Impl 31+); Home Continue + scroll resume (Impl 40–41). See [continue-reading.md](../conventions/continue-reading.md).

---
title: Impl 13 — Discovery pipelines UI truth
type: note
date: 2026-08-11
tags: [discovery, search, reader, genres, impl-13]
impl: 13
---

# Impl 13 — Discovery pipelines — UI truth

Fixes scan items: Reader silent fallback, Search trending free-text genre, MM genre labels on EN UI, Categories lang-only search, Search filters not in URL.

## Changes

- `ReaderPage`: no `[0]` fallback; in-page not-found
- Home / Detail: `resolveGenreLabel`
- Categories: bilingual `matchesQuery` haystack
- Search: trending → `/categories/:slug`; `status`/`genre`/`sort` URL sync

## Numbering note

Discovery plan batches were drafted as Impl 12–14; SoftGate master already had Impl 12 (typography), so this batch is **Impl 13**.

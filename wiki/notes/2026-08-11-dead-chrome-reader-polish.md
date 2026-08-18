---
title: Dead chrome + Reader polish + 404
type: note
date: 2026-08-11
tags: [library, reader, chrome]
impl: 36
---

# Impl 36 — D1 Dead chrome + Reader polish

## What shipped

- Library Filter/Sort hidden until real filters exist
- Reader `fontSize` applied to content; sound toggle removed
- Invalid webtoon id → not-found (no `webtoons[0]` fallback)
- Remember-me checkbox hidden

## Verify

`npm run check`

---
title: Episode images + Reader render
type: note
date: 2026-08-11
tags: [reader, media, shared]
impl: 30
---

# Impl 30 — B1 Episode media

## What shipped

- Filled `images: string[]` on shared mock episodes (cover-strip URLs)
- `SHARED_DATA_SCHEMA_VERSION` → **4**
- Reader renders episode images; empty → honest empty (`readerPage.noImages`)

## Verify

`npm run check`

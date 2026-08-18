---
title: Impl 11 — Categories Phase A
type: note
date: 2026-08-11
tags: [categories, genres, status, impl-11]
impl: 11
---

# Impl 11 — Categories Phase A

## Fixed

- EN empty genre filter: bilingual/slug match via `webtoonMatchesGenre`
- `/categories/:slug` synced with genre pills (navigate by path)
- Status chips: all / ongoing / completed / hiatus (`?status=`)
- Drafts excluded from public browse

## Catalog

Added genres: historical, mystery, supernatural, adventure, sports, superhero. Remapped mock titles so new pills are non-empty; one `hiatus` + one `completed` for status demos.

## QA tip

If localStorage still holds an old SoftGate mock DB, clear site data once so new genres/status appear.

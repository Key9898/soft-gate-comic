---
title: Share + Comments client-wire
type: note
date: 2026-08-11
tags: [share, comments, reader]
impl: 34
---

# Impl 34 — C2 Share + Comments

## What shipped

- Detail Share: Web Share API + clipboard fallback
- Reader Comments backed by `softgate_comments_v1` via shared `Comments`
- Empty seed (no fake commenters)

## Verify

`npm run check`

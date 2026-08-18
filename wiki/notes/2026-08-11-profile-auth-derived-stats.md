---
title: Profile Auth + derived stats
type: note
date: 2026-08-11
tags: [profile, auth]
impl: 33
---

# Impl 33 — C1 Profile = Auth + derived stats

## What shipped

- Stats from bookmarks + history/likes counts + wallet balance
- Save → `updateProfile`; avatar via file→dataURL
- Insights labeled honestly (no fake premium unlock claims)

## Verify

`npm run check`

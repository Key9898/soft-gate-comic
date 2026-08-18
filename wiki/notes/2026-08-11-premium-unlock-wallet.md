---
title: Premium unlock debit + persist
type: note
date: 2026-08-11
tags: [wallet, reader, unlock]
impl: 29
---

# Impl 29 — A3 Premium unlock

## What shipped

- `unlockedEpisodeKeys` on wallet user bucket
- Reader Unlock → balance check → debit + unlock + `spend` txn
- Guest → login `from`; unlocks persist across refresh

## Verify

`npm run check`

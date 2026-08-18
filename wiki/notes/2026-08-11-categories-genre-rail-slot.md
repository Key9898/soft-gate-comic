---
title: Categories genre reserved chevron + status size
type: note
date: 2026-08-11
impl: 26
tags: [categories, scroll, chips, softgate]
---

# Impl 26 — Categories genre reserved chevron + status size

## Goal

Stop overlaying the genre scroll chevron on chips; place it in a reserved right layout slot. Align status chip height/padding with genre chips.

## Shipped

- Genre row: `flex` + `flex-1 min-w-0` scroll + `shrink-0` chevron when `canScrollRight`
- Removed absolute fade/overlay chevron
- Status chips: `min-h-[38px] px-4.5 py-2.5` (same as genre); `rounded-2xl` unchanged

## Verify

- `npm run check`
- `/categories`: chevron beside strip; at end hides; status height matches genre

## Follow-up

- none (Home strip still out of scope)

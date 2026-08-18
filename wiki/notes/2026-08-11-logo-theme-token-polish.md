---
title: Impl 9 — Logo theme token polish
type: note
date: 2026-08-11
tags: [brand, theme, tokens, impl-9]
impl: 9
---

# Impl 9 — SoftGate Comic logo theme token polish

## What changed

- Recalibrated `@theme` to live [`logo.svg`](../../public/logo/logo.svg): letter `#69c9ca`, burst `#ee3968`, tip `#ef4124`, CTA kept `#0e9494`.
- Added `spark-*` + `.tag-spark` for rare heat moments.
- Coins Best Value → spark; Popular stays accent; hardcoded brand hexes → CSS variables.
- Reader progress glow RGBA synced to new accent.
- Convention rewritten: [brand-color-tokens.md](../conventions/brand-color-tokens.md).

## Out of scope

Typography / radius / motion overhaul; dark mode; full page redesign.

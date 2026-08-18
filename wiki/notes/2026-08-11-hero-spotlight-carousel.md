---
title: Hero Spotlight carousel (Trending 5)
type: note
date: 2026-08-11
tags: [home, hero, carousel]
impl: 49
---

# Impl 49 — SoftGate Comic Hero Spotlight carousel

## What shipped

- Replaced random featured hero with Trending top-5 rotator
- `HeroSpotlight`: static banner; crossfade title/CTAs/book; CTA-aligned dots + right-only next
- Autoplay 5s loop; pause hover/focus; reduced-motion disables autoplay
- Unit tests for dots, wrap, autoplay pause, reduced-motion

## Verify

`npm run check` — Home hero advances every 5s; hover freezes; 5th → 1st; banner never changes.

## Next Impl

**50**

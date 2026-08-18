---
title: Soft-Expressive radius (no pills, no subtle corners)
type: decision
date: 2026-08-11
tags: [radius, ui, softgate, brand]
impl: 10
---

# Soft-Expressive radius (no pills, no subtle corners)

## Status

Accepted

## Context

SoftGate Comic mixed pill CTAs (`rounded-full`), subtle controls (`rounded-lg` / `xl`), and marketing soft-rects (`rounded-2xl` / `3xl`). Home used pills while About/Careers used `2xl`; nav search was pill while Search page was `2xl`. Product preference: no pill UI, no subtle rounding — friendly consumer soft corners for a Myanmar webtoon portal.

## Decision

Adopt **Soft-Expressive**:

- Controls + shared surfaces → **`rounded-2xl` (16px)**
- Large panels / modals / marketing shells → **`rounded-3xl` (24px)**
- True circular geometry only → **`.shape-circle` (`border-radius: 50%`)** — never Tailwind `rounded-full`
- Ban `rounded-full`, `rounded-sm`, `rounded-md`, `rounded-lg` on SoftGate portal controls/surfaces

Do **not** flatten every component to a single 16px value (panel hierarchy must remain).

## Consequences

### Positive

- One visual language for CTAs and search across Home, nav, and info pages
- Softer brand than sharp Korean webtoon UIs (often 4–8px) without trendy pills
- Shared components own the defaults; pages inherit

### Negative

- Large one-time sweep across feature pages
- Avatars/spinners must remember `.shape-circle` instead of `rounded-full`

## Related

- [conventions/border-radius.md](../conventions/border-radius.md)
- [conventions/what-not-to-redo.md](../conventions/what-not-to-redo.md)

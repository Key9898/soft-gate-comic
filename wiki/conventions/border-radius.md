---
title: SoftGate Soft-Expressive Border Radius
type: convention
date: 2026-08-11
tags: [radius, ui, softgate, tokens]
impl: 10
---

# SoftGate Soft-Expressive Border Radius

Canonical corner-radius map for the SoftGate Comic portal. See also [ADR 002](../decisions/002-soft-expressive-radius.md).

## Scale (locked)

| Role                                                           | Class           | Value                |
| -------------------------------------------------------------- | --------------- | -------------------- |
| CTA, Button (all sizes), Input, Search, Select, Chip/Tag       | `rounded-2xl`   | 16px                 |
| Shared Card, dropdown menus                                    | `rounded-2xl`   | 16px                 |
| Modal, hero/marketing shells, large section panels             | `rounded-3xl`   | 24px                 |
| **Book / hardcover media** (covers only)                       | `.book-media`   | `3px 10px 10px 3px`  |
| Avatar, spinner, status dot, circular icon well, circular blur | `.shape-circle` | `border-radius: 50%` |

`.shape-circle` lives in `src/index.css`. Thin progress tracks use `rounded-2xl` (not pills via `rounded-full`).

## Shared component defaults

| Surface                 | File / utility                          | Radius                                    |
| ----------------------- | --------------------------------------- | ----------------------------------------- |
| Buttons                 | `Button.tsx`, `.btn-*`                  | `rounded-2xl`                             |
| Inputs                  | `Input.tsx`, `.input-base`              | `rounded-2xl`                             |
| Cards                   | `Card.tsx`, `.card`                     | `rounded-2xl`                             |
| Tags                    | `.tag*`                                 | `rounded-2xl`                             |
| Modal panel             | `Modal.tsx`                             | `rounded-3xl`                             |
| Search field / dropdown | `SearchAutocomplete.tsx`                | `rounded-2xl`                             |
| Book covers             | `.book-media`, `BookCard`, `HeroBook3D` | hardcover `3px 10px 10px 3px` (exception) |

## Bans (do not reintroduce)

- `rounded-full` anywhere in SoftGate UI
- Flattening Card / Button / Input / Modal to one radius with no panel hierarchy
- Page-level free mix of `xl` / `2xl` / `3xl` / `full` that fights shared components
- Subtle control radii: `rounded-sm`, `rounded-md`, `rounded-lg` on portal controls/surfaces
- Pill Home CTAs while marketing pages use soft-rect CTAs
- Forcing Soft-Expressive `rounded-2xl` onto **book covers** (use `.book-media` instead — see [book-cover-presentation.md](book-cover-presentation.md), ADR 004)

Prefer inheriting from shared components; override only when the role map requires `3xl` for a true large panel, or `.book-media` for hardcover covers.

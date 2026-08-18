---
title: Impl 7 — SoftGate Comic brand rename and SVG logo
type: note
date: 2026-08-10
tags: [brand, logo, rename, svg, impl-7]
impl: 7
---

# Impl 7 — SoftGate Comic brand rename and SVG logo

## Brand display name

Human-facing brand string updated from hyphenated form to **SoftGate Comic** (and **SoftGate Pay** on coins UI).

Kept as identifiers (unchanged):

- npm package / folder `soft-gate-comic`
- `@softgate/shared`
- Domain `softgatecomic.com`

## Logo

- In-app: [`public/logo/logo.svg`](../../public/logo/logo.svg) — transparent (no white canvas), teal + magenta/red + ink paths
- Wired in Navigation, Footer, AuthLayout with `object-contain` (not `object-cover`)
- OG / Twitter meta still use `logo.jpg` (crawler-friendly)

## Touched surfaces

- `index.html` SEO / JSON-LD
- i18n `en` + `mm`
- Auth / Home / About / Careers / Press / FAQ / Profile / Notifications / Coins
- `AGENTS.md`, Cursor/Antigravity rule 00, README, wiki overview/folder-map, shared package description

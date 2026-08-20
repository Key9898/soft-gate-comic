---
title: Help hub layout and Footer FAQ
type: note
date: 2026-08-19
tags: [help, faq, footer, support, info, softgate]
impl: 120
---

# Impl 120 — Help hub layout + Footer FAQ

FAQ stayed a real page but was easy to miss: Footer Support listed Help + Contact only, and Help never named `/faq` as a destination.

## What shipped

- Footer Support: Help Center, FAQ, Contact (`/help`, `/faq`, `/contact`). Company / Legal unchanged. FAQ is not in Legal.
- Help compact left header + `max-w-3xl` search unchanged (not the centered mock hero).
- Help hub body fills the 7xl shell: topic card (2-col tiles), Browse all questions → `/faq`, Popular Articles, Publishing | Need more side by side (`lg:grid-cols-2`).
- FAQ page inner `max-w-3xl` unchanged. Contact unchanged. Catalog unchanged.

## Verify

`npm run check`

## Next

Impl **121**

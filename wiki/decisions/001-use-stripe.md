---
title: Use Stripe for Payments
type: decision
date: 2026-07-06
tags: [payments, stripe, architecture]
---

# Use Stripe for Payments

## Status

Accepted

## Context

Product မှာ subscription + one-time payment flows လိုအပ်လာတယ်။
Payment provider ရွေးချယ်ရမယ်။

## Decision

**Stripe** ကို primary payment provider အဖြစ် သုံးမယ်။

- Stripe Checkout (hosted) — primary
- Stripe Elements (embedded) — fallback / custom UX
- Stripe Customer Portal — subscription management

## Consequences

### Positive

- PCI compliance burden offloaded to Stripe
- Excellent React SDK (`@stripe/stripe-js` + `@stripe/react-stripe-js`)
- Strong webhook story (signature verification built-in)
- Built-in tax handling, multi-currency support
- Great test mode + CLI

### Negative

- Vendor lock-in (mitigated by abstracting behind a `PaymentProvider` interface)
- Per-transaction fees
- Region availability limited in some countries

### Neutral

- Backend က Stripe API keys + webhook secret လိုမယ်
- Frontend uses publishable key only

## Alternatives considered

- **Paddle** — Rejected: less granular control over checkout UX, merchant of record model didn't fit our tax setup
- **PayPal** — Rejected: weaker subscription primitives, lower conversion on checkout
- **Lemon Squeezy** — Rejected: limited customization, no native Elements
- **Custom (Stripe-like DIY)** — Rejected: not worth the compliance + maintenance cost

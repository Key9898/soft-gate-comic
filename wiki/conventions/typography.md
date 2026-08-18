---
title: SoftGate typography
type: convention
date: 2026-08-11
tags: [typography, fonts, softgate]
impl: 12
---

# SoftGate typography

Canonical type stack and weight rules for the SoftGate Comic portal. See [ADR 003](../decisions/003-softgate-type-stack.md).

## Stack

| Role             | CSS         | Families                                                           |
| ---------------- | ----------- | ------------------------------------------------------------------ |
| Primary UI       | `font-sans` | `Inter, "Noto Sans Myanmar", system-ui, sans-serif`                |
| Mono (data only) | `font-mono` | `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace` |

Loaded in `index.html` via Google Fonts (weights 400–700). Wired in `src/index.css` `@theme` + `body { @apply font-sans }`.

## Allowed weights

| Class           | Value |
| --------------- | ----- |
| `font-normal`   | 400   |
| `font-medium`   | 500   |
| `font-semibold` | 600   |
| `font-bold`     | 700   |

**Banned:** `font-extrabold` (800), `font-black` (900).

## Sizes

Custom size token below `text-xs` (Impl 64), defined in `src/index.css` `@theme`:

| Class      | Value                                        | Use                                            |
| ---------- | -------------------------------------------- | ---------------------------------------------- |
| `text-2xs` | `0.6875rem` / `1rem` line-height (11px/16px) | Eyebrows, tiny labels (PageHeader, info pages) |

Never use `text-2xs` for body copy; it exists for uppercase-tracked micro labels only. Any other custom size must be added as a `--text-*` token first — arbitrary bracket sizes (`text-[11px]`) are banned.

## Selection / focus

- Active and inactive controls share the **same** font weight.
- Selected state uses color, background, or ring — not a heavier weight.
- Floating labels: focused and unfocused both use `font-semibold` (size/color may change).
- Keyboard focus (Impl 64): interactive chrome uses `focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none` (add `rounded-2xl` if the element has no radius; use `focus-visible:ring-white` on dark surfaces like the Footer). Never ship bare `focus:outline-none` without a visible replacement.
- Buttons: shared `Button` defaults `type="button"` — pass `type="submit"` explicitly inside forms.

## Bans

- Loading Inter without setting `--font-sans` / `body` to use it
- Serif readability toggles without a loaded serif face
- Using `font-mono` for general UI chrome (reserve for payment digits / machine IDs)

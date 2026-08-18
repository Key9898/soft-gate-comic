---
title: What NOT to Redo
type: convention
date: 2026-07-07
tags: [ui, showroom, category-tabs, rejected]
---

# What NOT to Redo

Rejected approaches from Impl Phases 6–20. Do not re-implement without explicit user approval.

| Approach                                                                | Why rejected                                                             | Phase                |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------ | -------------------- |
| Bento grid (`gap-px` + `bg-edc-slate-200` shell + `ring-0` flat cards)  | Looks like one big card with 6 products inside; perimeter corners "open" | 13, reverted 17–18   |
| `ring-1` on ProductCard perimeter                                       | Visual gaps at rounded corners with dark images; use `border` instead    | 19                   |
| Gradient fade on CategoryTabs (without arrow)                           | User wanted clickable right arrow + manual scroll                        | 14                   |
| `z-10` on CategoryTabs fixed zone                                       | Bleeds above modal; use `isolate` + `z-[1]` + dialog `z-50`              | 11                   |
| `edc-slate-900` / `zinc-900` on large dark surfaces                     | Black-wall feeling; use layered 800/700                                  | 27–32                |
| `dark:text-edc-slate-300/400/500`                                       | Tokens not in `@theme`; use `slate-*`                                    | 32                   |
| SoftGate `rounded-full` pills (CTA / search / chips)                    | Soft-Expressive: use `rounded-2xl`; circles via `.shape-circle` only     | SoftGate Impl 10     |
| SoftGate subtle control radii (`rounded-sm` / `md` / `lg`)              | Prefer `rounded-2xl` on controls; panels use `rounded-3xl`               | SoftGate Impl 10     |
| Flatten Card/Button/Input/Modal all to one px radius                    | Keep role hierarchy: control/surface `2xl`, large panel `3xl`            | SoftGate Impl 10     |
| Unwired Inter load (link without `--font-sans`)                         | Always wire `@theme --font-sans` + `body font-sans`                      | SoftGate Impl 12     |
| `font-black` / `font-extrabold` on SoftGate UI                          | Cap at `font-bold` (700); load only 400–700                              | SoftGate Impl 12     |
| Active-only heavier font weight                                         | Same weight both states; select via color/bg/ring                        | SoftGate Impl 12     |
| Serif readability toggle without loaded serif face                      | Use global sans stack only                                               | SoftGate Impl 12     |
| Gate SoftGate product motion in `prefers-reduced-motion: no-preference` | Enter/hover must play for Windows Animation-effects-off visitors         | SoftGate Impl 84, 90 |

## Correct patterns

- **Product grid:** `gap-2 lg:gap-3`, each card own `rounded-xl border`
- **Category scroll:** typographic `|` + right chevron button (`scrollCategoriesNext`)
- **Modal stacking:** `dialog.tsx` `z-50`; category bar `isolate` + `z-[1]`
- **Dark theme:** see [dark-mode-surfaces.md](dark-mode-surfaces.md)
- **SoftGate radius:** see [border-radius.md](border-radius.md) — `2xl` controls/cards, `3xl` panels, `.shape-circle` for geometry
- **SoftGate typography:** see [typography.md](typography.md) — Inter + Noto Sans Myanmar; weights 400–700; selection without weight change

## Related

- [implementation-phases.md](../architecture/implementation-phases.md)

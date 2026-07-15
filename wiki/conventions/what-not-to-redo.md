---
title: What NOT to Redo
type: convention
date: 2026-07-07
tags: [ui, showroom, category-tabs, rejected]
---

# What NOT to Redo

Rejected approaches from Impl Phases 6–20. Do not re-implement without explicit user approval.

| Approach                                                               | Why rejected                                                             | Phase              |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------ |
| Bento grid (`gap-px` + `bg-edc-slate-200` shell + `ring-0` flat cards) | Looks like one big card with 6 products inside; perimeter corners "open" | 13, reverted 17–18 |
| `ring-1` on ProductCard perimeter                                      | Visual gaps at rounded corners with dark images; use `border` instead    | 19                 |
| Gradient fade on CategoryTabs (without arrow)                          | User wanted clickable right arrow + manual scroll                        | 14                 |
| `z-10` on CategoryTabs fixed zone                                      | Bleeds above modal; use `isolate` + `z-[1]` + dialog `z-50`              | 11                 |
| `edc-slate-900` / `zinc-900` on large dark surfaces                    | Black-wall feeling; use layered 800/700                                  | 27–32              |
| `dark:text-edc-slate-300/400/500`                                      | Tokens not in `@theme`; use `slate-*`                                    | 32                 |

## Correct patterns

- **Product grid:** `gap-2 lg:gap-3`, each card own `rounded-xl border`
- **Category scroll:** typographic `|` + right chevron button (`scrollCategoriesNext`)
- **Modal stacking:** `dialog.tsx` `z-50`; category bar `isolate` + `z-[1]`
- **Dark theme:** see [dark-mode-surfaces.md](dark-mode-surfaces.md)

## Related

- [implementation-phases.md](../architecture/implementation-phases.md)

---
title: Dark Mode Surface Layers
type: convention
date: 2026-07-07
tags: [dark-mode, ui, tailwind]
---

# Dark Mode Surface Layers

Soft dark theme — **not** OLED black. Introduced in Impl Phases 27–32.

## Layer system

| Layer                  | Tailwind class             | Avoid                                     |
| ---------------------- | -------------------------- | ----------------------------------------- |
| Page canvas            | `dark:bg-edc-slate-800`    | `edc-slate-900`, `zinc-900`, `black`      |
| Panels / cards / modal | `dark:bg-edc-slate-700`    | Same as canvas                            |
| Borders / rings        | `dark:ring-edc-slate-600`  | Low-contrast same-bg rings                |
| Modal backdrop         | `dark:bg-edc-slate-800/60` | `zinc-950/50`                             |
| Primary text           | `dark:text-edc-slate-100`  | —                                         |
| Muted text             | `dark:text-slate-300`      | `dark:text-edc-slate-400` on body copy    |
| Inactive tabs/chips    | `dark:text-slate-200`      | `dark:text-edc-slate-300` (invalid token) |

## CTA buttons on dark surfaces

Do **not** use Catalyst `color="dark"` (`zinc-800`) on dark panels.

```tsx
className = '!border-transparent !bg-edc-navy !text-white dark:!bg-edc-blue dark:hover:!opacity-90'
```

## Header toolbar (Impl 32)

- Shell: `dark:bg-edc-slate-800 dark:ring-edc-slate-600`
- Theme switch checked: `dark:data-checked:bg-edc-blue`
- Language active pill: `dark:bg-edc-blue`
- Inactive label: `dark:text-slate-300`

## Related

- [edc-slate-tokens.md](edc-slate-tokens.md)
- [Implementation Phases 27–32](../architecture/implementation-phases.md)

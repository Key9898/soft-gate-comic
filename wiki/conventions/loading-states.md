---
title: Loading states (UI state stack)
type: convention
date: 2026-08-13
tags: [loading, skeleton, spinner, empty-state, a11y, softgate, impl-68]
---

# Loading states

Every async surface resolves through the UI state stack: **loading → (empty | error | ideal)**. Never conflate them (the old `isLoading || list.length === 0` HomePage guard produced an infinite spinner on legitimately empty data).

## Pattern per situation

| Situation                                                  | Pattern                                                            |
| ---------------------------------------------------------- | ------------------------------------------------------------------ |
| Content page, predictable layout (`DataContext.isLoading`) | Page skeleton mirroring the real layout                            |
| Form submit / auth action                                  | `Button isLoading` inline spinner (unchanged)                      |
| Like / bookmark / toggle                                   | Optimistic, no indicator (unchanged)                               |
| Sub-100ms resolution (ProtectedRoute auth check)           | Nothing visible — quiet `min-h-screen` shell with `aria-busy`      |
| Request resolved, zero items                               | Dedicated empty state: icon + why + CTA (never a skeleton/spinner) |

## Skeleton rules (Impl 68)

1. **Primitives** live in [src/components/Skeleton/](../../src/components/Skeleton/Skeleton.tsx): `Skeleton` (base block, `tone="light|dark"`), `SkeletonText`, `SkeletonBookCard` (`book-media` cover + title + two desc lines + category + meta — matches `CatalogBookCard`), `SkeletonSection` (wrapper with `role="status"`, `aria-busy`, `aria-label={t('a11y.loading')}`, delay guard).
2. **Mirror the real layout** — same container (`max-w-7xl px-4 …`), same grid classes, same card shape. Zero CLS when content arrives.
3. **Delay guard** — `skeleton-appear` utility (`src/index.css`): opacity 0 → fades in after 200ms. Prevents one-frame flash in mock mode; real fetches (backend mode) show the skeleton normally.
4. **Page skeletons are feature components** — `src/features/<feature>/components/<X>Skeleton.tsx`; wired only into the page's `if (isLoading)` branch. No logic changes.
5. **No spinner on top of a skeleton.** One signal only.
6. **Reduced motion** — `@media (prefers-reduced-motion: reduce)` disables `animate-pulse`/`animate-spin` globally and forces `skeleton-appear` visible (static muted blocks still read as loading).

## Empty-state rules

- Explain why it's empty + give a next action + an icon ([HomeEmptyState](../../src/features/home/components/HomeEmptyState.tsx), [LibraryEmptyState](../../src/features/library/components/LibraryEmptyState.tsx) are the references).
- Resolved state: no `aria-busy`, no pulse animation.
- Honest copy per [discovery-honesty.md](discovery-honesty.md) — reader-facing portal never fakes content.

## Parked (do not redo blindly)

- Reader per-image strip placeholders — intrinsic ratios unknown; forcing `aspect-ratio` could distort strips.
- `packages/shared` empty-data guard in `loadFromLocalStorage` — could clobber the admin sibling's legitimate cleared state.
- Route-level `lazy()`/`Suspense` code splitting — separate Impl.

## Related

- Impl note: [2026-08-13-skeleton-loading-states.md](../notes/2026-08-13-skeleton-loading-states.md)

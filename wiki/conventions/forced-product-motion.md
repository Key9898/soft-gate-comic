---
title: Forced product motion
type: convention
date: 2026-08-17
tags: [motion, a11y, reduced-motion, softgate]
impl: 90
updated: 2026-09-10
impl_updated: 208
---

# Forced product motion

SoftGate Comic **product animations we add** must play for **every visitor**, including Windows “Animation effects” off and other OS `prefers-reduced-motion: reduce` users.

This is a standing product rule, not a one-off Home-hero exception.

## Must

- Write enter / hover / sequence CSS at the root stylesheet, **not** inside `@media (prefers-reduced-motion: no-preference)`.
- Auth login/register photo curtain (`.auth-split-bg-motion` transform + `.auth-split-slide` on heroes, 0.65s) is product motion — do not `transition: none` those selectors in reduce blocks. Form panes do not slide.
- Reader `CommentsSheet` enter (bottom sheet / drawer) is product motion — do not gate it on `prefers-reduced-motion` (Impl 197).
- Reader header/footer enter and `ReaderSheet` enter are product motion — do not gate them on `prefers-reduced-motion` (Impl 199).
- Home rail radial View All (`.home-radial-slot` rotate/translate/scale, dialog/backdrop enter) is product motion — do not gate it on `prefers-reduced-motion` or `useReducedMotion` (Impl 208).
- Do **not** kill those properties in reduce blocks with `animation: none` or `transition: none` on the same selectors.
- Treat Windows reduce-motion as a common visitor, not an edge case.

## Must not

- Gate HeroBook3D enter or hover behind `no-preference`.
- Use discrete `pointer-events` keyframes with `animation-fill-mode: both` to “pause hover during enter” (`hero-book-enter-hit` stuck Home hover at `none`).
- Assume Detail hover working means Home hover works (Home-only enter classes can block hit-testing).
- Put Home enter `translate` on `.hero-book-scene` (the `perspective` node) or come-forward Z on the same node as rotate — production minify can flatten Z while straighten still plays (Impl 99).
- Treat Hero Pause/Play as autoplay-only (Impl 100). It does not gate HeroBook3D enter or hover.

## Allowed reduce-motion (not product book motion)

These may still respect `prefers-reduced-motion: reduce`:

- Hero Spotlight **autoplay off** (dots + next still work; Pause/Play hidden because autoplay is already off — Impl 100)
- Skeleton `animate-pulse` / `animate-spin` and `skeleton-appear` snap-visible
- `html { scroll-behavior: auto }`
- BookCard `.book-media` lift (grid tiles, not HeroBook3D)

## Related

- [hero-spotlight.md](hero-spotlight.md)
- [book-cover-presentation.md](book-cover-presentation.md)
- [ADR 005](../decisions/005-herobook3d-ux.md)

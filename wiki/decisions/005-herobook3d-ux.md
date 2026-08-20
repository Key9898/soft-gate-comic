---
title: HeroBook3D backdrop clip and sibling CTAs
type: decision
date: 2026-08-11
tags: [adr, book, overflow, a11y, softgate]
impl: 18
---

# ADR 005 — HeroBook3D backdrop clip and sibling CTAs

## Status

Accepted

## Context

Impl 16 HeroBook3D was clipped by section `overflow-hidden`, nested a `Link` inside `role="button"`, and closed on child blur / lacked a touch CTA path.

## Decision

1. Clip hero backdrops only; keep 3D book ancestors `overflow-visible`.
2. Cover and inner CTAs are sibling `Link`s — no interactive nesting.
3. Touch: sticky first-tap open; fine pointer: hover open + immediate cover navigation.
4. Close on focus leave via `relatedTarget` containment, not raw blur.
5. **Impl 42 addendum:** Never wrap `HeroBook3D` in Framer (or any) `transform` ancestors (`x`/`y`/`scale`). Cover/leaf/shell motion is CSS class-driven (`is-open` / `is-flipped`), not Framer `rotateY` inside the book.
6. **Impl 44 addendum:** Do not use `overflow: hidden` on `.hero-book-spread` (flattens hinge).
7. **Impl 45 addendum:** Full-motion 3D hinge only under `prefers-reduced-motion: no-preference`. Reduced motion uses opacity cross-fade — never `translateX` fake book-open. Hero wrappers sized `w-56`…`xl:w-96`.
8. **Impl 46 addendum (supersedes open UX):** HeroBook3D is a **static** closed hardcover Link. Open / hinge / fade / sticky-touch / leaf flip are retired. CSS hover lift only. Home hero row uses `lg:items-center`.
9. **Impl 48 addendum:** Home hero optical vertical mid-band via `min-h` + `justify-center` (not `100vh`). Home book wrapper may use `lg:translate-y-2` optical nudge. Detail layout unchanged.
10. **Impl 51 addendum:** Fore-edge visibility is CSS geometry only — pages sit on the right edge (`left: 100%` + `rotateY(90deg)`), not a percentage translate of the thin face width. Do not “fix” fore-edge by reopening hinge UX.
11. **Impl 52 addendum:** Do not wrap `HeroBook3D` in Framer `motion` (including opacity-only fades). Spotlight may fade copy/CTAs only. Fore-edge must use sufficient thickness (`--hero-book-thickness` ~48px) with yaw ~`-42deg` and `perspective` ~`1000px` so projected pages read as a hardcover stack, not a hairline.
12. **Impl 54 addendum:** Do **not** gate static hardcover transforms (rest pose, pages, cover/back Z) behind `prefers-reduced-motion`. That preference only gates **motion** (hover lift / transitions). Home optical nudge uses margin (`lg:mt-2`), never `translate-*` on an ancestor of the book.
13. **Impl 78 addendum:** Home book size steps down to `w-56 sm:w-64 lg:w-72 xl:w-80`. Shared thickness is **32px** (not 48px brick, not 22px hairline). Rest `rotateX(6deg)` (yaw stays `-42deg`). Contain top poke with scene `padding-top` + smaller hover `translateY(-3px)` — never `overflow: hidden` on preserve-3d ancestors. Detail width ladder unchanged.
14. **Impl 79 addendum:** Fore-edge paper grain is `repeating-linear-gradient(to right, …)` so stacked sheets read as vertical edges. Do not revert to `to bottom` (horizontal “lined paper”); `rotateY(90deg)` does not flip that axis.
15. **Impl 80 addendum:** To nudge the Home title+book pair down without changing hero `min-h`, start with margin on the **row** (keep `lg:items-center`). Do not `items-start` + large `pt-*` (raises the title, grows the band). Still never `translate-*` on a book ancestor.
16. **Impl 81 addendum:** Row `lg:mt-12` (text) + book wrapper `lg:mt-4` (book totals 64px). Do not put the same `mt` on the text column as on the book.
17. **Impl 83 addendum:** Home Spotlight may pass `className="hero-book-enter"` so the **scene** animates the individual CSS `translate` property (screen-space, ~88px on `lg+`, ~28px up below `lg`). Rest pose stays on `.hero-book { transform }`. Do not wrap the book in Framer, do not fade the scene, do not put `translate-*` on the width wrapper. Detail must not use `hero-book-enter`.
18. **Impl 84 addendum:** Home book enter is **forced** — it must not live inside `prefers-reduced-motion: no-preference`. Windows Animation effects / OS reduce-motion still get the slide. Hover lift remains gated.
19. **Impl 86 addendum:** Enter start is layout-relative, not magic rem. Pair row `.hero-spotlight-pair` is `container-type: inline-size` / `container-name: hero-pair` (never on `.hero-book-scene`). `lg+` from `calc(100% - 100cqi) 0`; below `lg` from `0 calc(-100% - 2rem)`. Axis switch is viewport 1024px. Slide copy is a plain `div` (no opacity fade) so title/deck occlude the book.
20. **Impl 88 addendum:** Hover is two-step CSS, not simultaneous tilt+lift. Rest Euler stays on `.hero-book { transform }`. Lift is individual `translate: 0 -0.75rem` on `.hero-book` (never on the scene). Hover-in: identity rotate then lift. Hover-out: drop then tilt. No `scale`.
21. **Impl 90 addendum:** Hover is **forced** like enter. Do not wrap hover/transition rules in `prefers-reduced-motion: no-preference`. Do not `transition: none` on `.hero-book` / `.hero-book-float-shadow` in reduce blocks. Do not use `hero-book-enter-hit` (`pointer-events` + `both` can stick at `none` and Home hover never fires). Product motion we add plays for every visitor, including Windows Animation effects off. See [forced-product-motion.md](../conventions/forced-product-motion.md).
22. **Impl 92 addendum:** After straighten, the second beat is **come-forward** (`translate: 0 0 2rem` on `.hero-book`), not screen-up `translate: 0 -0.75rem`. Rest identity is `translate: 0 0 0`. Still not on the scene. Still no `scale`. Hover-out reverses (drop Z, then tilt).
23. **Impl 99 addendum:** Come-forward Z and rotate must not share a node, and Home enter must not animate `translate` on `.hero-book-scene` (the `perspective` node). Markup: outer `className` / `hero-book-enter` shell → scene (hover target) → `.hero-book-motion` (Z only) around `.hero-book` (rotate only). Rest/hover Z stays in the `translate3d` family (`0.01px` → `3rem`) so production minify cannot flatten rest to 2D `translate(0)`. Decorative `aria-hidden` lives on the outer shell. Still no Framer, no `translate-*` on the width wrapper, no `hero-book-enter-hit`.

## Consequences

Banner/blur still contained; 3D rest pose can leave the layout box. Agents must not reintroduce open/hinge/fade interaction, Framer ancestors around the book (opacity or transform), Tailwind translate ancestors around the book, reduced-motion flattening of the static pose, top-heavy Home hero padding-only layouts, a full-viewport hero that slams content into the SoftGate burst logo, broken fore-edge math (`translateX(100%)` on a thickness-width face), or a thin ~22px page block that disappears under moderate yaw.

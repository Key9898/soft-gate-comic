---
title: SoftGate book cover presentation
type: convention
date: 2026-08-11
tags: [book, cover, spine, hero, softgate]
impl: 16
updated: 2026-08-17
impl_updated: 96
---

# SoftGate book cover presentation

Webtoon discovery tiles and featured covers use a **physical book metaphor**, not Soft-Expressive white cards.

## Components

| Role                   | Component                      | Path                         |
| ---------------------- | ------------------------------ | ---------------------------- |
| Grid / shelf tiles     | `BookCard` / `CatalogBookCard` | `src/components/BookCard/`   |
| Hero + detail featured | `HeroBook3D`                   | `src/components/HeroBook3D/` |

## Grid (`BookCard`)

- Whole tile is the book: **no** outer `Card` shell (`rounded-2xl` white border).
- Cover uses `.book-media` + `.book-media-shadow` (Apple-style spine gradient via `::after`).
- Title / description / genre / views / release date sit **below** the hardcover on discovery tiles (`CatalogBookCard`, Impl 96). Library keeps episode + last-read meta.
- Aspect `3/4`. Hover: slight lift + scale cover art.

## Hero (`HeroBook3D`) — Impl 16 + 18 + 42–46 + 48 + 51–52 + 54 + 78–81 + 85

- CSS `perspective` + `preserve-3d` hardcover with decorative page block + back cover.
- **Impl 46:** static closed three-quarter pose. When `href` + `ctaLabel` are passed, cover is the **only** CTA `Link`. No open / hinge / fade / leaf flip / sticky-touch.
- **Impl 85 decorative:** omit `href` (and `ctaLabel`) for a non-navigating hardcover. Scene is `aria-hidden`. Do **not** fake a link to `/` or `/about`. Impl 87 moved About off this mode onto `StoryBook`.
- **Impl 52 pose / fore-edge:** yaw `-42deg`; `perspective: 1000px`. Pages at `left: 100%` + half-thickness margin + `rotateY(90deg)`. Cover/back `translateZ` tied to thickness.
- **Impl 79 paper lines:** `.hero-book-pages` gradient is `to right` (along thickness / X) so sheet edges read **vertical** on the visible fore-edge. Do not use `to bottom` — `rotateY(90deg)` does not remap Y, so that looks like lined paper.
- **Impl 78 thickness / Home size:** `--hero-book-thickness: 32px` (was 48px). Rest `rotateX(6deg) rotateY(-42deg) rotateZ(-4deg)`. Home wrappers `w-56 sm:w-64 lg:w-72 xl:w-80`. Detail stays `w-56 sm:w-72 lg:w-80 xl:w-96`. Scene `padding-top: 2.25rem`. Still no `overflow: hidden` on 3D ancestors.
- **Impl 88 + 90 + 92 hover:** straighten to `rotateX/Y/Z(0deg)`, then come forward with `translate: 0 0 2rem` on `.hero-book` (not screen-up `0 -0.75rem`, not `translateY(-3px) scale(1.02)` on the same `transform`). Mouse-out drops Z then tilts. **Forced for every visitor** (not `no-preference`, not reduce `transition: none`). Do not reintroduce `hero-book-enter-hit`.
- **Impl 54 + 90:** Static pose + pages/back/cover Z are **always on** (presentation, not animation). Never `transform: none` or hiding pages. HeroBook3D hover/enter motion is also always on — see [forced-product-motion.md](forced-product-motion.md).
- **Impl 45 size:** Detail wrappers `w-56 sm:w-72 lg:w-80 xl:w-96` (Home stepped down in Impl 78).
- Separate `.hero-book-float-shadow` under the scene.
- **Impl 46 + 48 + 54 + 80–81 Home layout:** content row `lg:items-center`; hero shell mid-band `min-h` + `justify-center`. Home pair downward nudge = **`lg:mt-12` on the title+book row** + **`lg:mt-4` on the book width wrapper** (text 48px, book 64px). Not `translate-y-*`, not `items-start` + `pt-*`. Detail keeps `md:items-start`.

### Overflow / flatten rule (Impl 18 + 42 + 44 + 52 + 54 + 78)

Ancestor `overflow: hidden` / Framer wrappers (including opacity-only `motion.div`) flatten or mute CSS 3D. Book column wrappers = plain `div`s — **never** wrap `HeroBook3D` in Framer or Tailwind `translate-*` / `transform`. Home Spotlight may fade title/CTAs with motion; the book stays a direct child of the plain width wrapper. Home pair offset is **`lg:mt-12` on the row** plus **`lg:mt-4` on the book wrapper** (do not use the same `mt` on both columns). About clips its masthead radial wash in a dedicated `overflow-hidden` layer — **not** on the page root (Impl 85).

## Radius exception

Book media uses asymmetric hardcover corners (`3px 10px 10px 3px`), **not** Soft-Expressive `rounded-2xl`. See [border-radius.md](border-radius.md) and [ADR 004](../decisions/004-book-media-presentation.md).

## Surfaces wired

Home (hero + trending + new), Categories, Search (webtoons tab), Library grid (+ list thumbs), Webtoon detail (featured + related). About Our Story uses `StoryBook` as an episode reader with optional `coverImage` (`/about/our-story-splash.jpg` on origin) — **not** `HeroBook3D` (Impl 87–94). See [about-story-book.md](about-story-book.md).

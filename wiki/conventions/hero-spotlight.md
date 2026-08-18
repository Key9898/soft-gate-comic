---
title: Hero Spotlight carousel
type: convention
date: 2026-08-17
tags: [home, hero, carousel, softgate]
impl: 92
---

# Hero Spotlight

Home hero rotator for SoftGate Comic.

## Content

- Slides: Trending top **5** (`status !== 'draft'`, `viewCount` desc)
- Static SoftGate `/banner/banner.png` + gradient — background does **not** rotate
- Rotating layer: title, deck, Start Reading / Save, `HeroBook3D`

## Chrome

- Under CTAs, left-aligned to **Start Reading** left edge (`lg:justify-start`)
- Dots then **right arrow only** (no left arrow, no edge arrows, no bottom-center dots)
- Soft-Expressive: dots `rounded-2xl` ticks; arrow `.shape-circle` well

## Motion

- Autoplay **5s**, infinite loop
- Pause on hero hover / focus-within; resume on leave
- `prefers-reduced-motion: reduce` → autoplay off (dots + next still work)
- No dedicated Pause/Play button (pragmatic SoftGate a11y)
- Do not steal focus on auto-advance
- **Impl 52:** Never wrap `HeroBook3D` in `motion.*` (flattens CSS 3D). Book remounts via `key={current.id}` under a plain width wrapper.
- **Impl 83 + 84 + 86:** Home-only book enter is CSS `translate` on `.hero-book-scene.hero-book-enter`. **Forced for every visitor.** Pair row is named container `hero-pair`. **lg+** start is `calc(100% - 100cqi) 0` (under the title column). **Below lg** start is `0 calc(-100% - 2rem)` (under stacked copy). Axis switch is viewport `min-width: 1024px`, never `@container (min-width: 1024px)`. Title/deck/CTAs stay opaque (no Framer fade). Never Framer on the book, never `opacity < 1` on the 3D chain, never Tailwind `translate-*` on the width wrapper, never `container-type` on `.hero-book-scene`. Detail / About do not get `hero-book-enter`.
- **Impl 88 + 90 + 92:** After enter, hover/focus-within **straightens then comes forward** (`translate: 0 0 2rem` on `.hero-book`, not screen-up). **Forced for every visitor** — not inside `no-preference`, and reduce must not `transition: none` the book. No `hero-book-enter-hit` / `pointer-events` keyframes. See [forced-product-motion.md](forced-product-motion.md).

## Copy display (Impl 82)

Catalog `title` / `description` from Trending top 5 are the data source. Hero does **not** rewrite, `slice`, or `measureText` them (breaks Myanmar graphemes).

| Element | Lines                                                          | Overflow          |
| ------- | -------------------------------------------------------------- | ----------------- |
| Title   | 2 below `lg`; **1** at `lg+` (`line-clamp-2 lg:line-clamp-1`)  | Ellipsis in place |
| Deck    | **2** always (`line-clamp-2`) plus reserved height `min-h-2lh` | Ellipsis in place |

- Text column and the slide group `div` use `min-w-0` so flex `min-width: auto` cannot block clamp. Never put `min-w-0` / `overflow: hidden` on the book wrapper. Home text column is `relative z-10`; book wrapper `relative z-0` so the enter slide reads under the copy.
- Unbreakable tokens: `break-words` (`overflow-wrap: break-word`). Never `break-all`. Never mix `truncate` (`nowrap`) with `line-clamp-*` on the same heading.
- Full copy lives on webtoon detail (existing `line-clamp-3` + Read more). No Hero “Read more”, no `title=` tooltip, no `shortDeck` field.
- `min-h-2lh` is `min-height: 2lh` so EN vs `html[lang=mm] p` line-height both reserve exactly two deck lines. Do not px-lock.

## Code

`src/features/home/components/HeroSpotlight/`

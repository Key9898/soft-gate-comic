---
title: Hero Spotlight carousel
type: convention
date: 2026-08-17
tags: [home, hero, carousel, softgate]
impl: 92
updated: 2026-08-18
impl_updated: 137
---

# Hero Spotlight

Home hero rotator for SoftGate Comic.

## Content

- Slides: editorial Spotlight (`spotlight === true`, `spotlightOrder`). Cap **5**. Fallback to `viewCount` top 5 only when the catalog has **zero** spotlight flags.
- Stable **`h1`**: `home.pageHeading` (“SoftGate Comic — Myanmar webtoons”). Eyebrow `<p>` is `home.spotlightKicker` (“This week's spotlight”). Series title is a large **`h2`** (does not rotate the page heading).
- Static SoftGate `/banner/banner.png` + gradient — background does **not** rotate
- Rotating layer: title, deck, Start Reading / Save, `HeroBook3D`
- Home cover is pointer-only (`coverTabbable={false}`): a `div` that `navigate`s to the hub on click — not a `Link`, not in the tab order, not in the SR link list. Keyboard users use Start Reading. Detail keeps the cover as a tabbable `Link`. Do not wrap a Home linked book in `aria-hidden`.
- Same title may also appear in Ranking or Trending (different jobs). Do not strip Hero ids from rails.

## Chrome

- Under CTAs, left-aligned to **Start Reading** left edge (`lg:justify-start`)
- Dots, then **Pause/Play**, then **right arrow only** (no left arrow, no edge arrows, no bottom-center dots)
- Soft-Expressive: dots `rounded-2xl` ticks; Pause/Play and arrow `.shape-circle` wells

## Motion

- Autoplay **5s**, infinite loop
- Pause on hero hover / focus-within; resume on leave (`hoverPaused`)
- Dedicated **Pause/Play** is sticky (`userPaused`) — mouse leave does **not** clear it. Hidden when `prefers-reduced-motion` (autoplay already off). Does not wrap Start Reading.
- `prefers-reduced-motion: reduce` → autoplay off (dots + next still work)
- Do not steal focus on auto-advance
- **Impl 52:** Never wrap `HeroBook3D` in `motion.*` (flattens CSS 3D). Book remounts via `key={current.id}` under a plain width wrapper.
- **Impl 83 + 84 + 86 + 99:** Home-only book enter is CSS `translate` on the **`.hero-book-enter` shell** (parent of `.hero-book-scene`). **Forced for every visitor.** Do not put enter on the `perspective` node. Pair row is named container `hero-pair`. **lg+** start is `calc(100% - 100cqi) 0` (under the title column). **Below lg** start is `0 calc(-100% - 2rem)` (under stacked copy). Axis switch is viewport `min-width: 1024px`, never `@container (min-width: 1024px)`. Title/deck/CTAs stay opaque (no Framer fade). Never Framer on the book, never `opacity < 1` on the 3D chain, never Tailwind `translate-*` on the width wrapper, never `container-type` on `.hero-book-scene`. Detail / About do not get `hero-book-enter`.
- **Impl 88 + 90 + 92 + 99:** After enter, hover/focus-within **straightens then comes forward**. Rotate-only on `.hero-book`; camera-Z is `translate3d(0, 0, 3rem)` on `.hero-book-motion` (not screen-up, not Z on the same node as rotate). **Forced for every visitor** — not inside `no-preference`, and reduce must not `transition: none` the book, motion wrapper, or enter shell. No `hero-book-enter-hit` / `pointer-events` keyframes. See [forced-product-motion.md](forced-product-motion.md).

## Copy display (Impl 82)

Catalog `title` / `description` from Spotlight slides are the data source. Hero does **not** rewrite, `slice`, or `measureText` them (breaks Myanmar graphemes).

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

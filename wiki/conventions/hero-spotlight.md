---
title: Hero Spotlight carousel
type: convention
date: 2026-08-17
tags: [home, hero, carousel, softgate]
impl: 92
updated: 2026-09-22
impl_updated: 210
---

# Hero Spotlight

Home hero rotator for SoftGate Comic.

## Content

- Slides: editorial Spotlight (`spotlight === true`, `spotlightOrder`). Cap **5**. Fallback to `viewCount` top 5 only when the catalog has **zero** spotlight flags.
- Stable **`h1`**: `home.pageHeading` (“SoftGate Comic — Myanmar webtoons”). Eyebrow `<p>` is `home.spotlightKicker` (“This week's spotlight”). Series title is a large **`h2`** (does not rotate the page heading).
- Backdrop resolves per slide in three steps, in order: `keyArt` when present, rendered sharp and full-bleed with `object-position: right` so the focal point survives the crop; otherwise `coverImage` at **65% opacity** under **`blur(40px)`**, `scale-125` and centred (the scale-up keeps the filter's edge falloff outside the clipped box — `scale-110` still left ~18% edge darkening at a 352px hero height; a blurred wash has no focal point to preserve, hence centred not right); otherwise the static SoftGate `/banner/banner.png` + gradient chrome. The slide branch's scrim (`from-gray-950/50 via-gray-950/20 to-gray-950/30`) is deliberately lighter than the empty/load-fail banner's (`/70 /30 /45`): it stacks on top of a backdrop already dimmed by the opacity/blur above, and the original banner-strength scrim doubled that dimming into a near-flat slab (worst-case measured contrast across the demo catalog after the fix: 5.32:1 deck, 6.25:1 title — WCAG AA needs 4.5:1 / 3:1). Home **loading** paints that banner + `home.pageHeading` only (no series bones, no Help/Creators) — Impl 210. Empty `slides` after load keep banner + heading, then empty or unavailable copy (Impl 196 / 198).
- Empty `slides` still paint that banner chrome and the same `min-h` ladder. `h1` stays `home.pageHeading`. Catalog **success-empty**: honest unpublished deck + Help / Creators (Impl 196). Catalog **load-fail** (`unavailable`): `errors.catalogUnavailable`, no Help / Creators (Impl 198). No series title, no Start Reading / Subscribe, no `HeroBook3D`, no dots/Pause.
- Home's LCP element is the backdrop. Only the first slide is eager with `fetchpriority="high"`; slides 2–5 are `loading="lazy"`.
- Rotating layer: title, deck, Start Reading / Save, backdrop
- The whole hero is pointer-only to the hub: a `div` (`data-testid="hero-pointer-target"`) whose click handler `navigate`s to `/webtoon/:id` unless the click's `closest('a, button')` finds a control (Start Reading, Save, a pager dot, Pause/Play, the next arrow) — never a `Link`, never in the tab order, never in the SR link list. Keyboard users reach the hub through Start Reading. Detail keeps the book cover as a tabbable `Link`.
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
- Backdrop **crossfades 400ms** between slides: the outgoing image fades out under the incoming one (two layered `img`s, not a `key` swap that replaces the element). `prefers-reduced-motion: reduce` cuts this to an instant swap — no second (outgoing) layer, no transition class at all. First mount never fades, so it does not delay LCP.
- **Impl 52:** Never wrap `HeroBook3D` in `motion.*` (flattens CSS 3D). Book remounts via `key={current.id}` under a plain width wrapper.
- **Impl 182:** First-slide cover must show on SSR hard refresh. `HeroBook3D` treats `img.complete && naturalWidth > 0` as loaded — do not rely on `onLoad` alone.
- **Impl 88 + 90 + 92 + 99:** After enter, hover/focus-within **straightens then comes forward**. Rotate-only on `.hero-book`; camera-Z is `translate3d(0, 0, 3rem)` on `.hero-book-motion` (not screen-up, not Z on the same node as rotate). **Forced for every visitor** — not inside `no-preference`, and reduce must not `transition: none` the book, motion wrapper, or enter shell. No `hero-book-enter-hit` / `pointer-events` keyframes. See [forced-product-motion.md](forced-product-motion.md).

## Copy display (Impl 82)

Catalog `title` / `description` from Spotlight slides are the data source. Hero does **not** rewrite, `slice`, or `measureText` them (breaks Myanmar graphemes).

| Element | Lines                                                          | Overflow          |
| ------- | -------------------------------------------------------------- | ----------------- |
| Title   | 2 below `lg`; **1** at `lg+` (`line-clamp-2 lg:line-clamp-1`)  | Ellipsis in place |
| Deck    | **2** always (`line-clamp-2`) plus reserved height `min-h-2lh` | Ellipsis in place |

- Copy column is `lg:max-w-2xl` at `lg+` so it does not cover the backdrop's right-hand focal point (`keyArt`'s `object-position: right`).
- Text column and the slide group `div` use `min-w-0` so flex `min-width: auto` cannot block clamp. Home text column is `relative z-10`; the backdrop is `absolute inset-0`, so it stacks under the copy without needing z-index.
- Unbreakable tokens: `break-words` (`overflow-wrap: break-word`). Never `break-all`. Never mix `truncate` (`nowrap`) with `line-clamp-*` on the same heading.
- Full copy lives on webtoon detail (existing `line-clamp-3` + Read more). No Hero “Read more”, no `title=` tooltip, no `shortDeck` field.
- `min-h-2lh` is `min-height: 2lh` so EN vs `html[lang=mm] p` line-height both reserve exactly two deck lines. Do not px-lock.

## Code

`src/features/home/components/HeroSpotlight/`

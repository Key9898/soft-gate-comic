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
- Backdrop resolves per slide in three steps, in order: `keyArt` when present, rendered sharp and full-bleed with `object-position: right` so the focal point survives the crop, always at `sizes="100vw"`; otherwise `coverImage` at **65% opacity** under **`blur(40px)`**, `scale-125` and centred (the scale-up keeps the filter's edge falloff outside the clipped box — `scale-110` still left ~18% edge darkening at a 352px hero height; a blurred wash has no focal point to preserve, hence centred not right), via `coverSources()` (guarded to this branch only — see below) at a deliberately understated `sizes="192px"` (`HERO_BACKDROP_BLUR_SIZES`) since the blur/opacity treatment makes every rung in the cover variant ladder indistinguishable; otherwise the static SoftGate `/banner/banner.png` + gradient chrome. `coverSources()` must never apply to `keyArt`: it is a portrait ladder (crops 3:4, caps at 768px) built for card slots, and would centre-crop landscape key art to portrait and cap it well under a 1600px hero. The slide branch's scrim is a breakpoint pair — below `lg` a bottom-up `from-gray-950/75 via-gray-950/55 to-gray-950/30` (the copy column is centred and sits in the upper half of the hero box, so the gradient must stay strong well past its midpoint); at `lg+` a left-to-right `from-gray-950/60 via-gray-950/40 to-gray-950/40`, carrying the left-aligned copy column — both deliberately lighter than the empty/load-fail banner's (`/70 /30 /45`): they stack on top of a backdrop already dimmed by the opacity/blur above, and the original banner-strength scrim doubled that dimming into a near-flat slab. Measured by sampling only the pixels each text element's glyphs actually paint (`Range.getClientRects()` on the text node, not the container's bounding box, which the deck `<p>`'s `min-h-2lh` can pad with unpainted space) across the demo catalog and desktop widths 1024–1920px: worst-case contrast is mobile 4.79:1 deck / 6.12:1 title at 390×844 (Love in Seoul, tested across 320–390px); `lg+` 5.30:1 deck / 7.63:1 title at 1512×900 (Love in Seoul) — WCAG AA needs 4.5:1 / 3:1. The `lg+` stops were strengthened from an earlier `/50 /20 /30` after a bounding-box measurement missed a real failure (3.77–4.40:1) on "Love in Seoul"'s two-line-wrapped deck; see `.superpowers/sdd/contrast-resolution-report.md`. Home **loading** paints that banner + `home.pageHeading` only (no series bones, no Help/Creators) — Impl 210. Empty `slides` after load keep banner + heading, then empty or unavailable copy (Impl 196 / 198).
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

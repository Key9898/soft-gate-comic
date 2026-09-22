# Home hero: full-bleed key art per slide

Design for issue #39. Written 2026-09-22.

## The decision

Issue #39's first scope item is not a build, it is a spec decision: adopt the Tapas /
Webtoons pattern where the spotlight's key art fills the hero, or keep the static banner.

**Adopt it.** The background rotates with the slide, which reverses the current rule in
`wiki/conventions/hero-spotlight.md`.

Two sub-decisions were made with it, both recorded here because neither is obvious from
the issue text.

**The fallback backdrop is blurred, not sharp.** The art this pattern wants does not exist
yet - addendum 12 of `wiki/notes/2026-09-15-figma-redesign-session.md` says the Figma uses
the portrait cover cropped as a stand-in, and issue #39 lists the real thing as a content
task. Cover sources are 1024px square and `apps/portal/scripts/imageVariants.config.ts`
deliberately stops the ladder at 768 wide because "anything beyond it would be upscaling".
Stretching one across a 1600px hero is visibly soft on every desktop. Rendered at 65%
opacity under `blur(40px)` - revised from the addendum 11 ALT frame's 45% / `blur(60px)`
after that pairing, stacked with the pre-existing `HeroSpotlight` scrim, rasterized to a
near-flat dark slab with no discernible art (see "Fix: backdrop visibility" below) -
the softness is invisible and the result reads as a deliberate colour wash. Real landscape
art renders sharp through the same component with no code change.

**`HeroBook3D` leaves Home.** Copy over a scrim leaves nowhere for a 3D book, which is what
addendum 12 specifies. The Home-only enter system goes with it rather than staying as rules
that describe something nothing renders. Git history keeps the work and the Figma ALT frame
records the design.

## What changes in the convention

`wiki/conventions/hero-spotlight.md`, Content section, currently reads:

> Static SoftGate `/banner/banner.png` + gradient - background does **not** rotate.

That sentence is replaced. The rotating layer changes from _title, deck, Start Reading /
Save, `HeroBook3D`_ to _title, deck, Start Reading / Save, backdrop_.

Everything else in that file stays exactly as written: the stable `h1`, the series `h2`,
the empty / loading / load-fail chrome for Impl 196, 198 and 210, the pager order, the
autoplay and pause rules, and both copy clamps.

## Backdrop resolution

A new optional field on `Webtoon`, beside `coverImage`:

```ts
keyArt?: string
```

The backdrop resolves in three steps, in order:

1. `keyArt` when the slide has one - rendered sharp and full-bleed, `object-cover` with
   `object-position: right` so the focal point survives the crop. The blurred fallback in
   step 2 stays centred; a blurred wash has no focal point to preserve.
2. Otherwise the slide's `coverImage`, at 65% opacity under `blur(40px)` - revised from
   the 45% / `blur(60px)` addendum 11 records for its ALT frame; see "Fix: backdrop
   visibility" below for why.
3. Otherwise the existing `/banner/banner.png` chrome, unchanged.

Step 3 is what keeps the empty, loading and load-fail states identical to today. Those
states have no slide, so they never reach steps 1 or 2, and Impl 196 / 198 / 210 do not
move.

## Fix: backdrop visibility (post-launch correction)

The addendum 11 ALT frame's 45% opacity / `blur(60px)` was measured against a mock that
did not also carry `HeroSpotlight`'s pre-existing left-to-right scrim
(`from-gray-950/70 via-gray-950/30 to-gray-950/45`, originally tuned for the sharp,
full-opacity banner). Shipped together, the two stacked: `bg-gray-950` wrapper, the image
at 45% opacity, `blur(60px)`, and the scrim on top rasterized to a near-flat dark slab with
no discernible cover art, for every demo slide (none has `keyArt`, so all reach step 2).
The fix touches both halves - the image is now 65% opacity / `blur(40px)`, and the
slide-branch scrim (not the empty/load-fail state's, which still sits over the sharp
banner and needs its original strength) is softened at `lg+` (see "Fix: lg+ scrim
strength" below for the stops and the contrast re-measurement that corrected them). The
`keyArt` (sharp) branch is untouched.

## Fix: mobile scrim direction (post-launch correction)

The Layout section above always specified a bottom scrim for mobile, but the slide-branch
scrim shipped as a single left-to-right gradient at every breakpoint. Below `lg` the copy
column is centred, so it sat over the weakest middle stop of a horizontal ramp - and the
title/deck text sits in the upper half of the hero box even at that centred position
(`justify-center` centres the whole copy+CTA+dots stack, not just the two-line heading).
The fix adds a dedicated bottom-up gradient below `lg`
(`from-gray-950/75 via-gray-950/55 to-gray-950/30`, strong enough across the span where the
text actually sits, not just its lowest stop) and keeps the (separately corrected, see
below) left-to-right gradient at `lg+`. Measuring against the pixels each text element's glyphs actually paint (see "Fix: lg+
scrim strength" below) across the demo catalog and mobile widths 320-390px puts the worst
case at 4.79:1 deck-text contrast and 6.12:1 title contrast (both "Love in Seoul" at
390x844), clear of WCAG AA's 4.5:1 / 3:1 with a narrower margin than the 5.64:1/6.00:1
("Campus Life") figure this section originally reported, which came from a bounding-box
scan of the same kind that missed the `lg+` failure below.

## Fix: lg+ scrim strength (contrast re-measurement, post-launch correction)

The `lg+` stops shipped as `from-gray-950/50 via-gray-950/20 to-gray-950/30` on the strength
of a measurement that scanned each text element's full bounding box rather than the pixels
its glyphs actually paint - on the deck `<p>`, which reserves two line-heights via
`min-h-2lh` even when its text is one line, that let a blank, unpainted span stand in for
real text coverage. Re-measuring against `Range.getClientRects()` on the text node (the
actual rendered line box) surfaced a genuine failure the bounding-box scan missed: "Love in
Seoul"'s deck wraps to two lines, and the first line's end sits near the gradient's
lightest (50%) stop, over a warm, light patch of that slide's cover art - 3.77-4.40:1 deck
contrast across desktop widths 1024-1920px, under the 4.5:1 AA floor the original 5.32:1
figure claimed was cleared. The stops are now
`from-gray-950/60 via-gray-950/40 to-gray-950/40`: worst case across the demo catalog and
that width range is 5.30:1 deck-text / 7.63:1 title, both on "Love in Seoul" at 1512x900,
comfortably clear of WCAG AA's 4.5:1 / 3:1. Full methodology in
`.superpowers/sdd/contrast-resolution-report.md`.

## Fix: blurred-wash image size (post-launch correction)

The blurred `coverImage` branch used `sizes="100vw"`, which resolves to the cover variant
ladder's 768w rung for nearly every visitor - real bytes spent on pixels that then pass
through 65%-opacity `blur(40px)`, where the smaller rungs in `imageVariants.config.ts` are
indistinguishable from the largest. It now uses a fixed, deliberately-understated
`sizes="192px"` (see `HERO_BACKDROP_BLUR_SIZES` in `responsiveImage.ts`), which pins
selection to the ladder's smallest rung at 1x and keeps it off the 768w top through 2x. The
sharp `keyArt` branch keeps `sizes="100vw"`, since it genuinely wants full width.

## Images and LCP

The hero backdrop is Home's LCP element and carries `fetchpriority="high"` today, as
`HeroBanner.tsx` documents. With five rotating backdrops only the first keeps it: slide 1
is eager and high priority, slides 2 to 5 are lazy.

The blurred fallback reuses the existing cover variant ladder rather than adding a
pipeline. Real `keyArt` assets would need a third job in `imageVariants.config.ts` at
native aspect, shaped like the banner's job - that job is out of scope here and belongs
with the content task that produces the art.

## Layout

- **Desktop:** art fills the hero; a left-to-right scrim carries the copy column; focal
  point sits right, behind no text.
- **Mobile:** bottom scrim, copy over it.
- **The whole hero is pointer-only to the hub:** a `div` that navigates on click, never a
  `Link`, never in the tab order, never in the screen-reader link list. This is the pattern
  the Home cover already uses (`coverTabbable={false}`). Keyboard users reach the hub
  through Start Reading, which is how the issue's keyboard acceptance criterion is met
  without new focus handling.

## Motion

400 ms crossfade between backdrops. Under `prefers-reduced-motion: reduce` the crossfade
is cut to an instant swap - not slowed. Autoplay at 5s, hover and focus-within pause, the
sticky Pause/Play control and the no-focus-stealing rule are all unchanged.

## What is removed

- `HeroSpotlight.tsx` stops rendering `HeroBook3D`. The component itself stays: the detail
  page renders it, and its hover-straighten behaviour (Impl 88 / 90 / 92 / 99) is not
  Home-only.
- The Home-only enter system goes: the `.hero-book-enter` rules in
  `apps/portal/src/index.css`, including the `lg+` and below-`lg` axis switch.
- The Impl 83 / 84 / 86 / 99 bullets in `hero-spotlight.md`, which describe the Home enter
  and nothing else. The Impl 52 bullet stays: "never wrap `HeroBook3D` in `motion.*`"
  protects the component wherever it renders, and the detail page still renders it.
- The book assertions in `apps/portal/src/test/HeroSpotlight.test.tsx`.

`wiki/conventions/forced-product-motion.md` references the Home book enter; it is updated
in the same change so no convention describes a render that no longer happens.

## Testing

- The backdrop rotates with the slide. Any existing assertion that it does not rotate flips
  - that reversal is the point of the issue, and it should be an edit to an existing test
    rather than a new one beside a stale one.
- `keyArt` wins over `coverImage` when both are present.
- A slide with only `coverImage` renders the blurred treatment, not a sharp backdrop.
- No slides falls back to banner chrome, with the Impl 196 / 198 / 210 states unchanged.
- Slide 1 is eager with high priority; a later slide is not.
- `prefers-reduced-motion` cuts the crossfade rather than slowing it.
- The hero is not in the tab order, and Start Reading still reaches the hub.
- No `hero-book-enter` rule survives in `index.css`, and nothing on Home references it.

## Out of scope

- Producing the landscape key art. That is the content task in issue #39's scope item 2,
  and it pairs naturally with issue #34, which already covers cover artwork.
- The `imageVariants.config.ts` job for key art, which is meaningless until assets exist.
- The detail page's `HeroBook3D`, which is untouched.

## Acceptance

From the issue: the spec is updated; the hero renders per-slide art with readable copy at
both breakpoints; the keyboard path still reaches Start reading.

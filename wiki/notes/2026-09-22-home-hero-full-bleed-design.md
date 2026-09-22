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
Stretching one across a 1600px hero is visibly soft on every desktop. Rendered at 45%
opacity under `blur(60px)` - the treatment addendum 11 already records as its ALT frame -
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
2. Otherwise the slide's `coverImage`, at 45% opacity under `blur(60px)` - the opacity and
   blur addendum 11 records for its ALT frame.
3. Otherwise the existing `/banner/banner.png` chrome, unchanged.

Step 3 is what keeps the empty, loading and load-fail states identical to today. Those
states have no slide, so they never reach steps 1 or 2, and Impl 196 / 198 / 210 do not
move.

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

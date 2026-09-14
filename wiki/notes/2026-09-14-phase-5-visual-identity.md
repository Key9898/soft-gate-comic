---
title: Impl 220 — Phase 5 visual identity (scoped by owner decision)
type: note
date: 2026-09-14
tags: [typography, weight, theme, identity, portal, softgate]
impl: 220
---

# Impl 220 — Phase 5 visual identity

Phase 5 of the [UI/UX improvement plan](2026-09-14-uiux-improvement-plan.md), GitHub epic #22. Three of this phase's items were identity decisions rather than defects, so they were put to the owner before any code was written. The answers scoped the phase down to two changes and two deliberate non-changes.

## Decisions taken (owner)

| Question           | Decision                                                                                                 |
| ------------------ | -------------------------------------------------------------------------------------------------------- |
| Typeface           | **Keep Inter; fix the weight scale only.** No new webfont on the critical path, no Burmese pairing risk. |
| Hardcover metaphor | **Leave it.** Replacing it is a design commission, not a refactor.                                       |
| Dark mode          | **Document the reader as a deliberate exception.** No code change.                                       |

## Weight carries hierarchy again

Inter is the single family, so hierarchy has to come from size and weight — which only works if weight actually varies. It did not: `font-bold` 318 against `font-medium` 106, and **118 of those bolds sat on `text-xs` / `text-2xs`**, where the weight buys nothing and spends the contrast a real heading needs.

106 micro-label weights dropped to `font-semibold` across 37 files. Final distribution: `font-bold` 140, `font-semibold` 339, `font-medium` 106.

**Cover overlays keep bold at any size** — `RatingChip`, `ContentRatingBadge`, `RankMark`, the `BookCard` badge stack, `DailyDropCard`'s countdown lip and the hero overlay. That weight is fighting an image for legibility, not expressing hierarchy; relaxing it would let the label vanish into whatever cover is behind it.

Measured on Home afterwards: rail heading 24px/700 → card title 14px/600 → deck 14px/400. Three distinct steps where all three previously read bold. Recorded as [type-weight-scale](../conventions/type-weight-scale.md).

## The reader's dark mode is a scene, not a theme

[portal-light-and-i18n-defaults](../conventions/portal-light-and-i18n-defaults.md) gains a section explaining the split: a catalog is scanned in short bursts in daylight against covers that carry their own colour; a chapter is read for twenty minutes, often at night, where a bright surround sits between the reader and the art. Light-only catalog plus dark-capable reading room serves both.

It also records the consequences that were previously folklore: reader components must branch on `darkMode` for every colour including muted text (tokens are not theme-aware, the branch is); shared components rendered inside the reader take a `darkMode` prop because there is deliberately no theme context; and `dark:` utilities should not be extended to portal chrome for consistency's sake.

## The hero heading, and why #16 was rejected

Issue #16 asked to make the series title the `<h1>` and demote the site line to an eyebrow. **Not done** — [hero-spotlight](../conventions/hero-spotlight.md) is explicit: _"Stable `h1`: `home.pageHeading` … Series title is a large `h2` (does not rotate the page heading)."_ The hero is a rotating carousel; promoting the slide title to `h1` would change the document's main heading every few seconds, which is worse for assistive tech and for SEO than the thing it fixes.

There was a real defect underneath the complaint, though. The `<p>` kicker and the `<h1>` were stacked in near-identical styling — two uppercase micro-lines in a row — while the site name already sits in the nav logo directly above. That doubling is what made the actual headline look demoted. The `h1` is now `sr-only`: stable and correct for the document outline, no longer painted. `getByRole` still finds it, so the existing heading tests pass unchanged.

## Two more findings that did not survive

That makes eight across the six phases.

**"`--color-spark-*` defined and unused."** They are used — `CoinPackageCard`'s Best Value treatment and the `CoinsPage` glow, which is exactly what [brand-color-tokens](../conventions/brand-color-tokens.md) reserves them for: _"Rare heat (sale / Best Value)"_. They are absent from discovery surfaces by design; that is what "rare" means.

**"Hero heading semantics are inverted" (#16).** Covered above.

## Not done, and why

- **The Myanmar-specific visual layer.** It depended on the typeface and metaphor decisions, both of which were declined for this phase. There is nothing to build against yet.
- **Replacing the hardcover metaphor.** Owner decision. The craft is real and a half-replacement would lose it without gaining a metaphor.

## Verification

`pnpm check` green: 0 lint errors (16 pre-existing warnings), prettier clean, 776 portal + 165 API tests, both builds.

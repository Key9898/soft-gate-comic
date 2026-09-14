---
title: Impl 218 — Phase 4 discovery IA (partial; taxonomy deferred)
type: note
date: 2026-09-14
tags: [discovery, ia, catalog, errors, offline, portal, softgate]
impl: 218
---

# Impl 218 — Phase 4 discovery IA

Phase 4 of the [UI/UX improvement plan](2026-09-14-uiux-improvement-plan.md), GitHub epic #21 with issues #14 and #15. **Partial by design** — the epic's headline item is not done, and the reason is below.

## "View all" goes somewhere now (#14)

Rails are capped at `DISCOVERY_RAIL_CAP = 6`, and `HomePage` passed the _same arrays_ into `HomeRailRadialModal`. "View all" showed the reader the six items they were already looking at, one at a time, behind a modal — strictly less information than the rail behind it. Search already routed to real destinations.

Home now does the same, via `catalogHref`:

| Rail         | Destination                        |
| ------------ | ---------------------------------- |
| Popular      | `/ranking`                         |
| Updated      | `/categories?sort=recentlyUpdated` |
| New Releases | `/categories?sort=new`             |

`HomeRailRadialModal` and its test are deleted, along with the `onViewAll` prop on both rail components and the `openRail` state. `HomeRankingChart`'s View All was a `<button>`; it is a `<Link>`.

## One failed fetch is stated once (#15)

`CatalogEmptyPanel unavailable` rendered a full-height panel with the complete explanatory sentence, under every section — about eight identical restatements of one fact down the Home page, while `CatalogStatus` already owned the message and the Retry at the top.

The panel now renders a slim dashed note using a new `errors.catalogUnavailableShort`. The full `errors.catalogUnavailable` sentence stays exactly once per page, in the hero. **This is a deliberate change to the copy split recorded in [discovery-honesty](../conventions/discovery-honesty.md), [hero-spotlight](../conventions/hero-spotlight.md) and [loading-states](../conventions/loading-states.md)** — the key those docs name is still used, just once rather than eight times.

### A network error is not a deleted series

`ReaderPage` rendered `NotFoundPage variant="series"` whenever `webtoon` was missing — including when the catalog request had simply failed. It told a reader their series did not exist and sent them away from something that is still there, with `retry` already in scope and unused. New `CatalogLoadFailPage` splits the two: it names the failure, offers Retry, and offers a way back.

## Smaller items

- **The Categories count line was an `<h2>`.** "24 Webtoons · Romance" is status, not a section heading, and it broke the outline between the page `h1` and the real headings. It is a `role="status"` with `aria-live`.
- **Home's genre chips carried dead state.** `selectedGenre` was set on click, but the chips are `<Link>`s that unmount the page, so no chip could ever render as selected. The state is gone and `selected` is explicitly `false` with a note saying why.
- **Horizontal rails had no overflow signal.** The last visible chip was cut by the container edge, which reads as a rendering fault. A `rail-fade-end` mask fades the cut, applied only while the rail can still scroll.
- **Nothing told a reader they were offline.** A dropped connection surfaced through the generic catalog-error path, which reads as a server fault. `CatalogStatus` now listens for `online`/`offline`, names the state, and retries automatically when the connection returns.

## Four findings from the review that did not survive checking

This phase's source material was the least reliable of the six. Recorded so nobody acts on them later:

1. **"/faq desktop layout break — a ~425px column ending at x≈488; the page reads as half-rendered."** Measured at 1440px: the content column is **768px** (`max-w-3xl`) inside a 1280px container. `max-w-3xl` is the reading measure on _every_ info page — Press uses it 9 times, Creators 8, FAQ 3, Help 2. It is a deliberate editorial measure, not a break.

2. **"The genre rail's next-arrow overlaps the clipped chip."** Measured at 375px: the rail ends at x=307, the arrow occupies 315–359. No overlap. The real part of the finding — no signal that more content exists — is fixed above.

3. **"Six near-synonymous rails; four define themselves by what they are not."** Each rail has its own selector in `lib/catalog/discovery.ts` with real, distinct logic: `rankingWebtoons`, `trendingWebtoons`, `updatedWebtoons`, `newReleaseWebtoons`, `startHereWebtoons` (excludes hero titles, requires a free first episode) and `forYouWebtoons` (personalised from subscriptions, likes and history). They are six different questions, not six sorts of one list. The negative descriptions are the [discovery-honesty](../conventions/discovery-honesty.md) convention stating what each metric does not claim — a deliberate anti-dark-pattern choice the review itself praised elsewhere.

4. **"Ragged grid fill — Start here renders 4 cards then dead white, Updated renders 3."** That is `startHereWebtoons` excluding hero titles and requiring a free first episode, against a ten-title demo catalog. A consequence of deliberate filters and demo data volume, not a layout bug.

## Deferred: the taxonomy collapse

The epic's item 1 — collapse six rails to three — is **not done**, because finding 3 above removes its premise. Doing it would delete working personalisation and contradict a documented convention.

If the underlying reader confusion is real, the fix is at the label layer: rename so the disclaimers are not needed (for example "Most read" / "Rising this week" / "New episodes" / "New series"), keeping all six selectors. That is a copy decision with product consequences, so it is the owner's call rather than something to take unilaterally. Left open on #21.

## Verification

`pnpm check` green: 0 lint errors (16 pre-existing warnings), prettier clean, 774 portal + 161 API tests, both builds. New `src/test/Phase4Discovery.test.tsx` (4 tests).

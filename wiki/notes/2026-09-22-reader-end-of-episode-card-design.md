# Reader: in-flow end-of-episode card

Design for issue #42. Written 2026-09-22.

## Why

The reader's chapter-end is the product's peak-end moment. The redesign replaces whatever
ends the strip today with one complete card in the flow after the last panel, carrying the
reader either into the next episode or into something else worth reading.

## What is already true

Three of the issue's bullets are already satisfied in `development`, and this design does
not touch them:

- **There is no auto-advance to remove.** `autoAdvance`, `autoNext` and `auto_advance`
  appear nowhere in `apps/portal/src`. The only timers in `ReaderPage.tsx` are the
  progress-persist debounce, a one-second clock tick and the celebration timeout.
- **The Demo end-ad slot is already in place**, rendered after the last panel and before
  the card.
- **The card already carries** the rating control, the comments teaser, the creator note,
  a next-up row, the guest nudge and the report control.

## Scope

Build the missing blocks and put the card in the specified order.

| Block             | State today                           | Work                                              |
| ----------------- | ------------------------------------- | ------------------------------------------------- |
| Rating            | exists                                | none                                              |
| Reactions         | missing                               | new component and storage helpers                 |
| Next-up           | number square, no access state        | episode thumb, three access states                |
| Creator note      | exists                                | none                                              |
| Comments teaser   | exists                                | none                                              |
| Comments composer | missing                               | new, posts through the existing thread controller |
| Related           | only when the series has ended, max 6 | always when non-empty, capped at 3                |
| Guest nudge       | exists                                | none                                              |
| Back to series    | only in the end-of-series branch      | always, in the card footer                        |
| Report            | exists                                | none                                              |

Out of scope: the reader chrome, the paywall screen itself, the comments sheet, and the
ad slots.

## Block order

```
last panel
  -> Demo end-ad slot
  -> rating
  -> reactions
  -> next-up
  -> creator note
  -> comments teaser + composer
  -> related x3
  -> guest nudge
  -> Back to series + Report
```

Source: `wiki/notes/2026-09-15-figma-redesign-session.md`, Reader critique addendum. The
Figma frames (nodes 32-239 desktop, 153-15414 mobile, 33-298 locked) are the visual
authority but were unreachable while writing this, so the card's look follows the portal's
existing component patterns and dark-mode tokens.

## File shape

`ReaderCompletePortal.tsx` is 234 lines. The new blocks would carry it past 500, and
`ReaderPage.tsx` is already 1321 lines - over the repo's 800-line ceiling - so the logic
cannot move up there either. Split into `features/reader/components/complete/`:

| File                      | Responsibility                                            |
| ------------------------- | --------------------------------------------------------- |
| `ReaderCompleteCard.tsx`  | shell, block order, dark-mode tokens; no per-block logic  |
| `EpisodeReactions.tsx`    | the emoji row                                             |
| `NextUpRow.tsx`           | thumb, access state, navigation                           |
| `CompleteComments.tsx`    | existing teaser plus the new composer                     |
| `RelatedList.tsx`         | related x3                                                |
| `EndOfSeries.tsx`         | the existing `!hasNext` branch, moved as-is               |
| `ReportControl.tsx`       | the existing ask / confirm / reported states, moved as-is |
| `lib/reader/reactions.ts` | pure storage helpers, mirroring `lib/reader/gestures.ts`  |

`ReaderCompletePortal.tsx` stays as a thin re-export so `ReaderPage.tsx` and its prop
wiring do not churn in the same commit.

## Reactions

Five fixed emoji, in this order: heart-eyes, sob, joy, scream, fire. The set is a
constant in `lib/reader/reactions.ts`, not a prop, so every episode shows the same row and
the stored picks stay meaningful. Each emoji carries a translated `aria-label`; the emoji
itself is `aria-hidden`.

One pick per episode; tapping the current pick clears it. Single-pick mirrors how the
rating control already behaves and avoids inventing multi-select count arithmetic.

Storage is device-level, guests included, no API - the same family as
`softgate_episode_reports_v1`:

```
softgate_episode_reactions_v1
{ "schemaVersion": 1, "picks": { "<webtoonId>:<episodeNumber>": "<emoji>" } }
```

Counts are a deterministic seed derived from `(webtoonId, episodeNumber, emoji)`, plus one
when the reader has picked that emoji. The seed is a small string hash of those three
values folded into the range 12-480, so the numbers look plausible and never move for a
given episode. Deterministic rather than random because the reader server-renders: a
random seed would differ between the server and client passes and produce a hydration
mismatch. The row carries the `Demo` label the creator note already
uses, so the seeded numbers are not read as real engagement.

`lib/reader/reactions.ts` exports pure functions - read, pick, count - and the component
holds no storage logic.

## Next-up

The thumb uses the existing `episodeThumbSrc(episode, seriesCover)` helper at the
`aspect-[202/142] h-14` the episode sheet already uses.

When the series has no next episode the row is absent and `EndOfSeries` takes its slot in
the order - the subscribe and next-drop block that exists today, moved unchanged.

Otherwise three states, computed from the **next** episode rather than the current one:

- **Free** - plain row.
- **Wait-or-pay** with a future `freeAt` - adds the existing `readerPage.waitFreeWhen`
  line.
- **Locked** - lock icon and the coin price.

The button always navigates to `/read/:id/:n+1`. The locked branch already on that page
renders the full paywall with balance and unlock. There is no inline unlock: a second
unlock control would duplicate the paywall's balance and insufficient-coins states in a
place that has to be kept in step with it.

This needs two new props from `ReaderPage`, the next episode's locked state and the series
cover, both derived from the `isEpisodeLocked` and `isEpisodeUnlocked` pair already wired
for the episode sheet.

## Comments composer

The teaser is unchanged. The composer sits below it: a textarea, a spoiler toggle, and a
submit that calls `add(content, spoiler)` on the controller returned by
`useCommentsThread`. The teaser reads the same thread, so a posted comment appears without
further plumbing. Blank and whitespace-only submits are disabled.

The composer is auth-gated. Guests see the guest nudge that is already in the card, which
matches how commenting behaves elsewhere in the portal.

## Related

The `related` memo in `ReaderPage.tsx` keeps producing up to 6. The card slices 3 and
renders them whenever the list is non-empty, including when a next episode exists.

This contradicts `wiki/conventions/reader-chrome.md`, which currently specifies "next
episode **or** same-genre related (hub filter, max 6, hide when empty)". That convention is
updated in the same commit to say next episode **and** related x3, so the doc and the code
do not disagree.

## Testing

Tests are written before the implementation, per the repo's TDD rule.

`lib/reader/reactions.test.ts` - pure helpers:

- picking an emoji stores it under the episode key
- picking the current emoji again clears it
- the persisted payload carries `schemaVersion: 1`
- a corrupt or absent payload reads as no picks rather than throwing
- the count for a given `(webtoonId, episodeNumber, emoji)` is stable across calls

`ReaderCompleteCard.test.tsx` - rendered behaviour:

- the blocks appear in the specified DOM order
- a reaction toggles on, toggles off, and survives a remount
- next-up renders free, wait-or-pay and locked states from the next episode's access state
- next-up navigates to `/read/:id/:n+1` in every state, including locked
- the composer posts and the comment appears in the teaser
- the composer is absent for a guest, who sees the nudge
- related renders at most 3 and renders alongside a next episode
- Back to series is present whether or not a next episode exists
- the report ask / confirm / reported flow still works

The existing reader tests are the regression net and must stay green.

## Acceptance

From the issue: reaching the end of Ep. 4 shows the card in flow; next-up to a locked
episode opens the paywall; a guest sees the nudge with the register CTA.

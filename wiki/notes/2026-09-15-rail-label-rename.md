---
title: Impl 221 — Rail labels renamed so the disclaimers are unnecessary
type: note
date: 2026-09-15
tags: [discovery, copy, i18n, labels, portal, softgate]
impl: 221
---

# Impl 221 — Rail labels renamed

Closes the item left open on GitHub #21. Phase 4 declined to collapse the six discovery rails — each has its own selector and one is personalised — and proposed the alternative: rename so the negative disclaimers become unnecessary, keeping every selector. The owner chose the four labels.

## The rename

| Was          | Now                  | Deck was                                               | Deck now                                       |
| ------------ | -------------------- | ------------------------------------------------------ | ---------------------------------------------- |
| Popular      | **Most read**        | Most-read series on SoftGate Comic                     | Ranked by total reads across the catalogue.    |
| Trending Now | **Rising this week** | Titles rising this week, **not all-time reads**.       | Ranked by reads over the last seven days.      |
| Updated      | **New episodes**     | Latest published episode activity, **not new series**. | Series that published a chapter most recently. |
| New Releases | **New series**       | Newly added series, **not new episodes**.              | Titles most recently added to the catalogue.   |

Every disclaimer is gone. "New episodes" and "New series" now distinguish themselves, so neither has to say what it is not.

## Checked against the selectors first

A label that overclaims is worse than a disclaimer, so each was verified in `lib/catalog/discovery.ts` before being written:

- `rankingWebtoons` sorts by cumulative `viewCount` → **Most read** is all-time, as the deck now says.
- `trendingWebtoons` sorts by `weeklyViewCount` → **Rising this week** is genuinely week-scoped.
- `newReleaseWebtoons` sorts by `createdAt` → **New series**.
- `updatedWebtoons` sorts by `updatedAt` **and excludes the ids already in New Releases** → **New episodes**. That exclusion is exactly why the old deck had to say "not new series"; the sibling label carries it now.

## What else moved

`home.ranking` and `home.newReleases` are not rail-only keys. Renaming their values also changes:

- **Navigation** bar links — now "Most read" and "New series".
- **Categories sort menu** options, which reuse the same keys.
- **Destination tiles** on 404, Author and the Categories empty state.
- The **`/ranking` page** heading.

That breadth is the point: the nav saying "Popular" while the rail it points at says "Most read" would be worse than either name alone.

One further alignment: the **New episodes** rail's View All lands on `/categories?sort=recentlyUpdated`, whose sort control read "Recently Updated" — the same thing under two names, which is the confusion this rename exists to remove. `categories.recentlyUpdated` now reads "New episodes" too.

Untouched: **Start here**, **For You** and **Daily**. The owner named four labels and those three were not in question.

## Tests

57 assertions across 10 test files pinned the old strings — headings, links, decks, and anchored regexes like `/^new releases$/i`. Eight test _names_ also described the old labels and were renamed, so a failure still says what it means. `SortMenu.test.tsx` was deliberately skipped: its "Popular" is a local fixture label, not the i18n string.

## Verification

`pnpm check` green: 0 lint errors (16 pre-existing warnings), prettier clean, 776 portal + 175 API tests, both builds.

Live on Home: the four rails render with their new headings and decks, the nav shows "Most read" / "New series", and the Categories sort menu reads Browse / Most read / New series / New episodes / Highest Rated.

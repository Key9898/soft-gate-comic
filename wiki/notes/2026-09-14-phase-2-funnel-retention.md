---
title: Impl 217 — Phase 2 funnel and retention
type: note
date: 2026-09-14
tags: [funnel, retention, empty-states, wallet, reader, portal, softgate]
impl: 217
---

# Impl 217 — Phase 2 funnel and retention

Phase 2 of the [UI/UX improvement plan](2026-09-14-uiux-improvement-plan.md), GitHub epic #19 and issue #12.

## Empty states stop lying about why they are empty (#12)

Two surfaces claimed the wrong cause.

`LibraryPage` filtered its items by the search box, then rendered `libraryPage.noItems` — "Your library is empty" — whenever the filtered list came back empty. Search a forty-item shelf for a title you do not own and the app told you the shelf was empty. `LibraryEmptyState` now takes a `filtered` flag: the message names the query, says the titles are still there, and the CTA is **Clear search** rather than "go browse".

`NotificationsPage` rendered "You're all caught up" for any empty filtered list. Filter to Promotions with twenty unread episode alerts and it congratulated you. It now branches on whether the inbox is genuinely empty or merely filtered, with **Show all notifications** as the recovery.

Both CTAs were also the bare noun "Webtoons"; they are verbs now (`browseWebtoons`).

## The wallet is visible where it decides something

The review asked for the coin balance in the nav at every breakpoint. **I measured first, and it does not fit.**

`wiki/conventions/responsive-chrome.md` defines the nav as a measured width budget — `leftGroup + rightGroup + headroom <= row.clientWidth`, headroom strictly positive — and says jsdom cannot decide it. With an always-visible balance pill:

| Width                  | Headroom | Left group (logo) |
| ---------------------- | -------- | ----------------- |
| 375px                  | **0**    | 46px              |
| 360px                  | **0**    | 31px              |
| 360px, 4-digit balance | **0**    | **9px**           |

At 360px with a four-digit balance the wordmark was crushed from 31px to 9px, absorbing the deficit silently — exactly the failure mode the convention documents. `overflow-x: clip` hides it from `scrollWidth`, so nothing would have caught this except the measurement.

So the balance went where there is room and where it actually changes a decision:

- **The mobile menu panel**, as a value on the existing Coins row.
- **The hub's locked episode rows** — the real fix. A price alone told a reader nothing about whether they could pay it, and tapping a locked row used to enter the reader and only then reveal the paywall. Rows now read `5 Coins · you have 150`, or `· 20 short` with the chip dropping to a neutral tone when the balance will not cover it.

Measured after the change: 360px headroom back to 58px, logo back to full width.

## The end of a series is no longer one line of pink text

`readerPage.endOfSeries` was a single `<p>` followed by a Report button — the product's peak-end moment. `nextDropForSeries` and `UpcomingDropMeta` already existed and were already used on the hub.

The end card now shows the next scheduled drop with its countdown, a Subscribe control, and a way back to the series. When nothing is scheduled it says so and offers the subscription as the way to hear about it. The one-second tick only runs when a reader is actually at the end of a series that has a drop scheduled — not behind every page of every episode.

## Guests get one answer, and it names the reason

The paywall sent guests to `/login` with a generic headline while the end card offered register-first: two different answers to the same question. The paywall now follows the same `registrationOpen` rule as the end card, and both carry a `reason` through router state. Login and Register render it (`auth.reasonUnlockEpisode`), so the page says _"Create an account to unlock Episode 12 and keep your progress"_ instead of "Sign in to your account".

## Smaller items

- **The episode sheet always opened at episode 1.** The list renders ascending and marked the current row with `aria-current`, but never scrolled to it — so on a 150-episode series every open started at the beginning. It scrolls the current row to centre now. (Guarded with `?.` because jsdom has no `scrollIntoView`, which otherwise fails the test run even with every test passing.)
- **Profile edit had no discard path.** Typing into Display Name and changing your mind had no way back; the reset only ran on a `user` change. There is a Cancel now.
- **Profile status messages were always success-coloured and never cleared.** `avatarFailed` rendered in the same `primary-50`/`primary-700` treatment as "Saved". Status is typed (`info` / `error`), announced with `aria-live`, and dismissible.

## Verification

`pnpm check` green: 0 lint errors (16 pre-existing warnings), prettier clean, 769 portal + 157 API tests, both builds. New `src/test/Phase2Funnel.test.tsx` (6 tests).

Live: `/webtoon/1` locked rows read `5 Coins · you have 150`; nav headroom at 360px measured back at 58px.

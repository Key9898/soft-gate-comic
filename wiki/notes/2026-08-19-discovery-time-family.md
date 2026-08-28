---
title: Impl 154 — Daily / Updated / New Demo honesty
type: note
date: 2026-08-19
tags: [home, discovery, daily, updated, new, catalog, softgate]
impl: 154
---

# Impl 154 — Daily / Updated / New Demo honesty

Three jobs stay split. This Impl makes the 9-title Demo and copy match that split.

## Jobs (unchanged)

- Daily — unpublished `scheduledAt` episode. Yangon weekday. Not a link. Countdown to published; overdue is Publishing soon. CMS publish + `updatedAt` bump moves it off Daily.
- Updated — published episode activity (`updatedAt`). Home six-pack still excludes New-rail ids.
- New — series birth (`createdAt`). Not the next step after Daily.

Selectors are unchanged. `scheduledAt` values are unchanged. No auto-publish.

## Demo dates

New six-pack membership is still the six newest `createdAt` (Campus, Forest, Ocean, Cyber, Blood, Love). Their last published episode sits in the launch window.

Home Updated leftover is Shadow Knight, Horizon, Golden Age, with `updatedAt` **19 / 18 / 16 Aug 2026** so the rail reads as just-moved. Nine titles mean Updated stays three cards.

Published mock dates cap at **2026-08-19**. Schema **13**. Demo seed omits `uploadDay`. The field stays optional on `Webtoon` for later CMS cadence. Daily does not read it.

## Copy

EN: upcoming episode drops this weekday / latest published episode activity, not new series / newly added series, not new episodes.

MM Daily uses ရွေးထားသည့် နေ့ (selected weekday), not ဤနေ့တွင်.

## Related

- [discovery-honesty.md](../conventions/discovery-honesty.md)
- [catalog-tiles.md](../conventions/catalog-tiles.md)
- [2026-08-19-daily-drops.md](2026-08-19-daily-drops.md)
- [2026-08-19-updated-new-split.md](2026-08-19-updated-new-split.md)
- [2026-08-21-daily-skeleton-cap.md](2026-08-21-daily-skeleton-cap.md) — Impl 158 Daily skeleton cap

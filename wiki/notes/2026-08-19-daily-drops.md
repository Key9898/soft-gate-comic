---
title: Impl 153 — Daily upcoming episode drops
type: note
date: 2026-08-19
tags: [home, discovery, daily, scheduledAt, catalog, softgate]
impl: 153
---

# Impl 153 — Daily upcoming episode drops

Home Daily is an upcoming-episode board, not a WEBTOON-style weekday cadence list.

## Data

- `Episode.scheduledAt?:` ISO UTC. Daily rows are `status === 'scheduled'` with a parseable `scheduledAt`.
- Weekday is `Asia/Yangon`, not `Date.getDay()` and not `Webtoon.uploadDay`.
- One card per series **per selected weekday** (soonest that day). Same title can appear on two chips if admin scheduled two weekdays. Hub `nextDropForSeries` is the global soonest.
- Published rows leave Daily (Updated / New jobs unchanged). Timer at zero with status still `scheduled` stays as Publishing soon.
- Schema **12**. Demo seed: next unpublished episode on each ongoing title; Horizon has Monday + Friday; Shadow Knight Wednesday is overdue vs frozen now `2026-08-19T12:00:00.000Z`. Draft `episodeNumber` 99 is not a drop.

## UI

- Copy: Upcoming drops this weekday. No Demo. No View all. Empty day keeps chips.
- Cards are not links (not hub, not unpublished reader). Countdown (or Publishing soon) sits on a bottom cover lip only — not a full overlay, not the footer. Ep + title + Yangon time stay under the cover.
- Series hub shows a Next drop strip from the same helper. Unpublished routes still 404.

## Out of scope

Categories Daily sort. Live CMS. Fake 23:59. `scheduledEpisodes[]` sidecar. Cadence copy on the hub.

## Related

- [discovery-honesty.md](../conventions/discovery-honesty.md)
- [catalog-tiles.md](../conventions/catalog-tiles.md)
- [series-hub.md](../conventions/series-hub.md)

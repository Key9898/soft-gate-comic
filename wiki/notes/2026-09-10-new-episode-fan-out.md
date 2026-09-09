---
title: Impl 204 — new_episode API fan-out
type: note
date: 2026-09-10
tags: [api, notifications, library, admin, softgate]
impl: 204
---

# Impl 204 — new_episode API fan-out

Admin Express pings this API with `{ webtoonId, episodeNumber }` only. This API reads `LibrarySubscribe`, writes the cookie inbox, then reuses Impl 203 `deliverOutOfBand` for email + Web Push. HTTP portal no longer runs `syncSubscribeNotifications`. Mock still does. Next **205**.

## What shipped

- Persist: `listLibrarySubscribers(webtoonId)` on stub (bookmark map) and Prisma (`librarySubscribe.findMany`). Reuse `stampLibraryNotified`.
- Helper: `apps/api/src/notify/episode.ts` (`sub-{webtoonId}-{episodeNumber}`, frozen English message).
- Internal: `POST /api/internal/notifications/new-episode` on the existing service-token app. Catalog miss / unpublished / scheduled → **200 zeros**. No campaign row. Do not extend broadcast `type`.
- Audience: muted omit; `lastNotified >= n` omit; `newEpisode === false` → `skippedPref` (no stamp); existing inbox id stamps without resend; else insert → out-of-band → stamp.
- Portal HTTP: remove catalog-scan upsert. GET `/me` is SoT. Mock hydrate still syncs. Honesty EN/MM: new-episode may email/push when configured. `LEGAL_EFFECTIVE_DATE` stays 2026-09-10.

## Residual

Turning `newEpisode` back on in HTTP does **not** catalog-backfill. The next Admin ping notifies. JSON counts are this request only (retry can report `emailed: 0` / `pushed: 0` while persist still has one row). No inbox polling.

## Out

- Admin git; Admin Prisma `ReaderNotification`; StaffNotification merge
- Stop mock `syncSubscribeNotifications`; invert `isMockApi()`
- FCM; extra pref booleans; `ReaderNotificationCampaign` for this path

Convention: [portal-notifications-deliver.md](../conventions/portal-notifications-deliver.md), [portal-notifications-http.md](../conventions/portal-notifications-http.md). API: [softgate-api.md](../references/softgate-api.md).

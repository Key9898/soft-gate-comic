---
title: Portal notification delivery pipe
type: convention
date: 2026-09-10
updated: 2026-09-10
tags: [notifications, push, brevo, admin, softgate]
impl: 203
impl_updated: 204
---

# Portal notification delivery pipe

Admin Express fans out reader notices through **this** API. Admin Prisma must not write `ReaderNotification`. Cookie inbox routes stay Impl 191 ([portal-notifications-http.md](portal-notifications-http.md)). `new_episode` is an Admin service-token ping (Impl **204**). Mock still writes Demo in-app rows via `syncSubscribeNotifications`. HTTP must not.

## Auth

Internal routes require header `ADMIN_SERVICE_TOKEN` (same name as the env slot). Compare SHA-256 digests with `timingSafeEqual`. Unset token → every internal route 401 (boot still succeeds). A valid reader cookie or JWT **without** this header is still 401.

Prefix: `/api/internal/notifications`. Do not merge StaffNotification or Admin `/api/notifications`.

## Channels (intent time)

Three channels: in-app, email (Brevo HTML), Web Push (VAPID, not FCM).

| Kind            | In-app                                                       | Email / push                                              |
| --------------- | ------------------------------------------------------------ | --------------------------------------------------------- |
| `system`        | Always written                                               | If address exists / ≥1 subscription                       |
| `promotion`     | Skipped when `prefs.promotion === false`                     | Same pref rule                                            |
| `comment_reply` | Persist insert (Impl 197); skip self / muted                 | `deliverOutOfBand` after insert when `commentReply` is on |
| `new_episode`   | `LibrarySubscribe` fan-out on `POST /new-episode` (Impl 204) | `sendEmail` / `sendPush` true; skip channel if unset      |

Missing or partial Brevo / VAPID: skip that channel; still write inbox when in-app is allowed. Catch mail/push errors; never fail the HTTP success body because a channel skipped. Cannot unsend. No edit-in-place of a sent campaign.

Pref schema stays `{ newEpisode, commentReply, promotion }`. Profile: **one switch per row** applies to in-app + email + push. Account/security stays locked-on. No extra booleans for email vs push. HTTP Profile may offer “Enable lock-screen notices” (permission + subscribe) — not a fourth pref.

## Internal routes

Envelope `{ data }`. POST JSON Content-Type required. Errors `{ error: { code } }`.

| Method | Path           | Body                                                                                       | Notes                                                                                                                                                                                                       |
| ------ | -------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/search`      | `q` `limit` `offset` query                                                                 | `{ total, readers: { id, email, displayName }[] }`. Never `passwordHash`. Default limit 20, max 50.                                                                                                         |
| POST   | `/preview`     | `{ all: true }` or `{ userIds }`                                                           | Counts only. Prefs not applied. `withEmail` = targeted users with email (all `ReaderUser`s). `withPush` = ≥1 subscription.                                                                                  |
| POST   | `/broadcast`   | `campaignId`, `type` (`system` \| `promotion`), `titleKey`, `message`, `href?`, `audience` | Sequential fan-out. Unknown `userIds` ignored. Return `{ campaignId, inbox, emailed, pushed, skippedPref }`.                                                                                                |
| POST   | `/new-episode` | `{ webtoonId, episodeNumber }` only                                                        | Integer `episodeNumber >= 1`. Catalog via `getPublishedCatalog()` with **no** `userId`. Missing published pair → **200 zeros**. Return `{ webtoonId, episodeNumber, inbox, emailed, pushed, skippedPref }`. |

Broadcast inbox id is `campaign:${campaignId}` (unique with `userId`). If that row already exists for a user, skip that user (no second inbox, email, or push). If the campaign row exists and every targeted user already has that inbox id (or would be pref-skipped), return stored counts with no sends. Residual: crash after inbox insert and before email can miss that user's mail on retry — no job queue in 203.

### new_episode (Impl 204)

Do **not** extend broadcast `type` with `new_episode`. Do **not** use `ReaderNotificationCampaign`. Admin does not check subscribers.

Require the webtoon id **and** an episode with that `webtoonId` + `episodeNumber` and `status === 'published'`. Catalog keeps scheduled (`publishedCatalogFrom` only drops drafts). Otherwise 200 zeros — not 400. No draft/scheduled notify.

Audience is `LibrarySubscribe` for that `webtoonId`. Per-subscriber order:

1. `notifyMuted` → omit (not `skippedPref`, no stamp)
2. `lastNotifiedEpisodeNumber >= episodeNumber` → omit
3. `lastNotified == null` → eligible
4. `prefs.newEpisode === false` → `skippedPref++`, no inbox, no out-of-band, **no stamp**
5. Existing inbox id `sub-{webtoonId}-{episodeNumber}` → `inbox++`, stamp, no send
6. Else insert, `deliverOutOfBand`, stamp, `inbox++`

Frozen English: `{enTitle} — Episode {n} is ready to read.` `titleKey`: `notificationsPage.newEpisode`. `href`: `/webtoon/{webtoonId}`. `data`: `{ webtoonId, episodeNumber }`.

There is **no** campaign row. Retry is safe (one inbox, mail/push once) but JSON counts are **this request only**. A second POST may report `emailed: 0` / `pushed: 0`. Do not assert body equality with the first POST (that is 203 campaign stored-counts).

Residual: turning `newEpisode` back on in HTTP does not catalog-backfill; the next Admin ping notifies. HTTP must not run `syncSubscribeNotifications`. Mock still does.

## Cookie push siblings

Mounted **inside** the notifications Hono app (do not mount a second `/api/notifications/push` app — the inbox prefix would swallow it).

| Method | Path                                  | Auth          | Notes                                                  |
| ------ | ------------------------------------- | ------------- | ------------------------------------------------------ |
| GET    | `/api/notifications/push/vapid`       | none          | `{ data: { publicKey } }` or 503 `PUSH_NOT_CONFIGURED` |
| POST   | `/api/notifications/push/subscribe`   | reader cookie | `{ endpoint, keys: { p256dh, auth } }`                 |
| POST   | `/api/notifications/push/unsubscribe` | reader cookie | `{ endpoint }`                                         |

Portal registers `public/sw.js` only when `isMockApi() === false`. Mock: no SW, no permission prompt. Fail-open if VAPID 503. HTTP must not write `softgate_notifications_v1`. No new localStorage key for push (server `ReaderPushSubscription`).

## Env

`ADMIN_SERVICE_TOKEN`, `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` — optional, `emptyToUndef`. `isPushConfigured` = all three VAPID slots set. Never `VITE_*` for the service token. Impl 204 adds **no** new env.

## Out of 204

- Admin repo edits; Admin Prisma writes to `ReaderNotification`
- FCM; unsend; extra pref booleans; broadcast on reader `/upsert`
- Stop **mock** `syncSubscribeNotifications`; invert `isMockApi()`
- Websocket / inbox polling

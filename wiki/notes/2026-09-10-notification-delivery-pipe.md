---
title: Impl 203 — Reader notification delivery pipe
type: note
date: 2026-09-10
tags: [api, notifications, push, brevo, admin, softgate]
impl: 203
---

# Impl 203 — Reader notification delivery pipe

Admin Express fans out reader notices through website `/api/internal/notifications` (header `ADMIN_SERVICE_TOKEN`). In-app inbox, Brevo HTML, and Web Push (VAPID) share one pref switch. Cookie inbox routes stay Impl 191. `comment_reply` email+push runs after persist insert. Impl **202** is the other agent's live join smoke (already indexed). Next **204** is `new_episode` API fan-out (out of this work).

## What shipped

- Env: `ADMIN_SERVICE_TOKEN`, `VAPID_*` (optional; `emptyToUndef`). Unset service token → internal 401. Unset/partial VAPID → `PUSH_NOT_CONFIGURED`.
- Ports: `createPush`, `deliverOutOfBand` (email+push only), `deliverBroadcastUser` path via internal broadcast (inbox then out-of-band).
- Prisma reader tables: `ReaderPushSubscription`, `ReaderNotificationCampaign`. Campaign inbox id `campaign:${campaignId}`.
- Persist: `listReaders` / `listReaderIds`, push subscribe, campaigns. `deleteReaderUser` / `clearAuth` drop push rows.
- HTTP: `/api/internal/notifications` search, preview, broadcast. Push cookie routes on the notifications app (`/push/vapid|subscribe|unsubscribe`). Inbox `/me` `/upsert` `/read` `/read-all` `/delete` `/clear-read` unchanged.
- `POST /api/comments/reply` body still `{ data: { comments } }`. After persist, out-of-band to parent when `commentReply` is on.
- Portal: `public/sw.js` registered only when mock is off. Profile one switch + HTTP lock-screen enable. Cookies date 2026-09-10. Honesty: new-episode still in-app Demo.

## Honesty

- Do not claim new-episode email/push yet. Keep `subscribeNewEpisode` in-app-only until 204.
- Do not stop `syncSubscribeNotifications`.
- HTTP must not write `softgate_notifications_v1`. No new localStorage key for push.

## Out

- Admin git; Admin Prisma `ReaderNotification` writes; StaffNotification merge
- FCM; unsend; extra email/push pref booleans
- Invert `isMockApi()`

Convention: [portal-notifications-deliver.md](../conventions/portal-notifications-deliver.md), [portal-notifications-http.md](../conventions/portal-notifications-http.md), [named-integrations.md](../conventions/named-integrations.md). API: [softgate-api.md](../references/softgate-api.md).

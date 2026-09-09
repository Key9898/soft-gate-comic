---
title: Impl 197 — Complete comments (UI + shared HTTP + comment_reply)
type: note
date: 2026-09-09
tags: [comments, http, prisma, notifications, reader, ssr, softgate]
impl: 197
---

# Impl 197 — Complete comments (UI + shared HTTP + comment_reply)

WEBTOON-class comment UI plus a **shared** thread API (guest GET, auth writes), Prisma + stub persist, `comment_reply` inbox rows, and fail-open SSR comment seeds on hub/reader. Impl **196** already shipped (catalog-empty chrome); this work is **197** as mandated. Next is **198**.

## What shipped

- API `GET /api/comments?key=` (public) and cookie `POST` add/reply/edit/delete/like/report. Persist `ReaderComment` / `ReaderCommentLike`. `deleteReaderUser` strips that user’s comments, replies to them, and likes. Stub `clearAuth` clears the comments map for tests only — logout does not wipe threads.
- `addReply` notifies the parent author (`notificationsPage.commentReply`) unless self-reply or `commentReply: false`. HTTP creates the row on the API; mock uses `addNotification` then `reloadInbox`.
- Portal: `isMockApi()` still `!== 'false'`. Mock keeps `softgate_comments_v1`. HTTP does not write that key. 500-char cap. Header count, last-panel teaser, and sheet share one list (`useCommentsThread`).
- `CommentsSheet` (mobile bottom sheet / desktop drawer); last-panel teaser; sort Best/Newest/Oldest; spoiler hide/reveal; delete/report confirm; Demo sticker tray; 44px targets. Hub stays inline. Sheet enter is forced product motion.
- `render` / `renderPage` are async. Hub/read URLs fail-open `GET /api/comments` with `AbortSignal.timeout(400)` and seed via `CommentsSsrContext` + `window.__SG_COMMENTS_SSR__`. Local `pnpm dev` is still Vite SPA — use `pnpm dev:ssr` or `pnpm preview` for SSR seed.

## Verify

- `pnpm check`
- Mock: `pnpm dev` — comments persist locally; reply creates inbox when pref on
- HTTP: `pnpm dev` + `pnpm dev:api` with `VITE_USE_MOCK_API=false` — guest GET, login write, second user sees thread
- SSR seed: `pnpm dev:ssr` or `pnpm preview`

## Follow-up

Next Impl **198**. No admin moderation UI, no sticker shop, no creator pins.

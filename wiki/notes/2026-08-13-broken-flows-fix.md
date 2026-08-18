---
title: Broken flows fix — i18n keys / Comments wiring / Auth chrome
type: note
date: 2026-08-13
impl: 62
tags: [i18n, comments, auth, bugfix]
---

# Broken flows fix — i18n keys / Comments wiring / Auth chrome (Impl 62)

Deep-scan batch: three user-visible breakage groups fixed in one Impl.

## A — Missing i18n keys + dead button + FAQ honesty

- Re-pointed 2 wrong keys: CoinsPage `coinsPage.coins` → `coins.coins`; NotificationsPage delete `aria-label` `libraryPage.delete` → `common.delete`.
- Added 7 keys EN/MM: `comments.loginToComment`, `profilePage.avatarFailed`, `readerPage.insufficientCoins` (`{{balance}}`), `readerPage.read`, `webtoonDetail.linkCopied`, `webtoonDetail.notFound`, `webtoonDetail.notFoundDesc` (series-level wording — `reader.notFound` is episode-level).
- Deleted the dead "Open Wallet App Deep Link" button in CoinsPage (no onClick, hardcoded English).
- Rewrote `faq.a5` EN/MM to match `auth.passwordResetUnavailable` (no email reset; change password via Profile → Security; new demo account if locked out). Deleted unused/misleading `auth.forgotPasswordDesc`.
- Login ↔ Register cross links now forward `state={{ from }}` so the return-to path survives switching forms.

## B — Comments persistence + controlled component

- `src/lib/comments`: `StoredComment.parentId?` (additive, schema v1 kept), new `addReply` (single-level flatten: replying to a reply attaches to its top-level parent) and `updateComment` (owner-only, sets `isEdited`), `deleteComment` now cascades replies. IDs get a random suffix (`c-<ts>-<rand>`) to avoid same-millisecond collisions.
- `Comments.tsx` rewritten as a **controlled** component: no local clone of `comments`, no fabricated "You" user, no `currentUserId = '1'` default. `CommentItem` hoisted to module scope with per-item UI state → reply-input focus-loss bug gone. Ghost comment on logout gone (component renders only what the panel passes). Dead Report button removed. All strings i18n (`comments.*` EN/MM incl. plural `replyCount_one/_other`, relative-time keys). Radius convention: avatars `.shape-circle`, inputs `rounded-2xl`.
- `ReaderCommentsPanel` groups flat storage into a tree (`parentId` map, replies ascending), wires `onReply`/`onEdit`, passes `currentUserId`/`currentUserName`, and drops the `key` remount hack. Logged-out sign-in prompt redirects with `state.from`.
- Stories: `currentUserName` arg added; props shape otherwise unchanged.
- New `src/test/ReaderCommentsPanel.test.tsx` (6 cases): add/reply/edit persist across remounts, cascade delete, logged-out disabled composer, no raw i18n keys.

## C — Auth double chrome

- `AuthLayout`: brand `<h1>` → `<p>` (page heading is the only h1), invalid `text-gray-550` → `text-gray-500`.
- Login / Register / ForgotPassword / ResetPassword: removed each page's own `min-h-screen bg-gray-50` wrapper + duplicate "SoftGate Comic" brand block — layout owns centering, gradient, logo. ForgotPassword duplicate "Back to login" text link removed (Button kept).

## Verify

`npm run check` — plus targeted suites: FAQPage, LoginPage, LoginReturnFrom, useAuth, CoinsPage, NotificationsPage, ReaderCommentsPanel.

## Out of scope (deferred)

- Email-change/delete-account data migration (design decision pending)
- Read-tracking math, detail-page lock state, per-user comment likes, cross-tab sync
- Favicon (user will supply assets)

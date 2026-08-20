---
title: Series hub (webtoon detail)
type: convention
date: 2026-08-19
tags: [webtoon, detail, continue, catalog, softgate]
impl: 130
---

# Series hub

Applies to [`WebtoonDetailPage`](../../src/features/webtoon/WebtoonDetailPage.tsx) at `/webtoon/:id`.

## Read CTAs

Helpers in [`src/lib/catalog/seriesReading.ts`](../../src/lib/catalog/seriesReading.ts):

- Episode list and resume math use **published** episodes only (`status === 'published'`).
- Primary CTA: Continue (`webtoonDetail.continueReading` + episode N) when history exists and the series is not complete; otherwise Start (`webtoonDetail.startReading` → episode 1). Guests have no history → Start.
- Complete = [`isSeriesCompleteForContinue`](../../src/lib/engagement/progress.ts) with **published length**, not `webtoon.episodeCount`.
- Latest episode CTA shows only when its number differs from the primary target.
- HeroBook3D `href` and `ctaLabel` match the primary CTA.
- Copy lives under `webtoonDetail.*` — do not reuse `home.continueReading` / `library.continueReading` / `libraryPage.continueReading`.

## Browse links

- Genre pills: `findGenreByToken` → `/categories/:slug` (`slug !== 'all'`). Unknown tokens stay text.
- Tags: `/search?q={encodeURIComponent(tag)}`. Hide the row when `tags` is empty.
- Author chip: `/author/${id}` with aria `webtoonDetail.viewAuthor`.

## Lists

- Episode rows: Demo thumb `aspect-[202/142]` via `episodeThumbSrc` (first strip, else series cover). Date and views are visible at every breakpoint (no `hidden sm:block`). Premium still waiting shows coins + Demo `freeAt` (UTC). Wait-free now shows **Free now** and no lock / no coin chip. Coins-only premium (no `freeAt`) stays lock + coins.
- Related: shared genre, exclude self/draft, popularity, max 6. Heading `webtoonDetail.youMayAlsoLike` — never `home.featured`.
- Other works: same `author.id`, exclude self/draft, popularity, max 6. Hide when empty. Heading `webtoonDetail.otherWorks`. `common.viewAll` → `/author/:id`.
- Series discussion: after the episode list, before Other works / Related. `data-testid="hub-comments"`. `h2` is `webtoonDetail.comments` (Series discussion). Thread key [`seriesCommentKey`](../../src/lib/comments/comments.ts). Reuses [`CommentsThread`](../../src/components/Comments/CommentsThread.tsx). Always mounted. Not the Reader episode thread. 18+ titles stay open here.

## Stats

Show Published (`createdAt`) and Updated (`updatedAt`) via `formatCatalogDate`. Show `ContentRatingBadge` next to status. Primary secondary action is Subscribe / Subscribed (`webtoonDetail.subscribe`). When subscribed, a mute bell (`notify-mute`) sits beside it. If the series has a scheduled unpublished episode, a **Next drop** strip (`data-testid="hub-next-drop"`) shows episode number, Yangon time, and the same countdown / Publishing soon as Home Daily. It is not a link to the unpublished reader. Do not show an “updates every Wednesday” cadence line.

## Reader

Unpublished (`status !== 'published'`) episodes use the same episode 404 as a missing number.

## Related

- [discovery-honesty.md](discovery-honesty.md)
- [author-profile.md](author-profile.md)
- [continue-reading.md](continue-reading.md)
- [guest-access.md](guest-access.md)
- [content-rating.md](content-rating.md)
- [client-comments-notifications.md](client-comments-notifications.md)
- [library-bookmarks.md](library-bookmarks.md)

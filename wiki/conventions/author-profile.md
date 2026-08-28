---
title: Author profile
type: convention
date: 2026-08-19
tags: [author, profile, catalog, softgate]
impl: 135
impl_updated: 148
---

# Author profile

Applies to [`AuthorPage`](../../src/features/author/AuthorPage.tsx) at `/author/:id` (`Author.id`). There is no `/authors` index. Do not mix with [`CreatorsPage`](../../src/features/info/CreatorsPage.tsx) (`/creators` is Publish with Us).

## Page

- Missing id → [`NotFoundPage`](../../src/features/info/NotFoundPage.tsx) `variant="author"`. Same three Go here destinations as other 404s. Do not restyle 404.
- `h1` is `author.name[lang]`. Bio is `author.bio[lang]`.
- Avatar: letter circle unless `author.avatar` is set. Do not add JPEGs or bump schema for avatars. Catalog field changes (`contentRating`, `uploadDay`, `freeAt`, `scheduledAt`) moved `SHARED_DATA_SCHEMA_VERSION` to **12**. Demo seed dates + omitted `uploadDay` values landed in schema **13**. Envelope is now **14** (Impl 177 title refresh). `uploadDay?` stays on the type for CMS cadence; Daily uses `scheduledAt`.
- Series count = published catalog titles with `author.id` and `status !== 'draft'` — not `author.webtoonCount`.
- Follow: signed-in `softgate_follows_v1` (`src/lib/follows/` + `FollowsContext`). Button is Follow / Following. Guest click → `/login` `from`. Honesty line: not a public follower count.
- Omit `followerCount` UI and public sub counts (fabricated scale). No `/creators` CTA, no upload/payout.
- Works: [`CatalogBookCard`](../../src/components/BookCard/CatalogBookCard.tsx) linking to `/webtoon/:id`, `viewCount` desc, hide draft.
- Empty works: SearchAutocomplete + the three 404 destinations (copy, do not fork NotFound).
- SEO + `Person` JSON-LD via `buildPersonJsonLd` in [`jsonLd.ts`](../../src/components/SEO/jsonLd.ts).

## Incoming links

| Place                            | Target                                            |
| -------------------------------- | ------------------------------------------------- |
| Hub author chip                  | `/author/${id}` — aria `webtoonDetail.viewAuthor` |
| Hub other-works `common.viewAll` | `/author/${id}` (rail stays, max 6)               |
| Search authors tab               | `Link` to `/author/${id}`                         |
| Autocomplete author suggestion   | `/author/${id}`                                   |

Do not nest `/author/:id` inside Home Start here tiles. `CatalogBookCard` has no author link.

Tags stay `/search?q=`. Hub episode stats use published `allEpisodes.length`.

## Related

- [series-hub.md](series-hub.md)
- [discovery-honesty.md](discovery-honesty.md)
- [guest-access.md](guest-access.md)
- [in-app-search.md](in-app-search.md)

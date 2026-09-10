---
title: Discovery honesty conventions
type: convention
date: 2026-08-11
tags: [discovery, author, related, localStorage]
---

# Discovery honesty

## Author links

Author chips, Search author hits, and autocomplete author suggestions go to `/author/:id`. Aria on the hub chip is `webtoonDetail.viewAuthor` (profile), not search-by-name. There is no `/authors` index. Do not nest `/author/:id` inside Home Start here tiles.

## Related titles

Shared stored genre token (≥1), exclude self and `draft`, sort by popularity, max 6. Hide the section when empty. Heading is `webtoonDetail.youMayAlsoLike` — not `home.featured`.

## Tags

Series `tags[]` chips on the hub link to `/search?q={tag}` (same honesty as author → search). Not a tag engine.

## Author other works

Hub rail lists other published series with the same `author.id` (exclude self, popularity, max 6). Hide when empty. Heading is other works. `common.viewAll` goes to `/author/:id`. Full grid is the author profile.

## Shared mock localStorage

Key `softgate-shared-data` stores `{ schemaVersion, data }`. Current `SHARED_DATA_SCHEMA_VERSION` is **14**. Bump it in `@softgate/shared` when mock catalog data or shape must refresh stale browsers.

`loadFromLocalStorage` still schema-gates. `applyCatalogSeed` is identity (Impl **167**): a matching schema keeps the stored catalog (Admin edits, `imageSizes`). Empty stored catalogs stay empty (empty-state tests). Demo first-run still uses mocks when the key is missing or the schema does not match. Leftover 2023 dates in a matching-schema blob: clear `softgate-shared-data` once, or bump schema when the mock seed itself must replace browsers.

Catalog titles follow cover lettering (do not edit cover PNGs to match the database). Discovery tiles: [catalog-tiles.md](catalog-tiles.md). Home discovery jobs live in [`src/lib/catalog/discovery.ts`](../../src/lib/catalog/discovery.ts) plus Daily in [`src/lib/catalog/dailyDrops.ts`](../../src/lib/catalog/dailyDrops.ts):

- Spotlight — `spotlight` / `spotlightOrder` (Hero)
- Start here — Home only when Continue is empty; published series with a free published episode 1, Hero ids excluded, sort `viewCount`, cap 6. Cards go to `/read/:id/1`. Not a Categories sort. Does not strip Popular ids.
- Ranking — lifetime `viewCount`
- Trending — `weeklyViewCount` (missing sorts as 0)
- For You — signed-in only; Subscribe, then likes, then history, then same-genre neighbors by stable `id`. Never `viewCount` / `weeklyViewCount`. Hide when empty. Continue-rail ids excluded. No View all.
- Daily — Home only. Unpublished `status === 'scheduled'` episodes with `scheduledAt`. Weekday is `Asia/Yangon`. One card per series per selected day (soonest that day). Sort `scheduledAt` asc, cap 6. No View all. Cards are not links. Countdown on the cover bottom lip; episode + Yangon time under the cover. Leave Daily only when published. Overdue stays Publishing soon. Hub Next drop is the global soonest scheduled episode. Do not use `uploadDay` or `Date.getDay()`. Do not strip Daily ids from Updated / Ranking / Trending. Copy: Upcoming episode drops this weekday. `uploadDay?` stays on the type for CMS cadence; Demo seed omits it. Home **loading** paints seven live weekday labels + a `CatalogBusyPanel` well (no lip-card bones). Empty after load is `CatalogEmptyPanel`. See [loading-states.md](loading-states.md) (Impl 210).
- Updated — `updatedAt` (Home six-pack excludes New-rail ids). Not the Daily board. Demo leftover is older series with later `updatedAt` than the New six-pack launch windows.
- New — `createdAt` top 6. Series birth, not new episodes.

Do not derive Trending from `viewCount`. Do not strip Hero ids from Ranking / Trending / Updated / New. Start here **does** strip Hero ids so the guest start pack is not the spotlight carousel. Home Updated may strip New-rail ids so the return-loop jobs do not share titles.

Empty catalog (`!error` and `webtoons.length === 0` after a successful load) is **empty chrome**, not seed. Keep Home / Categories / Search layout; fill module bodies with `CatalogEmptyPanel`. Do not invent covers or HeroBook3D slides. Do not use “matching your criteria” / “no results for `{query}`” as if a title library exists. Filter or query misses while titles exist stay those no-match recoveries. For You stays hidden when its list is empty. See [loading-states.md](loading-states.md) (Impl 196).

Catalog **load-fail** (`error` and zero titles) is not unpublished. Use `errors.catalogUnavailable` in-page and `errors.catalogLoad` on the banner. Help/Creators stay success-empty only. Do not fall back to seed. See Impl 198.

Empty `/search` **Demo searches** are a frozen chip list in [`src/lib/search/demoSearches.ts`](../../src/lib/search/demoSearches.ts). Do not fill them from `weeklyViewCount`. Do not label them Trending Searches. Browse genres stays a separate catalog job.

Author Follow is `softgate_follows_v1` per signed-in user. Do not show `author.followerCount` as a live public count. Do not mix Follow with series Subscribe (`softgate_library_v1`). For You does not use author follows yet.

Home Popular chrome is an ordered 6-up grid (Impl 119 layout; rank **glyph** Impl 124; white **lip** Impl 127). Rank numbers exist on `/ranking` and on `/categories/:slug?sort=popular`. `/categories` Browse has no ranks. Home Popular / Updated / New **View All** open a shared radial-cards dialog of that rail’s six-pack (Impl 208); they do not navigate to `/ranking` or Categories sorts. Header/nav `/ranking` and `/categories?sort=new` stay. Search landing View All stays those links. Trending has no View All (no weekly Categories sort).

## Home Save CTA

Impl 15 removed a dead Home “Add to Library” button. Impl 25 restores a secondary Save CTA wired to the real bookmarks store (see [library-bookmarks.md](library-bookmarks.md)).

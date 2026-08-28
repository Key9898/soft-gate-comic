---
title: Categories browse (genre + status)
type: convention
date: 2026-08-11
tags: [categories, genres, softgate]
impl_updated: 169
---

# Categories browse

## Genre matching

Never filter with `genre.name[lang]` alone. Use [`src/lib/categories/matchGenre.ts`](../../src/lib/categories/matchGenre.ts):

- Match if any `webtoon.genres[]` equals the genre’s `name.mm`, `name.en`, or `slug` (case-insensitive).
- Mock catalog stores **Myanmar** labels aligned to `Genre.name.mm`.
- Cards resolve display language via `resolveGenreLabel`.

## URL

Canonicalize in [`src/lib/catalog/browseUrls.ts`](../../src/lib/catalog/browseUrls.ts) (`replace: true`). Job builders: `catalogHref`.

| Form                                       | Meaning                                                                                                          |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `/categories`                              | All-genre Browse (`viewCount` order, **no ranks**). Dropdown selected **Browse**.                                |
| `/categories/:slug`                        | Genre browse (preferred deep link). Home chips use this; `all` → `/categories`.                                  |
| `/categories?genre=:slug`                  | Accepted then rewritten onto the path.                                                                           |
| `/ranking`                                 | All-genre numbered Popular. Never carries `sort=popular`.                                                        |
| `/categories/:slug?sort=popular`           | Genre numbered chart. Do not send this to `/ranking`.                                                            |
| `/categories?sort=popular`                 | Rewritten to `/ranking`.                                                                                         |
| `?sort=new\|recentlyUpdated\|highestRated` | Sort on `/categories` or `/categories/:slug`.                                                                    |
| `?status=ongoing\|completed\|hiatus`       | Status chip. Omitted from canonical.                                                                             |
| `?page=`                                   | Only when filtered count **> 24**. `page=1` / junk dropped. Invalid high page clamps after list length is known. |

Nav: Categories `/categories`, Popular `/ranking`, New `/categories?sort=new`. `isActive` uses the `/categories` prefix so `/categories/action` highlights Categories; `sort=popular` or `/ranking` highlights Popular; `sort=new` highlights New. `aria-current="page"` on the active link.

`h1` is the sort job when `/ranking` or `?sort=` is set; otherwise the genre name (or Browse by Genre). Deck under `h1` uses Home honesty keys (Browse / Highest Rated have Categories keys). SEO description matches the deck. Canonical is path + `sort` on `/categories` jobs; `/ranking` has no `sort`; include `page` only when the pager shows and page > 1. Ranked views emit `ItemList` JSON-LD for the **current page** rows.

Unknown `:slug` (not in the genre list, not `all`) renders genre 404. Valid genre + filters with zero rows keep Search + Go here (`/categories`, `/ranking`, `/categories?sort=new`) + Clear filters → `/categories`.

Ranks: `/ranking` or `?sort=popular` only. Cap 100 then paginate (`PAGE_SIZE` 24). Rank index continues across pages. Dropdown Popular uses `home.ranking`. Icon `ListOrdered`. Completed/Hiatus move to cover bottom-right while ranked. `?sort=recentlyUpdated` tiles print `updatedAt`. Home Updated six-pack excludes New-rail ids; this list does not.

Genre/status chips: `aria-pressed`. Sort: `aria-haspopup="menu"`, `aria-expanded`, Escape closes. Public browse excludes `draft`. Host: `/ranking` must be in `SPA_REWRITE_SOURCES` + `vercel.json`. ADR: [006-ranking-path.md](../decisions/006-ranking-path.md).

## Search, SEO, count, empty (Impl 132 + 141 + 143)

Catalog search lives in **nav** (autocomplete / icon). Categories has **no** header search field. Empty grids (valid genre + filters, zero rows) still show `SearchAutocomplete` + Go here (`/categories`, `/ranking`, `/categories?sort=new`) + Clear filters → `/categories`. Genre 404 keeps NotFound search.

The count line is `{n} Webtoons`, plus ` · {genre}` when the genre is not all, plus ` · {status}` when status is not all. `n` is the full filtered (and Popular-capped) count, not the page size.

## Chart chrome (Impl 143)

Ranked views (`/ranking` and `?sort=popular`) use an `<ol className="list-none">` grid (same RankMark-on-cover as Home Popular — **no** podium). Browse / New / Updated / Rated stay a `<div>` grid. Popular masthead adds `categories.rankingEyebrow` plus `radial-wash-primary` at `inset-0` on the masthead only (not the 450px info-page wash).

Catalog `isLoading` skeleton mirrors that chart wash and sticky filters: status + sort stay live; genre names are **8** reserved bones plus an inert right chevron slot (`genre-rail-chevron-slot`); no working Show more genres button; count is reserved; 24 cards and `rankOnPage` unchanged. Unknown genre slug does not paint Browse by Genre as h1. Empty Search / Go here stays post-load only.

`h1` + deck scroll away. Genre + status + count/sort stick below the nav via `@utility sticky-below-nav` (`top: calc(4rem + safe-area)`, `z-index: 30`). That band is a **sibling** of the results section, not a child of the masthead. Sort menu `z-50` stays inside the `z-30` stacking context so it cannot cover nav `z-40`.

Genre/status/chevron chips are `min-h-11`. Genre chips do **not** use `uppercase` (Myanmar labels). Completed/Hiatus cover badges, the sort closed-button, and “Go here” keep `uppercase`.

## Genre filter row chrome (Impl 24 + 26 + 43 + 143 + 169)

On `/categories`, `/categories/:slug`, `/ranking`, Home `Genres:` strip (Impl 43), **and** Search landing browse-genres (Impl 169):

- Genre pills stay on **one horizontal row** (`flex-nowrap` + `overflow-x-auto`).
- Native scrollbar is **hidden** via `scrollbar-hide`.
- The right chevron **slot** is always reserved (`GenreRailChevron`). The Show more genres button paints only when `canScrollRight`. Do not mount/unmount the control.
- Home keeps a fixed `Genres:` label outside the scroll rail; Categories has no label.
- On Categories, status chips remain a separate wrap row below and share genre **size** metrics (`min-h-11 px-4.5 py-2.5`, `rounded-2xl`). Home and Search landing chevron stay `min-h-[38px]`.
- Home Continue rail is **not** this pattern (still conditional). Search hasQuery genre chips stay wrap, no this slot.

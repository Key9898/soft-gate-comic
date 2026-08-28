---
title: Content rating and 18+ read gate
type: convention
date: 2026-08-19
tags: [content-rating, age-gate, catalog, reader, softgate]
impl: 140
---

# Content rating and 18+ read gate

Every catalog series has required `Webtoon.contentRating`: `all | 13 | 16 | 18`. Badges show on [CatalogBookCard](../../src/components/BookCard/CatalogBookCard.tsx) (top-right under the community rating chip) and the series hub. 13 and 16 are informational only.

## Read gate

Only `18` blocks `/read/:webtoonId/:episodeNumber`. The hub, tiles, and Subscribe stay open. There is no site-wide interstitial. Reader is the choke point so Start here `/read/:id/1` and typed URLs cannot skip it.

While the gate is open: do not mount the strip, do not `recordHistory`, do not show premium unlock. Confirm then existing premium/guest unlock runs. Dismiss navigates to `/webtoon/:id`.

## Storage (A + C)

- Signed-in: `softgate_age_confirm_v1` `{ schemaVersion: 1, byUserId }` — one flag for **all** 18+ titles.
- Guest: `softgate_age_confirm_session` in **sessionStorage** (`'1'`). Tab close forgets. Not localStorage.
- Login/register calls `promoteSessionAgeConfirm(userId)` so a same-sitting guest confirm becomes the account flag. Logout does not clear the account flag.

Helpers: [`src/lib/contentRating/`](../../src/lib/contentRating/). Do not mix with star [`src/lib/rating/`](../../src/lib/rating/).

Demo self-confirm is not NICE/IPin. Cookies and Terms Eligibility say so. Account floor stays 13+.

## Catalog

`SHARED_DATA_SCHEMA_VERSION` **14**. Blood Moon (`id: 7`) is the 18+ Demo title.

## Related

- [library-bookmarks.md](library-bookmarks.md)
- [guest-access.md](guest-access.md)
- [legal-pages.md](legal-pages.md)
- [series-hub.md](series-hub.md)

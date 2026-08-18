---
title: Discovery honesty conventions
type: convention
date: 2026-08-11
tags: [discovery, author, related, localStorage]
---

# Discovery honesty

## Author links

Until an Author page ships, author chips link to Search works-by-author:

`/search?q={authorName}&tab=webtoons`

Use an aria-label that says “search titles by …”, not “profile”.

## Related titles

Shared stored genre token (≥1), exclude self and `draft`, sort by popularity, max 6. Hide the section when empty.

## Shared mock localStorage

Key `softgate-shared-data` stores `{ schemaVersion, data }`. Current `SHARED_DATA_SCHEMA_VERSION` is **7**. Bump it in `@softgate/shared` when mock catalog data or shape must refresh stale browsers.

`loadFromLocalStorage` also runs `applyCatalogSeed`: if stored webtoons exist, series/episodes/authors/genres are replaced with the current mock. Schema match alone cannot freeze 2023 titles or dates after a seed edit. Empty stored catalogs stay empty (empty-state tests).

Catalog titles follow cover lettering (do not edit cover PNGs to match the database). Discovery tiles: [catalog-tiles.md](catalog-tiles.md). New = top 6 published by `createdAt`.

## Home Save CTA

Impl 15 removed a dead Home “Add to Library” button. Impl 25 restores a secondary Save CTA wired to the real bookmarks store (see [library-bookmarks.md](library-bookmarks.md)).

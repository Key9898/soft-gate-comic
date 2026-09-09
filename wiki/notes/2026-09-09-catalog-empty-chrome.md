---
title: Impl 196 — Honest catalog-empty chrome
type: note
date: 2026-09-09
tags: [portal, catalog, empty-state, home, search, categories, softgate]
impl: 196
---

# Impl 196 — Honest catalog-empty chrome

When catalog **succeeds** with `webtoons.length === 0` (mock empty blob or HTTP Prisma with no published titles), Home / Categories / Search still look like SoftGate Comic. Live headings stay. Designed empty panels sit in the module bodies. No seed titles, no fake covers, no skeleton pulse, no full-page Refresh card.

## What shipped

- [`CatalogEmptyPanel`](../../apps/portal/src/components/CatalogEmptyPanel/CatalogEmptyPanel.tsx) — `rounded-3xl` panel, BookOpen well, title/deck, optional Help (`/help`) + Creators (`/creators`) using `footer.help` / `footer.creators`.
- Home: removed full-page `HomeEmptyState`. Empty Hero still paints `/banner/banner.png` + `home.pageHeading` + Help/Creators (no 3D book, no Start Reading). Rails / ranking / Daily keep headings; View all omitted when empty; For You still hidden when its list is empty.
- Daily two copy paths: catalog empty uses the panel (no Help/Creators — Hero already has them); weekday with no drop keeps `home.dailyEmpty` only.
- Categories / Ranking: catalog empty (`webtoons.length === 0`) uses `categories.catalogEmpty` + Help/Creators. Filter empty (`webtoons.length > 0` but no matches) keeps `categories.noWebtoons` + SearchAutocomplete + Go here.
- Search landing: one Help/Creators panel when the catalog is empty; Popular/New rails stay quiet. Query misses with a live library stay dashed no-results; query with zero published titles uses `search.catalogEmpty`.

## Honesty

- Empty success is not a fetch failure. Retry stays on `CatalogStatus`. Refresh is not the empty-success CTA.
- Do not fall back to `@softgate/shared` seed or invent HeroBook3D slides.
- Help/Creators are not repeated on every Home/Search rail.

## Out

- Mock flag invert / Vercel `VITE_USE_MOCK_API=false`
- Admin merge, Prisma catalog CREATE, settings CMS, `coinPackages`
- Library tab empty, hub/Reader/Author 404 rewrite

Convention: [loading-states.md](../conventions/loading-states.md), [hero-spotlight.md](../conventions/hero-spotlight.md), [discovery-honesty.md](../conventions/discovery-honesty.md).

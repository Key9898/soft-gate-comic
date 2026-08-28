---
title: Perfect SEO — Vite SSR/hybrid + hreflang + dynamic sitemap + OG images
date: 2026-08-25
type: note
impl: 178
tags: [seo, ssr, hreflang, sitemap, og, softgate]
---

# Perfect SEO — SSR/hybrid batch (Impl 178–181)

Public portal moved from pure CSR to Vite-native SSR/hybrid (option B). Series hub is the indexable unit; reader pages are `noindex, follow`. EN at `/`, Myanmar at `/mm/`, full hreflang. Stack unchanged: Vite 6 + React Router 6 (no framework migration).

## Impl 178 — SSR infrastructure (Phases A+B)

- SSR-safety: `lib/i18n` guards `document`; `DataContext` initial state is the deterministic mock seed, localStorage override moved into an effect (`storageReady` gate); `CommentsThread` reads storage in effect; `HeroSpotlight` reduced-motion initializer defaults `false`, synced in effect.
- Entry split: `src/entry-client.tsx` (`hydrateRoot`, syncs i18n to URL locale before hydration) + `src/entry-server.tsx` (`render`/`renderPage` with `StaticRouter`, `HelmetProvider`, per-request `i18n.cloneInstance`, `SsrResponseContext` for real 404 status).
- `index.html` → `<!--app-head-->` / `<!--app-html-->` placeholders; Helmet is the single source of head truth.
- Servers: `server/dev.ts` (Vite middleware mode, also serves dynamic `/sitemap.xml`) and `server/index.ts` (Hono prod preview over `dist/client` + `dist/server`).
- Vercel: `api/ssr.ts` serverless entry; `vercel.json` builds client + SSR bundles, rewrites public + `/mm` routes to `/api/ssr`; `prepareSsrClientDist` renames `index.html` → `template.html` so static serving never shadows SSR.
- Tests: `SsrRenderSmoke.test.tsx` (node env) renders every public route via `renderToString` — status, content, meta assertions.

## Impl 179 — Server meta + JSON-LD + dynamic sitemap (Phases C+D+E)

- `SEO.tsx`: explicit `path`-derived canonical (no `window.location` fallback); reader pages `noindex, follow` + no JSON-LD.
- JSON-LD: `ComicSeries` (author Person, genres, inLanguage, aggregateRating from real catalog fields) + `BreadcrumbList` on hub/category/author; `WebSite` + `SearchAction` + `Organization` on home. `Book`/`Article` builders removed.
- Sitemap: `lib/seo/sitemap.ts` builds entries from the shared catalog (published webtoons with `lastmod` + cover `image:image`, authors, categories, static pages) and emits `xhtml:link` hreflang alternates. Build step `scripts/generate-sitemap.ts` writes `dist/client/sitemap.xml`; dev server serves it live. Static `public/sitemap.xml` deleted.
- `robots.txt`: disallow `/read/`, private and auth paths for both `/` and `/mm/`.

## Impl 180 — /mm locale + hreflang (Phase F)

- `lib/locale/`: `localeFromPathname`, `stripLocalePrefix`, `localizePath`, `routerBasename`, `htmlLangFor`, `OG_LOCALE`, `HREFLANG`; `LocaleProvider`.
- Router mounts with `basename` (`/` EN, `/mm` MM); URL prefix is the language source of truth on public pages; no Accept-Language redirect.
- `SEO.tsx` emits self-referencing canonical + `hreflang` `en` / `my` / `x-default` + `og:locale` `en_US` / `my_MM`; server sets `<html lang>` (`my` BCP47 for MM).
- `LanguageSwitcher` navigates to the alternate-locale URL (full reload); `i18nextLng` persists for private pages.

## Impl 181 — OG image generation (Phase G)

- `scripts/generate-og-images.ts` (sharp): 1200x630 per published series — blurred cover background + brand gradient overlay + rounded cover + SoftGate logo → `public/og/<id>.png` (9 generated).
- `lib/seo/ogImage.ts` `ogImageForWebtoon` maps local covers to `/og/<id>.png`; `WebtoonDetailPage` uses it. Other pages keep the banner/logo fallback.

## Verify

`pnpm check` green (portal 617 + api 39 tests, builds pass). Manual: Rich Results Test + Lighthouse SEO on Vercel preview.

## Conventions

New: [portal-seo-ssr.md](../conventions/portal-seo-ssr.md). Updated: [portal-seo.md](../conventions/portal-seo.md).

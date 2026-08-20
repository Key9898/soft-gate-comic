---
title: Portal SEO (SoftGate Comic)
type: convention
date: 2026-08-10
tags: [seo, meta, softgate]
---

# Portal SEO

Use [`src/components/SEO/SEO.tsx`](../../src/components/SEO/SEO.tsx) on every SoftGate Comic route.

## Rules

- Public pages: indexable title/description/canonical/OG/Twitter + JSON-LD when useful
- Private/auth pages (`/login`, `/register`, `/forgot-password`, `/reset-password`, `/library`, `/coins`, `/profile`, `/notifications`, …): `noindex`. Auth pages also omit JSON-LD, canonical, keywords, and social tags.
- 404 recovery: `noindex`; omit JSON-LD, canonical, keywords, `og:image`, and Twitter tags (`omitJsonLd` / `omitCanonical` / `omitKeywords` / `omitSocial` on `SEO`). Do not add 404 URLs to `sitemap.xml`. Never redirect unknown URLs to `/`.
- Host (Vercel): known SPA paths in [`src/lib/host/spaRewrites.ts`](../../src/lib/host/spaRewrites.ts) rewrite to `/index.html` (**200**). Unmatched path shapes serve post-build `dist/404.html` (copy of `index.html`) with **HTTP 404**; React still paints the recovery page. Catalog id misses (`/webtoon/:id`, `/author/:id`, `/read/:webtoonId/:episodeNumber`) and unknown `/categories/:slug` stay **200** + React recovery — no catalog server. `/ranking` must be on that rewrite list (Impl 141). Never add a catch-all `"source": "/(.*)"` rewrite (that 200s junk URLs). A new [`src/App.tsx`](../../src/App.tsx) route must be added to `SPA_REWRITE_SOURCES` and [`vercel.json`](../../vercel.json) or production refresh 404s that page. `npm run dev` stays 200 for junk URLs.
- Theme color / brand chrome: SoftGate primary `#0e9494`
- OG fallback image: `/logo/logo.png` (crawler-friendly); in-app logo mark may be SVG. Favicon: `/favicon/favicon.svg` plus PNG 32 / apple-touch 180.
- Static discovery: [`public/robots.txt`](../../public/robots.txt), [`public/sitemap.xml`](../../public/sitemap.xml) — public URLs only. Sitemap includes `/ranking`, `/categories?sort=new`, and genre paths (not `all`). Categories canonical may include `?sort=` for sort jobs; `/ranking` canonical has no `sort`. Ranked catalog emits `ItemList` JSON-LD (`buildItemListJsonLd`).

## Follow-up (needs SoftGate backend)

- Dynamic sitemaps from live catalog
- Share-landing HTML for social crawlers
- Generated OG images

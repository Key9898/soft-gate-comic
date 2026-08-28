---
title: Portal SEO (SoftGate Comic)
type: convention
date: 2026-08-10
tags: [seo, meta, softgate]
---

# Portal SEO

Use [`apps/portal/src/components/SEO/SEO.tsx`](../../apps/portal/src/components/SEO/SEO.tsx) on every SoftGate Comic route.

Since Impl 178–181 public routes are **server-rendered** — hosting, canonical/hreflang, JSON-LD, dynamic sitemap, and OG image rules moved to [portal-seo-ssr.md](portal-seo-ssr.md). That file wins on any conflict.

## Rules

- Public pages: indexable title/description/canonical/OG/Twitter + JSON-LD when useful. Canonical comes from an explicit `path` prop (`localizePath`) — never `window.location`.
- Reader `/read/...`: `noindex, follow`, no JSON-LD (series hub `/webtoon/:id` is the indexable unit).
- Private/auth pages (`/login`, `/register`, `/forgot-password`, `/reset-password`, `/library`, `/coins`, `/profile`, `/notifications`, …): `noindex`. Auth pages also omit JSON-LD, canonical, keywords, and social tags.
- 404 recovery: `noindex`; omit JSON-LD, canonical, keywords, `og:image`, and Twitter tags (`omitJsonLd` / `omitCanonical` / `omitKeywords` / `omitSocial` on `SEO`). NotFoundPage sets a real HTTP 404 via `useSsrResponse`. Do not add 404 URLs to the sitemap. Never redirect unknown URLs to `/`.
- Host (Vercel): public + `/mm` routes in [`apps/portal/src/lib/host/spaRewrites.ts`](../../apps/portal/src/lib/host/spaRewrites.ts) rewrite to the SSR function (`SSR_REWRITE_DESTINATION = /api/ssr`). A new [`apps/portal/src/App.tsx`](../../apps/portal/src/App.tsx) route must be added to `SPA_REWRITE_SOURCES` and [`vercel.json`](../../vercel.json) or production refresh 404s that page. Never add a catch-all `"source": "/(.*)"` rewrite.
- Theme color / brand chrome: SoftGate primary `#0e9494`
- OG images: series hubs use generated `/og/<id>.png` (1200x630, `ogImageForWebtoon`); fallback is `/logo/logo.png` (crawler-friendly PNG); in-app logo mark may be SVG. Favicon: `/favicon/favicon.svg` plus PNG 32 / apple-touch 180.
- Discovery: [`apps/portal/public/robots.txt`](../../apps/portal/public/robots.txt) (disallows `/read/`, private and auth paths, both locales); `/sitemap.xml` is **dynamic** from the shared catalog — see [portal-seo-ssr.md](portal-seo-ssr.md). Categories canonical may include `?sort=` for sort jobs; `/ranking` canonical has no `sort`. Ranked catalog emits `ItemList` JSON-LD (`buildItemListJsonLd`).

## Follow-up (needs SoftGate backend)

- Sitemap/OG regeneration from the live admin catalog (currently the shared mock seed at build time)

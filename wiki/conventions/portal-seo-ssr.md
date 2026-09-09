---
title: Portal SEO — SSR/hybrid (SoftGate Comic)
type: convention
date: 2026-08-27
tags: [seo, ssr, hreflang, sitemap, softgate]
---

# Portal SEO — SSR/hybrid

Public routes are server-rendered (Vite-native SSR, option B); the browser hydrates and localStorage-backed state fills in via effects. Established in Impl 178–181.

## Architecture

- Entries: [`apps/portal/src/entry-client.tsx`](../../apps/portal/src/entry-client.tsx) (`hydrateRoot`) and [`apps/portal/src/entry-server.tsx`](../../apps/portal/src/entry-server.tsx) (`render` / `renderPage` **async**: `StaticRouter` + `HelmetProvider` + per-request `i18n.cloneInstance` + `SsrResponseContext` + `CommentsSsrContext`). Callers (`server/dev.ts`, `server/index.ts`, `api/ssr.ts`) **await** `renderPage`.
- Hub `/webtoon/:id` and reader `/read/:id/:n` (plus `/mm` twins) fail-open `GET /api/comments?key=` with `AbortSignal.timeout(400)` then seed the thread. Other routes do not fetch comments. Production HTML includes comments only if the SSR bundle’s `VITE_API_BASE_URL` reaches a live comments API; otherwise empty seed, then the client GET fills. Local `pnpm dev` is SPA and does not exercise this seed (`pnpm dev:ssr` / `pnpm preview` do).
- `index.html` holds `<!--app-head-->` / `<!--app-html-->` placeholders — Helmet is the only source of head truth. Never hardcode page meta in the template.
- Local: `pnpm dev` is Vite SPA (`vite`). Local SSR check: `pnpm dev:ssr` runs `server/dev.ts` (Vite middleware SSR, live `/sitemap.xml`). Alias `pnpm --filter @softgate/portal dev:spa` still runs `vite`. Local SPA does not affect crawler SEO. Prod preview: `pnpm preview` (`server/index.ts`, Hono). Production: `build` + `api/ssr.ts` + `vercel.json` (unchanged).
- Build: `vite build --outDir dist/client` + `vite build --ssr src/entry-server.tsx --outDir dist/server` + `tsx scripts/generate-sitemap.ts`. `prepareSsrClientDist` renames `dist/client/index.html` → `template.html` (Vercel static must not shadow SSR) and copies `404.html`.
- Vercel: [`api/ssr.ts`](../../api/ssr.ts) function; [`vercel.json`](../../vercel.json) rewrites all public + `/mm` routes to `/api/ssr` (`SPA_REWRITE_SOURCES` + `SSR_REWRITE_DESTINATION` in [`apps/portal/src/lib/host/spaRewrites.ts`](../../apps/portal/src/lib/host/spaRewrites.ts)). New `App.tsx` routes must be added there or production 404s.
- Status codes are real: unknown route / unknown catalog id → NotFoundPage sets 404 via `useSsrResponse`.

## SSR-safety rules

- No `window` / `document` / `localStorage` / `matchMedia` access during render or module top level in portal `src/`. Initial state must be deterministic (mock seed / `false` / empty); storage reads move to `useEffect` after hydration.
- Never SSR user-specific state (no session on the server) — private routes render the guest/skeleton shell.
- Guard rails: `src/test/SsrRenderSmoke.test.tsx` (node env) must keep rendering every public route via async `render` / `renderPage`. Hub HTML still contains `hub-comments`.

## Indexing policy

- Series hub `/webtoon/:id` is the indexable unit. Reader `/read/...` is `noindex, follow`, no JSON-LD.
- Private/auth pages stay `noindex` (AuthSEO pattern). 404 recovery stays `noindex` + omitted canonical/social.
- Canonical is always explicit `path`-derived (`localizePath`) — no `window.location` fallback exists anymore.

## Locales + hreflang

- EN at `/` (x-default), Myanmar at `/mm/` (`lib/locale/`). URL prefix is the language source of truth on public pages; router mounts with `basename`. No Accept-Language auto-redirect.
- `SEO.tsx` emits self-referencing canonical, `hreflang` `en` / `my` / `x-default`, `og:locale` `en_US` / `my_MM`; server sets `<html lang>` (`my` BCP47 for MM UI code `mm`).
- `LanguageSwitcher` navigates to the alternate-locale URL with a full reload.

## Structured data

- Hub: `ComicSeries` + `BreadcrumbList` (real catalog fields only — never fabricate ratings/counts). Home: `WebSite` + `SearchAction` + `Organization`. Category/author: `BreadcrumbList` (+ `ItemList` / `Person` where present). Builders in [`apps/portal/src/components/SEO/jsonLd.ts`](../../apps/portal/src/components/SEO/jsonLd.ts).

## Sitemap + robots + OG

- `/sitemap.xml` is generated from the shared catalog ([`apps/portal/src/lib/seo/sitemap.ts`](../../apps/portal/src/lib/seo/sitemap.ts)): published webtoons (`lastmod`, cover images), authors, categories, static pages, both locales with `xhtml:link` alternates. No static `public/sitemap.xml` — do not recreate it.
- `robots.txt` disallows `/read/`, private and auth paths for `/` and `/mm/`, keeps the sitemap reference.
- Series OG images: `pnpm --filter @softgate/portal generate:og` (sharp) → `public/og/<id>.png` (1200x630); `ogImageForWebtoon` wires them on hubs. Rerun when covers change.

---
title: Local pnpm dev back to Vite SPA
date: 2026-08-27
type: note
impl: 184
tags: [dev, vite, spa, ssr, seo, softgate]
---

# Local pnpm dev back to Vite SPA

Local `pnpm dev` felt unlike the old Vite workflow because portal `dev` ran `server/dev.ts` (middleware SSR). Local SEO does not matter; production Perfect SEO must stay.

Change: portal `"dev": "vite"`; keep `"dev:spa": "vite"`; add `"dev:ssr": "tsx server/dev.ts"`. Root adds `"dev:ssr"` filter; root `"dev"` still proxies portal `dev`.

Production path unchanged: portal `build` (client + `--ssr` + sitemap), `api/ssr.ts`, `vercel.json`. `pnpm preview` still serves `dist/` via `server/index.ts`. Local SPA does not affect crawler SEO.

## Verify

Lint 0 errors. Impl 184 wiki files pass Prettier. `turbo run test:run build` green (portal 619, api 39, client + SSR). After restart, `pnpm dev` is Vite SPA. `pnpm dev:ssr` still boots middleware SSR.

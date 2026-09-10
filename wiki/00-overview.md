---
title: Project Overview
type: reference
date: 2026-08-10
updated: 2026-09-10
tags: [overview, project]
---

# Project Overview

**Name:** SoftGate Comic  
**Type:** Frontend Webtoon Reader Portal (React + Vite)  
**Purpose:** Webtoon reader experience for Myanmar readers with coin purchases and premium unlocking.

## Quick facts

- **Stack:** React 18.3 + TypeScript 5.5 + Vite 6 + Tailwind CSS v4
- **API:** Portal mock/localStorage when `VITE_USE_MOCK_API` is not `false` (Vercel unset). Committed example is `false`; local `pnpm dev` HTTP needs gitignored `.env.development.local` + `pnpm dev:api`. `apps/api` Hono (`GET /health`, `GET /api/catalog`, `GET /api/settings`, reader `/api/auth/*`, `/api/wallet/*`, `/api/library/*`, `/api/notifications/*`, `/api/prefs/*`, `/api/comments`, `/api/internal/notifications`; persist stub or Prisma when `DATABASE_URL` is set — Impl 185; R2 put helper under `portal/` — Impl 186; Brevo forgot/reset — Impl 187; profile writers — Impl 188) — Impl 171–204. Leader-dev JWT/R2/Brevo map onto existing slots in gitignored env (Impl 193). Local `DATABASE_URL` + migrate once + health `"prisma"` (Impl 194). Prisma catalog from Admin tables when persist is Prisma (Impl 195). Empty published `webtoons` is a successful empty catalog: portal discovery keeps live chrome (Impl 196, [loading-states.md](loading-states.md)). Catalog **loading** keeps that chrome with `CatalogBusyPanel` wells, not invented book grids (Impl 210). A **failed** catalog request is not that empty: live chrome + fail copy (Impl 198). Prisma persist reads Admin `PlatformSettings` on `GET /api/settings` (Impl 200). Prisma persist maps Admin `CoinPackage` onto catalog `coinPackages` (Impl 201). Live join: Admin Express often `:3000`; SoftGate gitignored `PORT` + `VITE_API_BASE_URL` (Impl 202). Reader notification delivery pipe: Admin service token + VAPID Web Push + comment_reply email/push (Impl 203). `new_episode` API fan-out from Admin episode ping (Impl 204). Prisma persist maps Admin Press CMS on `GET /api/press` (Impl 211); portal `/press` fail-opens to i18n. Prisma persist maps Admin Privacy/Terms CMS on `GET /api/legal/privacy` and `GET /api/legal/terms` (Impl 212); portal `/privacy` `/terms` fail-open to i18n. Cookies stay i18n. Git: `main` is product/Vercel; `development` is the leader-dev integration track.
- **Testing:** Vitest 4 (portal jsdom + API node)
- **Quality:** ESLint 9 + Prettier 3 + Husky 9 + lint-staged 15 + Turborepo
- **Workspace:** pnpm workspaces (`apps/*`, `packages/*`); package manager `pnpm@10.32.1`
- **Hooks:** pre-commit (lint-staged) + pre-push (`pnpm check`)
- **i18n:** English default + Myanmar (`en` / `mm`); portal light-only

## Top-level commands

```bash
pnpm install
pnpm dev                 # apps/portal Vite (http://localhost:5173)
pnpm dev:api             # apps/api Hono (gitignored PORT; default 3000. Confirm GET /health)
pnpm build               # turbo run build
pnpm preview             # serve portal production build
pnpm lint                # eslint .
pnpm lint:fix            # eslint . --fix
pnpm format              # prettier --write (portal src + packages + wiki)
pnpm format:check        # prettier --check
pnpm test                # vitest watch (portal)
pnpm test:run            # turbo run test:run
pnpm test:ui             # vitest --ui (portal)
pnpm test:coverage       # vitest coverage (portal)
pnpm check               # lint + format:check + test:run + build  ← pre-push runs this
pnpm storybook           # Storybook :6006
```

Local HTTP catalog/auth/wallet: gitignored `apps/portal/.env.development.local` with `VITE_USE_MOCK_API=false`, then `pnpm dev` **and** `pnpm dev:api`. Vite does not load `.env.example`. Unset (Vercel without the var) stays mock.

## Entry points

- `apps/portal/index.html` (placeholders) → `apps/portal/src/entry-client.tsx` (hydrate) → `<App />` → layouts (`MainLayout` / `AuthLayout` / `ReaderLayout`); SSR: `apps/portal/src/entry-server.tsx` (Impl 178)
- `apps/portal/src/index.css` — Tailwind v4 import + `@theme` brand tokens (`primary-*` / `accent-*`)
- In-app logo: `apps/portal/public/logo/logo.svg`
- `apps/api` — `pnpm dev:api` → `GET /health` on gitignored `PORT` (committed default 3000; this machine often 3001). Must match portal `VITE_API_BASE_URL`. `/api/catalog`, `/api/settings`, `/api/about`, `/api/press`, `/api/legal/privacy`, `/api/legal/terms`, `/api/auth/*`, `/api/wallet/*`, `/api/library/*`, `/api/notifications/*`, `/api/prefs/*`, `/api/comments`. Refused catalog is API not listening — [live-join-api-listen](notes/2026-09-10-live-join-api-listen.md).

## Documentation (Impl & QA)

- [architecture/implementation-phases.md](architecture/implementation-phases.md) — **SoftGate Comic Impl 1–213** (next: **214**)
- [architecture/implementation-phases-legacy.md](architecture/implementation-phases-legacy.md) — legacy immersive archive only
- [references/softgate-api.md](references/softgate-api.md) — `apps/api` health + catalog + persist (Impl 171–212)
- [references/pm-tracker-airtable.md](references/pm-tracker-airtable.md) — historical Airtable rows (legacy-era)
- Pre-backend Admin catalog/settings contract (do not invent conflicting portal fields): [`../soft-gate-comic-admin-dashboard/wiki/references/website-integration.md`](../../soft-gate-comic-admin-dashboard/wiki/references/website-integration.md)
- [conventions/named-integrations.md](conventions/named-integrations.md) — Prisma / R2 / Brevo slots; local Prisma + Admin catalog read (Impl 194–195); PlatformSettings (Impl 200); CoinPackage (Impl 201); live join port (Impl 202); Admin service token + VAPID (Impl 203); new-episode ping (Impl 204); About CMS read (Impl 205); portal History consume (Impl 206); portal Team consume (Impl 207); Press CMS read (Impl 211); Privacy/Terms CMS read (Impl 212); FAQ/Cookies CMS read (Impl 213)
- [conventions/portal-catalog-read.md](conventions/portal-catalog-read.md) — mock vs `GET /api/catalog`; Prisma Admin tables when persist is Prisma (Impl 195); empty vs load-fail (Impl 196, 198); CoinPackage (Impl 201); live join (Impl 202); refused origin = API not listening
- [conventions/portal-settings-read.md](conventions/portal-settings-read.md) — mock vs `GET /api/settings` (Impl 173); Prisma Admin PlatformSettings (Impl 200); live join (Impl 202)
- [conventions/portal-about-read.md](conventions/portal-about-read.md) — public `GET /api/about` (Impl 205); History UI consume (Impl 206); Team UI consume (Impl 207)
- [conventions/portal-press-read.md](conventions/portal-press-read.md) — public `GET /api/press` + PressPage consume (Impl 211)
- [conventions/portal-legal-read.md](conventions/portal-legal-read.md) — public `GET /api/legal/privacy` + `GET /api/legal/terms` + Privacy/Terms consume (Impl 212)
- [conventions/portal-faq-cookies-read.md](conventions/portal-faq-cookies-read.md) — public `GET /api/faq` + `GET /api/cookies` + FAQ/Cookies consume (Impl 213)
- [conventions/portal-notifications-deliver.md](conventions/portal-notifications-deliver.md) — Admin broadcast + Web Push + comment_reply out-of-band (Impl 203); `new-episode` fan-out (Impl 204)
- [conventions/brand-color-tokens.md](conventions/brand-color-tokens.md)
- [conventions/portal-light-and-i18n-defaults.md](conventions/portal-light-and-i18n-defaults.md)
- [conventions/border-radius.md](conventions/border-radius.md)
- [conventions/typography.md](conventions/typography.md)
- [conventions/info-page-chrome.md](conventions/info-page-chrome.md)
- [conventions/prelaunch-quality-bar.md](conventions/prelaunch-quality-bar.md) — international standard + beat peers (Impl 105)
- [conventions/reader-chrome.md](conventions/reader-chrome.md) — episode reader chrome, sheets, Demo ads, quiet complete (Impl 199)
- Agent contract: [`AGENTS.md`](../AGENTS.md)

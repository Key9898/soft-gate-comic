---
title: Project Overview
type: reference
date: 2026-08-10
tags: [overview, project]
---

# Project Overview

**Name:** SoftGate Comic  
**Type:** Frontend Webtoon Reader Portal (React + Vite)  
**Purpose:** Webtoon reader experience for Myanmar readers with coin purchases and premium unlocking.

## Quick facts

- **Stack:** React 18.3 + TypeScript 5.5 + Vite 5 + Tailwind CSS v4
- **API:** Mock by default (types & data in `@softgate/shared` package)
- **Testing:** Vitest 4 + Testing Library + jsdom
- **Quality:** ESLint 9 + Prettier 3 + Husky 9 + lint-staged 15
- **Hooks:** pre-commit (lint-staged) + pre-push (`npm run check`)
- **i18n:** English default + Myanmar (`en` / `mm`); portal light-only

## Top-level commands

```bash
npm run dev          # vite dev server (http://localhost:5173)
npm run build        # tsc -b && vite build
npm run preview      # serve production build
npm run lint         # eslint .
npm run lint:fix     # eslint . --fix
npm run format       # prettier --write
npm run format:check # prettier --check
npm run test         # vitest (watch)
npm run test:run     # vitest run (single)
npm run test:ui      # vitest --ui
npm run test:coverage# vitest run --coverage
npm run check        # lint + format:check + test:run + build  ← pre-push runs this
```

## Entry points

- `index.html` → `/src/main.tsx` → `<App />` → layouts (`MainLayout` / `AuthLayout` / `ReaderLayout`)
- `src/index.css` — Tailwind v4 import + `@theme` brand tokens (`primary-*` / `accent-*`)
- In-app logo: `public/logo/logo.svg`

## Documentation (Impl & QA)

- [architecture/implementation-phases.md](architecture/implementation-phases.md) — **SoftGate Comic Impl 1–154** (next: **155**)
- [architecture/implementation-phases-legacy.md](architecture/implementation-phases-legacy.md) — legacy immersive archive only
- [references/pm-tracker-airtable.md](references/pm-tracker-airtable.md) — historical Airtable rows (legacy-era)
- [conventions/brand-color-tokens.md](conventions/brand-color-tokens.md)
- [conventions/portal-light-and-i18n-defaults.md](conventions/portal-light-and-i18n-defaults.md)
- [conventions/border-radius.md](conventions/border-radius.md)
- [conventions/typography.md](conventions/typography.md)
- [conventions/info-page-chrome.md](conventions/info-page-chrome.md)
- [conventions/prelaunch-quality-bar.md](conventions/prelaunch-quality-bar.md) — international standard + beat peers (Impl 105)
- Agent contract: [`AGENTS.md`](../AGENTS.md)

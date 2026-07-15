---
title: Project Overview
type: reference
date: 2026-07-06
tags: [overview, project]
---

# Project Overview

**Name:** Soft-Gate Comic
**Type:** Frontend Webtoon Reader Portal (React + Vite)
**Purpose:** Localization of webtoon reader experience for Myanmar readers with coin purchases and premium unlocking.

## Quick facts

- **Stack:** React 18.3 + TypeScript 5.5 + Vite 5 + Tailwind CSS v4
- **API:** Mock by default (types & data in `@softgate/shared` package)
- **Testing:** Vitest 4 + Testing Library + jsdom
- **Quality:** ESLint 9 + Prettier 3 + Husky 9 + lint-staged 15
- **Hooks:** pre-commit (lint-staged) + pre-push (`npm run check`)

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

- `index.html` → `/src/main.tsx` → `<App />` → `<ImmersiveLayout />`
- `src/index.css` — Tailwind v4 import + `@theme` design tokens (EDC brand colors)
- `wiki/references/api-contract.md` — frontend ↔ backend API contract

## Documentation (phases & QA)

- [architecture/implementation-phases.md](architecture/implementation-phases.md) — **Implementation Phases 1–71** + [Documentation Phases 33–34](architecture/implementation-phases.md#documentation-phase-33)
- [references/pm-tracker-airtable.md](references/pm-tracker-airtable.md) — Airtable PM rows 1–74
- [references/api-contract.md](references/api-contract.md) — API contract v2 (session, history, streaming, CDN)
- [references/avatar-manifest.md](references/avatar-manifest.md) — designer avatar manifest
- [conventions/immersive-ui.md](conventions/immersive-ui.md) — immersive layout, choreography, speech bubbles
- [conventions/](conventions/) — dark mode tokens, what-not-to-redo
- Local product scenarios (gitignored): `docs/immersive-product-scenarios.md` — Scenario 1/2/3 direction

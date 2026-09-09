---
title: Folder Map
type: reference
date: 2026-08-10
updated: 2026-09-09
tags: [structure, folders, soft-gate]
---

# Folder Map

SoftGate Comic — Myanmar webtoon reader portal (pnpm + Turborepo workspace, through Impl 199).

```
soft-gate-comic/
├── vercel.json             # SPA rewrites + portal dist output
├── AGENTS.md               # agent operating contract (dual-track + Lark)
├── README.md
├── package.json            # workspace orchestrator + lint-staged + prepare
├── pnpm-workspace.yaml
├── turbo.json
├── eslint.config.js        # portal React + api Node + packages TS
├── .gitattributes          # LF normalization
├── .husky/                 # pre-commit (lint-staged), pre-push (pnpm check)
├── .cursor/rules/          # 00–07 (always-on context, hygiene, prelaunch quality bar)
├── .cursor/skills/wiki/
├── .vscode/extensions.json
├── docs/                   # gitignored — local sessions only
├── wiki/                   # committed AI knowledge base
├── packages/
│   ├── shared/             # @softgate/shared types + mock data
│   └── contracts/          # @softgate/contracts Zod envelope skeleton
├── apps/api/               # @softgate/api Hono (health + catalog + settings GET + reader auth + wallet + library + notifications + prefs + comments; Prisma persist Impl 185/190–192/197; Admin catalog read Impl 195; R2 put helper Impl 186; Brevo forgot/reset Impl 187; profile writers Impl 188)
│   ├── docker-compose.yml  # local Postgres 16
│   └── prisma/             # reader persist migrations; Admin catalog models copied (no portal catalog CREATE)
└── apps/portal/            # Vite reader app
    ├── index.html
    ├── vite.config.ts
    ├── vitest.config.ts
    ├── public/             # logo, covers, banner, auth reading-room jpgs, robots, sitemap
    ├── .storybook/
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── index.css
        ├── components/     # shared UI (Button, Skeleton, CatalogEmptyPanel, …)
        ├── context/
        ├── demo/
        ├── features/
        ├── layouts/
        ├── hooks/
        ├── lib/
        └── test/
```

## Conventions

- `apps/portal/src/**` — application code only
- `apps/api/src/**` — API process (health + catalog + settings GET + reader auth + wallet + library + notifications + prefs under `src/prefs/` + comments under `src/comments/`; persist stub or Prisma; Admin catalog mapper under `src/catalog/`; R2 put helper under `portal/`; Brevo HTML mail under `src/mail/`; schema/migrations under `apps/api/prisma/`)
- Wiki lives at `wiki/` and is **tracked in git**
- `docs/` is **gitignored** — session summaries are local hand-off only
- Tests colocate under `apps/portal/src/test/` and `apps/api/src/test/`
- Brand tokens: `primary-*` / `accent-*` in `apps/portal/src/index.css` `@theme`
- Portal is light-only; default language is English (`en`)

## Key entry files

| Concern       | Path                                                                                                                                                                                                                                                                                                                            |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| App bootstrap | `apps/portal/src/main.tsx`                                                                                                                                                                                                                                                                                                      |
| Routes        | `apps/portal/src/App.tsx`                                                                                                                                                                                                                                                                                                       |
| Catalog       | Mock / stub seed: `packages/shared` (`publishedCatalogFrom`). Prisma persist: Admin tables via `apps/api` (Impl 195). Portal localStorage when mock on.                                                                                                                                                                         |
| Settings      | `packages/shared` (`portalSettings`; portal `SettingsContext`)                                                                                                                                                                                                                                                                  |
| API process   | `apps/api` (`GET /health`, `/api/catalog`, `/api/settings`, `/api/auth/*`, `/api/wallet/*`, `/api/library/*`, `/api/notifications/*`, `/api/prefs/*`, `/api/comments`; persist stub or Prisma Impl 185/190–192/197; Admin catalog read Impl 195; R2 put helper Impl 186; Brevo forgot/reset Impl 187; profile writers Impl 188) |
| API contracts | `packages/contracts` (envelope; Impl 170)                                                                                                                                                                                                                                                                                       |
| Reader        | `apps/portal/src/features/reader/` (`ReaderPage`, `ReaderSheet`, episode/settings sheets, `ReaderAdSlot`, `ReaderCompletePortal`); helpers `apps/portal/src/lib/reader/` (gestures, ads, episodeReports, prefs) — Impl 199                                                                                                      |

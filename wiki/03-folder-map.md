---
title: Folder Map
type: reference
date: 2026-08-10
updated: 2026-08-25
tags: [structure, folders, soft-gate]
---

# Folder Map

SoftGate Comic — Myanmar webtoon reader portal (pnpm + Turborepo workspace, Impl 176).

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
├── apps/api/               # @softgate/api Hono (health + catalog + settings GET + reader auth + wallet; Prisma schema slots; Impl 176)
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
        ├── components/
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
- `apps/api/src/**` — API process (health + catalog + settings GET + reader auth + wallet; persist stub; Prisma schema under `apps/api/prisma/`)
- Wiki lives at `wiki/` and is **tracked in git**
- `docs/` is **gitignored** — session summaries are local hand-off only
- Tests colocate under `apps/portal/src/test/` and `apps/api/src/test/`
- Brand tokens: `primary-*` / `accent-*` in `apps/portal/src/index.css` `@theme`
- Portal is light-only; default language is English (`en`)

## Key entry files

| Concern       | Path                                                                                                              |
| ------------- | ----------------------------------------------------------------------------------------------------------------- |
| App bootstrap | `apps/portal/src/main.tsx`                                                                                        |
| Routes        | `apps/portal/src/App.tsx`                                                                                         |
| Catalog       | `packages/shared` (`publishedCatalogFrom`; mock localStorage in portal)                                           |
| Settings      | `packages/shared` (`portalSettings`; portal `SettingsContext`)                                                    |
| API process   | `apps/api` (`GET /health`, `/api/catalog`, `/api/settings`, `/api/auth/*`, `/api/wallet/*`; named slots Impl 176) |
| API contracts | `packages/contracts` (envelope; Impl 170)                                                                         |

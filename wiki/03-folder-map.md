---
title: Folder Map
type: reference
date: 2026-08-10
tags: [structure, folders, soft-gate]
---

# Folder Map

SoftGate Comic — Myanmar webtoon reader portal (company frontend scaffolding + comic product layout).

```
soft-gate-comic/
├── AGENTS.md               # agent operating contract (dual-track + Lark)
├── README.md
├── package.json            # deps + scripts + lint-staged + prepare
├── vite.config.ts
├── vitest.config.ts
├── eslint.config.js
├── .gitattributes          # LF normalization
├── .husky/                 # pre-commit (lint-staged), pre-push (npm run check)
├── .cursor/rules/          # 00–06 (always-on context + hygiene)
├── .cursor/skills/wiki/
├── .vscode/extensions.json
├── docs/                   # gitignored — local sessions only
├── wiki/                   # committed AI knowledge base
│   ├── architecture/
│   ├── conventions/
│   ├── decisions/
│   ├── notes/
│   ├── references/
│   └── snippets/
├── packages/
│   └── shared/             # @softgate/shared types + mock data
├── public/                 # logo, covers, banner, robots, sitemap
├── .storybook/
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css           # Tailwind v4 @import + @theme + utilities
    ├── components/         # Navigation, Footer, SEO, SearchAutocomplete, BookCard, HeroBook3D, Breadcrumb, PageHeader, ScrollToTop, Skeleton, …
    ├── context/            # Data, Auth, Library, Wallet, Engagement
    ├── demo/
    ├── features/
    │   ├── auth/           # auth pages; useAuth re-exports AuthContext
    │   ├── categories/
    │   ├── coins/          # + components/ (package card, history row, coinData)
    │   ├── home/           # + components/HeroSpotlight (Impl 49)
    │   ├── info/           # + components/ (legal toc, StoryBook)
    │   ├── library/        # + components/ (empty state, delete confirm)
    │   ├── notifications/
    │   ├── profile/        # + components/ (FloatingInput, chart, badges)
    │   ├── reader/         # + components/ (ReaderCommentsPanel)
    │   ├── search/
    │   └── webtoon/
    ├── layouts/
    │   ├── MainLayout.tsx
    │   ├── AuthLayout.tsx
    │   └── ReaderLayout.tsx
    ├── hooks/              # useDebounce, useOverflowScrollX, useScrollLock, useFocusTrap, …
    ├── lib/                # i18n, search/*, categories/*, library/*, auth/*, account/*, wallet/*, engagement/*, comments/*, notifications/*, info/pageMeta, info/storyChapters, …
    └── test/               # Vitest suites
```

## Conventions

- `src/**` — application code only
- Wiki lives at `wiki/` and is **tracked in git**
- `docs/` is **gitignored** — session summaries are local hand-off only
- Tests colocate under `src/test/`
- Brand tokens: `primary-*` / `accent-*` in `src/index.css` `@theme`
- Portal is light-only; default language is English (`en`)
- Per-route SEO: `src/components/SEO/`; client search: `src/lib/search/`; catalog tiles: `src/lib/catalog/`; categories match: `src/lib/categories/`; bookmarks: `src/lib/library/`; wallet/engagement/comments/notifications: matching `src/lib/*` + contexts

## Key entry files

| Concern        | Path                           |
| -------------- | ------------------------------ |
| App entry      | `src/main.tsx` → `App.tsx`     |
| Main chrome    | `src/layouts/MainLayout.tsx`   |
| Reader chrome  | `src/layouts/ReaderLayout.tsx` |
| i18n           | `src/lib/i18n/`                |
| Categories lib | `src/lib/categories/`          |
| Catalog tiles  | `src/lib/catalog/`             |
| Shared package | `packages/shared/`             |
| Agent contract | `AGENTS.md`                    |
| Git workflow   | `wiki/02-workflow.md`          |

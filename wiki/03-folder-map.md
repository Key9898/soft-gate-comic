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
├── vercel.json             # SPA rewrites (200) + unmatched 404.html
├── AGENTS.md               # agent operating contract (dual-track + Lark)
├── README.md
├── package.json            # deps + scripts + lint-staged + prepare
├── vite.config.ts
├── vitest.config.ts
├── eslint.config.js
├── .gitattributes          # LF normalization
├── .husky/                 # pre-commit (lint-staged), pre-push (npm run check)
├── .cursor/rules/          # 00–07 (always-on context, hygiene, prelaunch quality bar)
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
├── public/                 # logo, covers, banner, auth reading-room jpgs, robots, sitemap
├── .storybook/
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css           # Tailwind v4 @import + @theme + utilities
    ├── components/         # Navigation, Footer, SEO, SearchAutocomplete, BookCard, SeriesRating, HeroBook3D, Breadcrumb, PageHeader, ScrollToTop, Skeleton, …
    ├── context/            # Data, Auth, Library, Follows, Wallet, Engagement
    ├── demo/
    ├── features/
    │   ├── auth/           # auth pages + AuthSplitCard; useAuth re-exports AuthContext
    │   ├── author/         # /author/:id catalog profile
    │   ├── categories/
    │   ├── coins/          # + components/ (package card, history row, coinData)
    │   ├── home/           # + HeroSpotlight, HomeCatalogRail, HomeDailyBoard, DailyDropCard, HomeRankingChart
    │   ├── info/           # + components/ (LegalPageShell, legal toc, StoryBook)
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
    ├── lib/                # i18n, search/*, categories/*, catalog/* (discovery, dailyDrops, browseUrls, pagination, waitForFree), host/* (SPA rewrites + 404.html emit), rating/* (stars), contentRating/* (maturity + 18+ confirm), library/*, follows/*, auth/*, account/*, wallet/*, engagement/*, comments/*, notifications/*, info/pageMeta, info/legalEffectiveDate, info/storyChapters, …
    └── test/               # Vitest suites
```

## Conventions

- `src/**` — application code only
- Wiki lives at `wiki/` and is **tracked in git**
- `docs/` is **gitignored** — session summaries are local hand-off only
- Tests colocate under `src/test/`
- Brand tokens: `primary-*` / `accent-*` in `src/index.css` `@theme`
- Portal is light-only; default language is English (`en`)
- Per-route SEO: `src/components/SEO/`; client search: `src/lib/search/`; catalog tiles: `src/lib/catalog/`; reader prefs: `src/lib/reader/`; series rating: `src/lib/rating/` + `src/components/SeriesRating/`; content rating: `src/lib/contentRating/` + `src/components/ContentRatingBadge.tsx`; categories match: `src/lib/categories/`; subscriptions: `src/lib/library/`; author follows: `src/lib/follows/`; wallet/engagement/comments/notifications (incl. `notifications/prefs.ts`): matching `src/lib/*` + contexts

## Key entry files

| Concern        | Path                           |
| -------------- | ------------------------------ |
| App entry      | `src/main.tsx` → `App.tsx`     |
| Main chrome    | `src/layouts/MainLayout.tsx`   |
| Reader chrome  | `src/layouts/ReaderLayout.tsx` |
| i18n           | `src/lib/i18n/`                |
| Categories lib | `src/lib/categories/`          |
| Catalog tiles  | `src/lib/catalog/`             |
| Reader prefs   | `src/lib/reader/`              |
| Host SPA 404   | `vercel.json`, `src/lib/host/` |
| Shared package | `packages/shared/`             |
| Agent contract | `AGENTS.md`                    |
| Git workflow   | `wiki/02-workflow.md`          |

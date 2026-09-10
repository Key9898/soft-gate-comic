---
title: Folder Map
type: reference
date: 2026-08-10
updated: 2026-09-10
tags: [structure, folders, soft-gate]
---

# Folder Map

SoftGate Comic — Myanmar webtoon reader portal (pnpm + Turborepo workspace, through Impl 213).

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
├── apps/api/               # @softgate/api Hono (health + catalog + settings GET + about GET + press GET + legal GET + faq GET + cookies GET + reader auth + wallet + library + notifications + prefs + comments + internal notifications; Prisma persist Impl 185/190–192/197/203–204; Admin catalog read Impl 195; Admin PlatformSettings read Impl 200; Admin CoinPackage Impl 201; Admin About CMS read Impl 205; Admin Press CMS read Impl 211; Admin Privacy/Terms CMS read Impl 212; Admin FAQ/Cookies CMS read Impl 213; R2 put helper Impl 186; Brevo forgot/reset Impl 187; profile writers Impl 188; Web Push Impl 203; new-episode fan-out Impl 204)
    │   ├── docker-compose.yml  # local Postgres 16
    │   └── prisma/             # reader persist migrations; Admin catalog + PlatformSettings + CoinPackage + About + Press + Privacy/Terms + FAQ/Cookies models copied (no portal CREATE)
└── apps/portal/            # Vite reader app
    ├── index.html
    ├── vite.config.ts
    ├── vitest.config.ts
    ├── public/             # logo, covers, banner, auth reading-room jpgs, robots, sitemap, sw.js (HTTP Web Push), press-kit ZIP + Demo stills (Impl 209)
    ├── .storybook/
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── index.css
        ├── components/     # shared UI (Button, Skeleton, CatalogEmptyPanel, CatalogBusyPanel, …)
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
- `apps/api/src/**` — API process (health + catalog + settings GET + about GET under `src/about/` + press GET under `src/press/` + legal GET under `src/legal/` + faq GET under `src/faq/` + cookies GET under `src/cookiePolicy/` + reader auth + wallet + library + notifications + prefs under `src/prefs/` + comments under `src/comments/` + internal notifications under `src/internal/` + deliver under `src/notify/` including `episode.ts`; persist stub or Prisma; Admin catalog mapper under `src/catalog/` (CoinPackage Impl 201); Admin PlatformSettings mapper under `src/settings/` (Impl 200); Admin About mapper under `src/about/` (Impl 205); Admin Press mapper under `src/press/` (Impl 211); Admin Privacy/Terms mapper under `src/legal/` (Impl 212); Admin FAQ mapper under `src/faq/` (Impl 213); Admin Cookie Policy mapper under `src/cookiePolicy/` (Impl 213); R2 put helper under `portal/`; Brevo HTML mail under `src/mail/`; Web Push under `src/ports/push.ts`; schema/migrations under `apps/api/prisma/`)
- Wiki lives at `wiki/` and is **tracked in git**
- `docs/` is **gitignored** — session summaries are local hand-off only
- Tests colocate under `apps/portal/src/test/` and `apps/api/src/test/`
- Brand tokens: `primary-*` / `accent-*` in `apps/portal/src/index.css` `@theme`
- Portal is light-only; default language is English (`en`)

## Key entry files

| Concern              | Path                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| App bootstrap        | `apps/portal/src/main.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Home radial View All | `apps/portal/src/features/home/components/HomeRailRadialModal` (Impl 208); Search rails keep `viewAllTo` links                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Press kit            | `apps/portal/public/press-kit/` ZIP + Demo stills; `PressPage` (Impl 209); live `GET /api/press` consume (Impl 211)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Privacy / Terms      | `PrivacyPage` / `TermsPage`; live `GET /api/legal/privacy` + `GET /api/legal/terms` consume (Impl 212); mock/fail keeps `t('static.*')`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| FAQ / Cookies        | `FAQPage` / `CookiesPage`; live `GET /api/faq` + `GET /api/cookies` consume (Impl 213); mock/fail keeps today’s i18n; Help hub stays catalog                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Catalog loading      | `CatalogBusyPanel` wells on Home/Categories/Search/hub/Author/Library skeletons (Impl 210); Reader chrome unchanged                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Routes               | `apps/portal/src/App.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Catalog              | Mock / stub seed: `packages/shared` (`publishedCatalogFrom`). Prisma persist: Admin tables via `apps/api` (Impl 195) including `CoinPackage` (Impl 201). Portal localStorage when mock on.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Settings             | `packages/shared` (`portalSettings`; portal `SettingsContext`). Prisma persist: Admin `PlatformSettings` via `apps/api/src/settings/` (Impl 200). Stub seed when persist is stub.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| About                | Prisma persist: Admin `AboutHistory` / `AboutTeamMember` / `AboutTeamMeta` via `apps/api/src/about/` (Impl 205). Stub seed when persist is stub. Portal History: `lib/about/history.ts` + `useAboutHistories` + `AboutHistorySection` (Impl 206). Portal Team: `lib/about/team.ts` + `AboutProvider` + `useAboutTeam` + `AboutTeamSection` (Impl 207). One shared `GET /api/about`.                                                                                                                                                                                                                                                                                                          |
| Press                | Prisma persist: Admin `PressMeta` / `PressNews` / `PressStill` via `apps/api/src/press/` (Impl 211). Stub `STUB_PRESS`. Portal `lib/press.ts` + `PressPage` live fetch; mock/fail keeps i18n.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Privacy / Terms      | Prisma persist: Admin `PrivacyMeta` / `PrivacySection` / `TermsMeta` / `TermsSection` via `apps/api/src/legal/` (Impl 212). Stub `STUB_PRIVACY` / `STUB_TERMS`. Portal `lib/legal.ts` + `PrivacyPage` / `TermsPage` live fetch; mock/fail keeps `t('static.*')`.                                                                                                                                                                                                                                                                                                                                                                                                                             |
| FAQ / Cookies        | Prisma persist: Admin `FaqMeta` / `FaqItem` / `CookieMeta` / `CookieStorageRow` via `apps/api/src/faq/` + `src/cookiePolicy/` (Impl 213). Stub `STUB_FAQ` / `STUB_COOKIES`. Portal `lib/faq.ts` + `lib/cookies.ts`; mock/fail keeps today’s i18n. Help hub stays catalog.                                                                                                                                                                                                                                                                                                                                                                                                                    |
| API process          | `apps/api` (`GET /health`, `/api/catalog`, `/api/settings`, `/api/about`, `/api/press`, `/api/legal/privacy`, `/api/legal/terms`, `/api/faq`, `/api/cookies`, `/api/auth/*`, `/api/wallet/*`, `/api/library/*`, `/api/notifications/*`, `/api/prefs/*`, `/api/comments`, `/api/internal/notifications`; persist stub or Prisma Impl 185/190–192/197/203–205/211–213; Admin catalog read Impl 195; Admin PlatformSettings read Impl 200; Admin CoinPackage Impl 201; Admin About CMS read Impl 205; Admin Press CMS read Impl 211; Admin Privacy/Terms CMS read Impl 212; Admin FAQ/Cookies CMS read Impl 213; R2 put helper Impl 186; Brevo forgot/reset Impl 187; profile writers Impl 188) |
| API contracts        | `packages/contracts` (envelope; Impl 170)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Reader               | `apps/portal/src/features/reader/` (`ReaderPage`, `ReaderSheet`, episode/settings sheets, `ReaderAdSlot`, `ReaderCompletePortal`); helpers `apps/portal/src/lib/reader/` (gestures, ads, episodeReports, prefs) — Impl 199                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |

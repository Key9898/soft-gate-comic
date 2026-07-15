---
title: Folder Map
type: reference
date: 2026-07-06
tags: [structure, folders]
---

# Folder Map

```
ai-poc-frontend/
├── index.html              # entry HTML
├── package.json            # deps + scripts + lint-staged + prepare
├── vite.config.ts          # Vite + React + Tailwind plugin
├── vitest.config.ts        # Vitest + React plugin + jsdom
├── eslint.config.js        # ESLint flat config
├── .husky/                 # pre-commit (lint-staged), pre-push (npm run check)
├── docs/                   # gitignored — local reference (sessions/, clientData/, scenarios)
├── wiki/                   # committed AI knowledge base
│   ├── architecture/       # implementation-phases.md (Impl 1–71)
│   ├── conventions/        # immersive-ui.md, dark-mode, tokens
│   ├── notes/
│   └── references/         # pm-tracker, api-contract, avatar-manifest
├── public/
│   ├── immersive/          # virtual-bg.jpg, speech-bubble.svg, avatar assets
│   ├── logo/
│   └── productsImages/
└── src/
    ├── main.tsx            # React 18 createRoot entry
    ├── App.tsx             # → ImmersiveLayout only
    ├── index.css           # Tailwind v4 @import + @theme + glass/scrollbar utilities
    ├── layouts/
    │   └── ImmersiveLayout.tsx
    ├── stores/
    │   └── commerceStore.ts
    ├── features/
    │   └── immersive/      # AdvisorDock, bubbles, sequence, showroom components
    │       ├── AdvisorDock.tsx
    │       ├── VirtualShowroom.tsx
    │       ├── ShowroomHeroCard.tsx
    │       ├── ShowroomProductRail.tsx
    │       ├── useImmersiveSequence.ts
    │       ├── avatarLayout.ts
    │       └── bubbles/
    ├── lib/
    │   ├── api/            # mock + http client, chat streaming
    │   └── i18n/
    └── test/               # Vitest suites (126+ tests)
```

## Conventions

- `src/**` — application code only
- `App.tsx` renders **`ImmersiveLayout`** only (legacy `CommerceLayout` removed Impl Phase 38)
- Wiki lives at `wiki/` and is **tracked in git**
- `docs/` is **gitignored** — session summaries, client PDFs, `immersive-product-scenarios.md`
- Tests colocate under `src/test/`

## Key immersive files

| Concern                 | Path                                             |
| ----------------------- | ------------------------------------------------ |
| Layout entry            | `src/layouts/ImmersiveLayout.tsx`                |
| 3D lobby (default)      | `src/features/lobby3d/`                          |
| Opening choreography    | `src/features/immersive/useImmersiveSequence.ts` |
| Store + showroom entry  | `src/stores/commerceStore.ts`                    |
| Speech bubble layout    | `src/features/immersive/avatarLayout.ts`         |
| Showroom shell (legacy) | `src/features/immersive/VirtualShowroom.tsx`     |
| Conventions             | `wiki/conventions/immersive-ui.md`               |

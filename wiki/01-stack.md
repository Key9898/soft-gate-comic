---
title: Tech Stack
type: reference
date: 2026-07-06
tags: [stack, react, vite, tailwind]
---

# Tech Stack

| Layer     | Tool         | Version | Why                                              |
| --------- | ------------ | ------- | ------------------------------------------------ |
| UI        | React        | 18.3    | Concurrent rendering, mature ecosystem           |
| Lang      | TypeScript   | 5.5     | Strict type safety, `tsc -b` project refs        |
| Build     | Vite         | 6       | Fast HMR, ESM-native; Vitest 4 `module-runner`   |
| Style     | Tailwind CSS | 4.0     | CSS-first config via `@theme`, no PostCSS        |
| Lint      | ESLint       | 9       | Flat config, typescript-eslint                   |
| Format    | Prettier     | 3       | + `prettier-plugin-tailwindcss` for class sort   |
| Test      | Vitest       | 4       | Vite-native, jsdom env, v8 coverage              |
| Hooks     | Husky        | 9       | Lightweight git hooks                            |
| Hooks     | lint-staged  | 15      | Run tasks only on staged files                   |
| Workspace | pnpm         | 10      | Workspaces (`apps/*`, `packages/*`)              |
| Tasks     | Turborepo    | 2       | Cached lint/test/build graph                     |
| API       | Hono         | 4       | Node via `@hono/node-server` (Impl 171–188)      |
| ORM       | Prisma       | 6       | Reader persist when `DATABASE_URL` is set (185)  |
| Object    | R2 / S3 SDK  | 3       | Put helper under `portal/` when env is set (186) |
| Mail      | Brevo SDK    | 6       | HTML forgot/reset when key+from set (187)        |

## Tailwind v4 specifics

- Configured via `apps/portal/src/index.css` (no `tailwind.config.js`):
  ```css
  @import 'tailwindcss';
  @theme {
    --color-brand-500: #0ea5e9;
    --font-display: 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif;
  }
  ```
- Powered by `@tailwindcss/vite` plugin in `apps/portal/vite.config.ts`
- No PostCSS config required

## ESLint flat config (`eslint.config.js`)

- Extends: `@eslint/js` recommended + `typescript-eslint` recommended
- Plugins: react, react-hooks, react-refresh
- Prettier config last (disables conflicting stylistic rules)

## Vitest setup

- Separate `apps/portal/vitest.config.ts` (different plugin copy than `vite.config.ts`)
- `jsdom` env, globals enabled
- Setup file: `apps/portal/src/test/setup.ts` (jest-dom matchers + auto cleanup)
- API: `apps/api/vitest.config.ts` — `environment: "node"`

# SoftGate Comic

Webtoon reader portal for Myanmar readers (React + Vite + Tailwind v4).

## Stack

- React 18.3 + TypeScript 5.5 (strict)
- Vite 5 + `@tailwindcss/vite` (Tailwind CSS v4)
- i18next (`en` default / `mm`)
- Vitest 4 + Testing Library
- Husky 9 + lint-staged 15
- Storybook 8

## Commands

```bash
npm install
npm run dev          # Vite (default :5173)
npm run build        # tsc -b && vite build
npm run lint         # eslint .
npm run lint:fix     # eslint . --fix
npm run format       # prettier write (src/ + wiki/)
npm run format:check
npm run test         # vitest watch
npm run test:run     # vitest run
npm run test:ui      # vitest --ui
npm run check        # lint + format:check + test:run + build (pre-push)
npm run storybook    # Storybook :6006
```

## Git hooks

| Hook       | Action                                              |
| ---------- | --------------------------------------------------- |
| pre-commit | `npx lint-staged` (ESLint/Prettier on staged files) |
| pre-push   | `npm run check`                                     |

## Docs

| Track            | Path             | Git        |
| ---------------- | ---------------- | ---------- |
| Wiki (knowledge) | `wiki/`          | Committed  |
| Session hand-off | `docs/sessions/` | Gitignored |

Agent operating rules: [`AGENTS.md`](./AGENTS.md).

## Workspace layout (high level)

```
soft-gate-comic/
├── AGENTS.md
├── packages/shared/     # @softgate/shared
├── public/
├── src/
│   ├── components/
│   ├── features/        # home, reader, coins, …
│   ├── layouts/
│   ├── lib/
│   └── test/
├── wiki/
└── docs/                # local only (gitignored)
```

# SoftGate Comic

Webtoon reader portal for Myanmar readers (React + Vite + Tailwind v4). pnpm + Turborepo workspace (Impl 172).

## Stack

- React 18.3 + TypeScript 5.5 (strict)
- Vite 6 + `@tailwindcss/vite` (Tailwind CSS v4)
- i18next (`en` default / `mm`)
- Vitest 4 + Testing Library
- Husky 9 + lint-staged 15
- Storybook 8
- pnpm 10 workspaces + Turborepo

## Commands

```bash
pnpm install
pnpm dev                 # apps/portal Vite (default :5173)
pnpm dev:api             # apps/api Hono (default :3000)
pnpm build               # turbo run build
pnpm lint                # eslint .
pnpm lint:fix            # eslint . --fix
pnpm format              # prettier write (portal src + packages + wiki)
pnpm format:check
pnpm test                # vitest watch (portal)
pnpm test:run            # turbo run test:run
pnpm test:ui             # vitest --ui (portal)
pnpm check               # lint + format:check + test:run + build (pre-push)
pnpm storybook           # Storybook :6006
```

## Git hooks

| Hook       | Action                                                    |
| ---------- | --------------------------------------------------------- |
| pre-commit | `pnpm exec lint-staged` (ESLint/Prettier on staged files) |
| pre-push   | `pnpm check`                                              |

## Docs

| Track            | Path             | Git        |
| ---------------- | ---------------- | ---------- |
| Wiki (knowledge) | `wiki/`          | Committed  |
| Session hand-off | `docs/sessions/` | Gitignored |

Agent operating rules: [`AGENTS.md`](./AGENTS.md).

## Workspace layout (high level)

```
soft-gate-comic/
├── apps/portal/            # Vite reader portal
├── apps/api/               # Hono API (Impl 171–176; persist stub + named slots)
├── packages/shared/        # @softgate/shared catalog types + mock
├── packages/contracts/     # @softgate/contracts Zod envelope skeleton
├── wiki/
├── pnpm-workspace.yaml
└── turbo.json
```

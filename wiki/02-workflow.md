---
title: Git Workflow & Documentation
type: convention
date: 2026-07-09
tags: [git, husky, wiki, sessions]
---

# Git Workflow

## Branches

- `main` — product/UI; Vercel deploy; mock-safe default (`isMockApi()` unset stays mock)
- `development` — leader **dev** stack integration track. Railway/R2/Brevo/JWT values live in **local gitignored env** only, never committed. Not auto-prod.
- Feature branches: `feat/<scope>`, `fix/<scope>`, `chore/<scope>` — UI from `main`; infra against the leader dev stack from `development`

Secrets never land on any branch. Vercel stays `main` only. An Admin repo `development` branch is a different repository — do not merge.

ADR: [decisions/012-development-branch.md](decisions/012-development-branch.md).

## Hooks

### pre-commit (`.husky/pre-commit`)

Runs `pnpm exec lint-staged` — only touches **staged files**:

| Pattern                  | Task                                |
| ------------------------ | ----------------------------------- |
| `*.{ts,tsx}`             | `eslint --fix` → `prettier --write` |
| `*.{js,jsx,json,css,md}` | `prettier --write`                  |

### pre-push (`.husky/pre-push`)

Runs `pnpm check` — full project validation:

1. `eslint .`
2. `prettier --check` (portal src + api + packages + wiki)
3. `turbo run test:run build`

> If any step fails, push is **blocked**.

### Line endings

- Root [`.gitattributes`](../.gitattributes): `* text=auto eol=lf` so checkout matches Prettier `"endOfLine": "lf"`.
- On Windows, avoid relying on system `core.autocrlf=true` alone — without `.gitattributes`, Prettier can fail many files and husky reports `failed to push some refs` even when the branch is ahead.

## Standard flow

```bash
# 1. work + stage
git add <files>

# 2. commit (pre-commit runs lint-staged on staged files)
git commit -m "feat: add login form"

# 3. push (pre-push runs full check)
git push origin feat/login
```

## Bypassing hooks (emergency only)

```bash
git commit --no-verify -m "hotfix: ..."
git push --no-verify
```

## prepare script

`package.json` ထဲမှာ `prepare: husky` — `pnpm install` run တိုင်း hook auto-install။
New team members: `git clone && pnpm install` → hooks ready.

## Documentation dual-track

| Location             | Purpose                                                                  | Git |
| -------------------- | ------------------------------------------------------------------------ | --- |
| **`wiki/`**          | Committed knowledge — phase index, PM tracker, conventions, API contract | Yes |
| **`docs/sessions/`** | Gitignored daily evidence — detailed session notes by date               | No  |

**Start here for SoftGate Comic phase history:**

1. [architecture/implementation-phases.md](architecture/implementation-phases.md) — SoftGate Comic Impl 1–193 (**next: 194**)
2. [architecture/implementation-phases-legacy.md](architecture/implementation-phases-legacy.md) — legacy immersive archive only
3. `docs/sessions/YYYY-MM-DD-session-summary.md` — local detail (`phases: [N]`)

### Session file naming

| Rule        | Value                                                                                               |
| ----------- | --------------------------------------------------------------------------------------------------- |
| Path        | `docs/sessions/YYYY-MM-DD-session-summary.md`                                                       |
| Date key    | Primary work **end date**; multi-day batch → one file with dated `## Phase N (YYYY-MM-DD)` sections |
| Git         | `docs/` gitignored — local only                                                                     |
| Wiki mirror | Same batch → `wiki/notes/YYYY-MM-DD-<slug>.md` (committed summary)                                  |

Agents must update **both** tracks after implementation work (Cursor rule `06-documentation-hygiene`) — user need not ask.

## Local portal HTTP (Impl 188)

Committed `apps/portal/.env.example` is `VITE_USE_MOCK_API=false`. Vite does **not** load the example. `isMockApi()` unset stays mock (Vercel without the var, Vitest). For this machine’s `pnpm dev` to hit the API, gitignored `apps/portal/.env.development.local` must be `false` and `pnpm dev:api` must be running. Do not put `false` in `.env` / `.env.local` (Vitest loads those). Do not merge portal + API into one process.

## Local session logs (agents)

Gitignored daily work evidence lives in `docs/sessions/` (e.g. `YYYY-MM-DD-session-summary.md`). Read the latest session file **and** `wiki/architecture/implementation-phases.md` when resuming UI work.

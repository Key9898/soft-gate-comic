---
title: Git Workflow & Documentation
type: convention
date: 2026-07-09
tags: [git, husky, wiki, sessions]
---

# Git Workflow

## Branches

- `main` — production / stable
- Feature branches: `feat/<scope>`, `fix/<scope>`, `chore/<scope>`

## Hooks

### pre-commit (`.husky/pre-commit`)

Runs `npx lint-staged` — only touches **staged files**:

| Pattern                  | Task                                |
| ------------------------ | ----------------------------------- |
| `*.{ts,tsx}`             | `eslint --fix` → `prettier --write` |
| `*.{js,jsx,json,css,md}` | `prettier --write`                  |

### pre-push (`.husky/pre-push`)

Runs `npm run check` — full project validation:

1. `eslint .`
2. `prettier --check`
3. `vitest run`
4. `tsc -b && vite build`

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

`package.json` ထဲမှာ `prepare: husky` — `npm install` run တိုင်း hook auto-install။
New team members: `git clone && npm install` → hooks ready.

## Documentation dual-track

| Location             | Purpose                                                                  | Git |
| -------------------- | ------------------------------------------------------------------------ | --- |
| **`wiki/`**          | Committed knowledge — phase index, PM tracker, conventions, API contract | Yes |
| **`docs/sessions/`** | Gitignored daily evidence — detailed session notes by date               | No  |

**Start here for SoftGate Comic phase history:**

1. [architecture/implementation-phases.md](architecture/implementation-phases.md) — SoftGate Comic Impl 1–154 (**next: 155**)
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

## Local session logs (agents)

Gitignored daily work evidence lives in `docs/sessions/` (e.g. `YYYY-MM-DD-session-summary.md`). Read the latest session file **and** `wiki/architecture/implementation-phases.md` when resuming UI work.

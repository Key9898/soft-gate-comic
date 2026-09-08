---
title: Long-lived development branch for leader dev stack
type: decision
date: 2026-09-08
tags: [git, env, railway, softgate]
---

# Long-lived development branch for leader dev stack

## Status

Accepted

## Context

The repo used `main` plus `feat/` / `fix/` / `chore/` only. The second team leader’s PostgreSQL, R2, Brevo, and JWT values are **development**. Production keys will come later on the client server. Putting that stack on `main` as the default would mix product/UI with a non-prod environment.

## Decision

- `main` is product/UI and the Vercel deploy branch. Mock-safe default stays (`isMockApi()` unset = mock).
- `development` is the integration track for the leader **dev** stack. Live URLs and secrets stay in gitignored local env. Never commit them.
- UI feature branches start from `main`. Infra work against the leader dev stack starts from `development`.
- Do not auto-deploy `development` to production. Do not merge an Admin `development` branch into this repo.

## Consequences

- Both branches share product commits (185–192 landed on `main` first). `development` is created from that tip plus this workflow change.
- Local `.env` / `.env.development.local` remain gitignored. `.env.example` stays stub-only.
- Prod cutover is a later env + deploy change, not this branch’s default.

## Alternatives considered

- Keys-only on `main` with no second branch — rejected; leader stack is explicitly not production.
- GitFlow `develop` — rejected; the branch name is `development`.

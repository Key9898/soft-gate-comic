---
title: Git development branch for leader dev stack
type: note
date: 2026-09-08
tags: [git, workflow, env, softgate]
---

# Git development branch for leader dev stack

Not a numbered Impl. `main` stays product/UI and Vercel. `development` is the long-lived track for the second leader’s **dev** PostgreSQL/R2/Brevo/JWT stack. Secrets stay in gitignored local env. Mock catalog is unchanged. Next product Impl remains **193**.

## What shipped

- `.gitignore` also ignores `.env.development` and `*.tsbuildinfo`
- Branch convention + ADR 012
- Product 185–192 committed on `main` first, then this workflow, then `development` from that tip

## Out

- Writing `apps/api/.env` / leader keys into git or wiki
- Vercel deploy of `development`
- Admin repo merge
- Catalog CMS / mock removal

Convention: [02-workflow.md](../02-workflow.md). ADR: [012-development-branch.md](../decisions/012-development-branch.md).

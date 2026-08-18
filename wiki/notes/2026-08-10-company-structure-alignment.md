---
title: Impl 6 — Company scaffolding standards (SoftGate Comic)
type: note
date: 2026-08-10
tags: [structure, scaffolding, husky, agents, dual-track, impl-6]
impl: 6
---

# Impl 6 — Company scaffolding standards (SoftGate Comic)

SoftGate Comic uses the company frontend scaffolding standard: Husky + lint-staged, dual-track wiki/sessions, root `AGENTS.md` + Lark hand-off, LF via `.gitattributes`, and documented scripts/editor recommendations.

## Already in place (unchanged this pass)

- Husky pre-commit → `lint-staged` (per staged file)
- Husky pre-push → `npm run check`
- Cursor rules 00–06 + wiki skill + wiki folder shape

## Closed gaps (2026-08-10)

| Item             | Change                                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
| Dual-track truth | `.gitignore` now includes `docs/`; session files untracked (`git rm --cached`)                               |
| LF policy        | Added `.gitattributes` (`* text=auto eol=lf`)                                                                |
| Agent contract   | Root `AGENTS.md` (dual-track + Lark delimiters + never auto commit/push); `.agents/AGENTS.md` points to root |
| Scripts          | `lint:fix`, `test:ui` (+ `@vitest/ui`)                                                                       |
| Editor           | `.vscode/extensions.json`                                                                                    |
| README           | Minimal SoftGate README                                                                                      |
| Rule 03          | Matches Prettier (`semi: false`, `trailingComma: es5`) — did not reformat tree                               |
| Wiki             | `03-folder-map.md` + `README.md` SoftGate paths; `02-workflow.md` LF note                                    |

## SoftGate-specific (by design)

- Storybook, `packages/shared`, comic `src/features/`
- Portal light-only + i18n `en`/`mm`
- Tooling: Vite 5, Vitest 4, TypeScript 5.5

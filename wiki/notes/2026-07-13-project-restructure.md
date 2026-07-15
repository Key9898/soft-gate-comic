---
title: Project Restructure & Tailwind v4 Alignment
type: note
date: 2026-07-13
tags: [architecture, tailwind, typescript, config]
---

# Project Restructure & Tailwind v4 Alignment (2026-07-13)

Refactored WebPad project layout and configurations to match the structural architecture of the `ai-poc-frontend` scaffold.

## Summary of Refactoring

- **Tailwind v4 Upgrade**: Swapped PostCSS and `tailwind.config.js` with `@tailwindcss/vite` in `vite.config.ts` and `@theme` variables inside `src/index.css`.
- **TypeScript References**: Router `tsconfig.json` referencing `tsconfig.app.json` and `tsconfig.node.json`.
- **Feature-based Folders**: Reorganized `src/pages/` to `src/features/` folders.
- **Centralized Testing**: Reorganized tests into `src/test/` to keep clean feature folders.
- **Rules & Wiki Sync**: Created `.cursor/rules/`, `.cursor/skills/`, and long-term `wiki/` documentation for assistant context.

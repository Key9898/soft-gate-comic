---
title: Light Theme Default
type: note
date: 2026-07-06
tags: [theme, dark-mode, ux]
---

# Light Theme Default

PoC first load uses **light theme** unless the user has a saved preference in `localStorage` (`theme` key).

## Decision

- Removed `prefers-color-scheme: dark` auto-detection from `getPreferredTheme()` in `src/lib/theme.ts`.
- Rationale: demo consistency, easier QA in light mode; header `ThemeSwitch` still lets users pick dark and persists choice.

## Behavior

| State                         | Theme           |
| ----------------------------- | --------------- |
| No `localStorage.theme`       | light           |
| `localStorage.theme = 'dark'` | dark            |
| User toggles switch           | saved + applied |

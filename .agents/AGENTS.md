# Workspace Rules

Canonical agent operating contract: **[`AGENTS.md`](../AGENTS.md)** at the repo root (dual-track docs, Lark Task hand-off, quality bar, never auto-commit/push).

Short reminders kept here for tools that only load `.agents/`:

## Lark Checklist Formatting

- When providing a copy-pasteable checklist summary for Lark manual update, do NOT include checkmark indicators like `[x]` or `[ ]` in the markdown list items. Use plain `-` bullets.
- Prefer the full `=== LARK TASK ===` delimiter block from root `AGENTS.md` so Title + Notes copy in one shot.

## Forced product motion

SoftGate product animations we add must play for every visitor (including Windows Animation effects off). Do not gate them on `prefers-reduced-motion`. Canonical: [`wiki/conventions/forced-product-motion.md`](../wiki/conventions/forced-product-motion.md).

## Git Push Constraints

- DO NOT ever run `git commit` or `git push` yourself unless the user explicitly asks. Let the user review the staged/modified files and commit/push them manually.

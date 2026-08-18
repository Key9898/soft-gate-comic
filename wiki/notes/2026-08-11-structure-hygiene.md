---
title: Structure hygiene — dead modules, orphans, AuthContext
type: note
date: 2026-08-11
tags: [structure, auth, barrels, softgate]
impl: 19
---

# Structure hygiene (Impl 19)

Phase A of structure standardization.

## Changes

- Deleted unused `src/constants/` and `src/types/` (0 consumers; ROUTES/STORAGE_KEYS were drifted).
- Deleted orphan `Card` + `Comments` components (stories/tests only; product uses `BookCard`; Reader keeps inline comments UI).
- Added barrels: `components/SEO/index.ts`, `components/SearchAutocomplete/index.ts` (deep imports still valid).
- Moved auth implementation to `src/context/AuthContext.tsx`; `features/auth/useAuth.tsx` re-exports; shell/tests import context.
- Convention: [source-layering-and-imports.md](../conventions/source-layering-and-imports.md).
- Folder map updated (no `constants/` / `types/`).

## Verify

`npm run check`; smoke login, protected library, nav, home BookCard, reader comments modal.

## Follow-up

Phase B presentational splits (Profile → Library → Coins) as separate Impls. Phase C parking lot documented in convention — no Impl.
